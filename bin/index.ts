import path from "path";
import fs from "fs";
import { rollup, watch as rollupWatch, OutputOptions, RollupBuild } from "rollup";
import packageInfo from "../package.json";
import getBundlerOptions from "./config/bundler";
import getPluginConfig from "./config/plugin";
import getRollupConfig from "./config/rollup";
import Logger from "./logger";
import { checkDirExists } from "./utils";
import installScript from "./templates/installscript";
import meta from "./templates/meta";
import zlibrary from "./templates/zlibrary";

const argv = process.argv.slice(2);

if (argv[0] === "--version") {
	console.log(`v${packageInfo.version}`);
	process.exit(0);
}

const options = getBundlerOptions(argv);

const { pluginConfig, pluginMeta } = getPluginConfig(options);

const rollupConfig = getRollupConfig(options, pluginConfig, pluginMeta);

async function bundle(bundle?: RollupBuild) {
	try {
		if (!bundle) bundle = await rollup(rollupConfig);
		const { output } = await bundle.generate(rollupConfig.output as OutputOptions);

		let code = output[0].code
			.trimEnd()
			.replace(/(?<=^| {2}|\t) {2}/gm, options.format.indent)
			.replace(/\/\* @__PURE__ \*\/ /g, "")
			.replace("\nrequire('react');\n", "\n");

		if (pluginConfig.zlibrary) code = zlibrary(code, pluginMeta, pluginConfig.zlibrary, options.format.indent);
		if (pluginConfig.installScript) code = installScript(code, options.format.indent);
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
			Logger.error(event.error.message, false);
			event.result?.close();
		}
	});

	watcher.close();
}

options.dev ? watch() : bundle();
