import path from "path";
import fs from "fs";
import { homedir } from "os";
import Logger from "../logger";

export interface BundleBDOptions {
	input: string;
	output: string;
	dev: boolean;
	format: {
		moduleComments: boolean;
		indent: string;
	};
	bdPath?: string;
	plugin?: string;
	importAliases?: Record<string, string>;
	postcssPlugins?: any[];
}

type OptionsKeys = (keyof BundleBDOptions)[];

const configFileName = "bundlebd.config.js";

const universalOptionKeys: OptionsKeys = ["input", "output", "bdPath"];
const configOptionKeys: OptionsKeys = [...universalOptionKeys, "format", "importAliases", "postcssPlugins"];
const argOptionKeys: OptionsKeys = [...universalOptionKeys, "dev", "plugin"];

const defaultOptions: BundleBDOptions = {
	input: "src",
	output: "dist",
	dev: false,
	format: {
		moduleComments: true,
		indent: "\t",
	},
};

switch (process.platform) {
	case "win32":
		defaultOptions.bdPath = path.join(homedir(), "AppData", "Roaming", "BetterDiscord");
		break;
	case "darwin":
		defaultOptions.bdPath = path.join(homedir(), "Library", "Application Support", "BetterDiscord");
		break;
	case "linux":
		defaultOptions.bdPath = path.join(homedir(), ".config", "BetterDiscord");
}

export default function getBundlerOptions(argv: string[]): BundleBDOptions {
	const argOptions = argv.reduce((obj, curr, i) => {
		if (!curr.startsWith("--") && i === 0) {
			obj.input = curr;
		}

		if (curr.startsWith("--")) {
			const option = curr.slice(2);
			// Convert kebab-case to camelCase
			const key = option
				.split("-")
				.map((item, i) => (i !== 0 ? item.charAt(0).toUpperCase() + item.substring(1) : item))
				.join("");
			const value = argv[i + 1];

			if (value && !value.startsWith("--") && argOptionKeys.includes(key as keyof BundleBDOptions)) {
				if (value === "true") obj[key] = true;
				else if (value === "false") obj[key] = false;
				else obj[key] = value;
			} else if (argOptionKeys.includes(key as keyof BundleBDOptions)) obj[key] = true;
			else Logger.warn(`Unknown command option '${option}'`);
		}

		return obj;
	}, {} as BundleBDOptions);

	let configOptions = {};
	const configPath = path.join(process.cwd(), configFileName);
	if (fs.existsSync(configPath)) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		let config = require(configPath);

		if (typeof config === "function") {
			config = config(argOptions.plugin, argOptions.dev || false);
		}

		for (const key in config) {
			if (!configOptionKeys.includes(key as keyof BundleBDOptions)) {
				Logger.warn(`Unknown option '${key}' in ${configFileName}}`);
			}
		}

		if (config.hasOwnProperty("input") && !config.input) Logger.error("The 'input' option cannot be undefined.");
		if (config.hasOwnProperty("output") && !config.output) Logger.error("The 'output' option cannot be undefined.");

		if (config.format) config.format = { ...defaultOptions.format, ...config.format };

		configOptions = config;
	}

	return { ...defaultOptions, ...configOptions, ...argOptions };
}
