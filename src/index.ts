#!/usr/bin/env node

import fs from "fs";
import path from "path";
import webpack from "webpack";
import beautify from "js-beautify";
import { argv, checkDirExists, parseString } from "./utils";
import Logger from "./logger";
import getConfigs from "./config";
import zlibTemplate from "./templates/zlibrary";

const [webpackConfig, pluginConfig, bundleConfig] = getConfigs();

webpack(webpackConfig, (err, stats) => {
	if (err) {
		Logger.error(err.stack || err.message);
	}
	if (stats?.hasErrors()) {
		const errors = stats.toJson().errors;
		for (const error of errors!) {
			Logger.error(error.message);
		}
	}
	if (stats?.hasWarnings()) {
		const warnings = stats.toJson().errors;
		for (const warning of warnings!) {
			Logger.warn(warning.message);
		}
	}

	// Yes, the path and filename are defined typescript, I promise
	const outputPath = webpackConfig.output!.path!;
	const outputFilename = webpackConfig.output!.filename as string;

	let packed = fs.readFileSync(path.join(outputPath, outputFilename), "utf8");

	// Add meta object
	const metaObject = JSON.stringify(pluginConfig.meta).replace(/"([^"]+)":/g, "$1:");
	packed = packed.slice(0, 6) + `const meta = ${metaObject};` + packed.slice(6);

	const importsZlib = packed.includes("external_Library_namespaceObject");
	const importsBasePlugin = packed.includes("external_BasePlugin_namespaceObject");

	// Warn if importing zlib without building with zlib support
	if ((importsZlib || importsBasePlugin) && !pluginConfig.zlibrary) {
		Logger.warn(
			"It appears the plugin imports ZLibrary, but is not being built with ZLibrary support. Did you mean to set 'build.zlibrary' to true in the plugin's configuration?"
		);
	}

	// Warn if using zlib without base Plugin class
	if (pluginConfig.zlibrary && !importsBasePlugin) {
		Logger.warn(
			"It appears the plugin uses ZLibrary, but does not extend ZLibrary's base Plugin class. The plugin may not work."
		);
	}

	// Build with zlib
	if (pluginConfig.zlibrary) packed = zlibTemplate(packed, pluginConfig.meta, pluginConfig.changelog);

	// Add meta to packed file
	const meta = `/**\n${Object.keys(pluginConfig.meta).reduce(
		(string, key) => (string += ` * @${key} ${pluginConfig.meta[key]}\n`),
		""
	)} */\n`;

	// Beautify
	packed = beautify(packed, { indent_with_tabs: true });

	fs.writeFileSync(path.join(outputPath, outputFilename), meta + packed);

	Logger.log(`Done! Plugin '${pluginConfig.meta.name}' bundled successfully`);

	// Readme parse and copy
	if (bundleConfig.readme) {
		const entryDir = path.join(process.cwd(), parseString(bundleConfig.entry, { plugin: argv.plugin }));
		const readmePath = path.join(entryDir, "README.md");
		if (!fs.existsSync(readmePath)) Logger.warn(`Cannot find file ${readmePath}`);
		else {
			const readme = fs.readFileSync(readmePath, "utf8");
			const parsedReadme = parseString(readme, pluginConfig.meta, { open: "{{", close: "}}" });

			let readmeOutputPath = outputPath;
			if (typeof bundleConfig.readme === "string") {
				readmeOutputPath = path.join(process.cwd(), parseString(bundleConfig.readme, { plugin: argv.plugin }));
			}
			fs.writeFileSync(path.join(readmeOutputPath, "README.md"), parsedReadme);
		}
	}

	// Copying plugin with dev mode
	if (argv.development) {
		if (!bundleConfig.bdPath) {
			Logger.warn(
				"Cannot find property 'bdPath' in bundle.config.json: Bundled plugin will not be copied to BetterDiscord"
			);
		} else if (bundleConfig.bdPath !== "none" && !checkDirExists(path.resolve(bundleConfig.bdPath))) {
			Logger.warn(
				`'${bundleConfig.bdPath}' is not a valid directory: Bundled plugin will not be copied to BetterDiscord`
			);
		} else if (bundleConfig.bdPath !== "none") {
			fs.copyFileSync(
				path.join(outputPath, outputFilename),
				path.join(bundleConfig.bdPath, "plugins", outputFilename)
			);
			Logger.log("Plugin copied to BetterDiscord");
		}

		Logger.log("Watching for changes...");
		Logger.break();
	}
});
