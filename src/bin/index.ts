import path from "path";
import fs from "fs";
import { rollup, watch as rollupWatch, OutputOptions, RollupBuild } from "rollup";
import packageInfo from "../../package.json";
import getPluginConfig from "./config/plugin";
import getRollupConfig from "./config/rollup";
import Logger from "./logger";
import { checkDirExists } from "./utils";
import installScript from "./templates/installscript";
import meta from "./templates/meta";
import zlibrary from "./templates/zlibrary";

export interface BundleBDOptions {
	input: string;
	output: string;
	dev: boolean;
	bdPath?: string;
	plugin?: string;
	postcssPlugins?: any[];
}

const universalOptionKeys = ["input", "output", "bdPath"];
const configOptionKeys = [...universalOptionKeys, "postcssPlugins"];
const argOptionKeys = [...universalOptionKeys, "dev", "plugin"];

const defaultOptions: BundleBDOptions = { input: "src", output: "dist", dev: false };

switch (process.platform) {
	case "win32":
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		defaultOptions.bdPath = path.join(process.env.USERPROFILE!, "AppData", "Roaming", "BetterDiscord");
		break;
	case "darwin":
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		defaultOptions.bdPath = path.join(process.env.HOME!, "Library", "Application Support", "BetterDiscord");
		break;
	case "linux":
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		defaultOptions.bdPath = path.join(process.env.HOME!, ".config", "BetterDiscord");
}

const argv = process.argv.slice(2);

if (argv[0] === "--version") {
	console.log(`v${packageInfo.version}`);
	process.exit(0);
}

const argOptions = argv.reduce<any>((obj, curr, i) => {
	if (!curr.startsWith("--") && i === 0) {
		obj.input = curr;
	}

	if (curr.startsWith("--")) {
		const option = curr.slice(2);
		const key = option
			.split("-")
			.map((item, i) => (i !== 0 ? item.charAt(0).toUpperCase() + item.substring(1) : item))
			.join("");
		const next = argv[i + 1];

		if (argOptionKeys.includes(key) && next && !next.startsWith("--")) obj[key] = next;
		else if (argOptionKeys.includes(key)) obj[key] = true;
		else Logger.warn(`Unknown command option '${option}'`);
	}

	return obj;
}, {});

const configOptions = (() => {
	const configPath = path.join(process.cwd(), "bundlebd.config.js");
	if (!fs.existsSync(configPath)) return {};

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	let config = require(configPath);

	if (typeof config === "function") {
		config = config(argOptions.plugin);
	}

	for (const key in config) {
		if (!configOptionKeys.includes(key)) {
			Logger.warn(`Unknown option '${key}' in bundlebd.config.js`);
		}
	}

	if (config.hasOwnProperty("input") && !config.input) Logger.error("The 'input' option cannot be undefined.");
	if (config.hasOwnProperty("output") && !config.output) Logger.error("The 'output' option cannot be undefined.");

	return config;
})();

const options: BundleBDOptions = { ...defaultOptions, ...configOptions, ...argOptions };

const { pluginConfig, pluginMeta } = getPluginConfig(options.input);

const { rollupConfig } = getRollupConfig(options, pluginConfig, pluginMeta);

async function bundle(bundle?: RollupBuild) {
	try {
		if (!bundle) bundle = await rollup(rollupConfig);
		const { output } = await bundle.generate(rollupConfig.output as OutputOptions);

		let code = output[0].code
			.trimEnd()
			.replace(/(?<=^| {2}|\t) {2}/gm, "\t")
			.replace(/\/\* @__PURE__ \*\/ /g, "")
			.replace("\nrequire('react');\n", "\n");

		if (pluginConfig.zlibrary) code = zlibrary(code, pluginMeta, pluginConfig.zlibrary);
		if (pluginConfig.installScript) code = installScript(code);
		code = meta(code, pluginMeta);

		const importsZlib = /\nvar \S+ = Library;\n/.test(code);
		const importsBasePlugin = /\nvar \S+ = BasePlugin;\n/.test(code);

		const outputPath: string = (rollupConfig.output as OutputOptions).file as string;

		// Warn if importing zlib without building with zlib support
		if ((importsZlib || importsBasePlugin) && !pluginConfig.zlibrary) {
			Logger.warn(
				"It appears the plugin imports ZeresPluginLibrary, but is not being built with ZeresPluginLibrary support. Did you mean to set 'zlibrary' to true in the plugin's configuration?"
			);
		}

		fs.writeFileSync(outputPath, code);
		Logger.log(`Done! Successfully bundled plugin '${pluginMeta.name}'`);

		// Copying plugin with dev mode
		if (options.dev) {
			const outputFilename = path.basename(outputPath);

			if (!options.bdPath) {
				Logger.warn("Cannot find 'bd-path' option, Bundled plugin will not be copied to BetterDiscord");
			} else if (options.bdPath !== "none" && !checkDirExists(path.resolve(options.bdPath))) {
				Logger.warn(
					`'${options.bdPath}' is not a valid directory, Bundled plugin will not be copied to BetterDiscord`
				);
			} else if (options.bdPath !== "none") {
				fs.copyFileSync(outputPath, path.join(options.bdPath, "plugins", outputFilename));
				Logger.log("Plugin copied to BetterDiscord");
			}
		}

		await bundle.close();
	} catch (error) {
		if (error.message.startsWith('"default" was specified for "output.exports",')) {
			Logger.error("No default export found. Make sure to export your plugin as the default export");
		} else Logger.error(error);
	}
}

function watch() {
	const watcher = rollupWatch({ ...rollupConfig, watch: { skipWrite: true } });

	watcher.on("event", (event) => {
		if (event.code === "BUNDLE_END") {
			bundle(event.result);
			event.result?.close();
		}
		if (event.code === "ERROR") {
			Logger.error(event.error.message);
			event.result?.close();
		}
	});

	watcher.close();
}

options.dev ? watch() : bundle();
