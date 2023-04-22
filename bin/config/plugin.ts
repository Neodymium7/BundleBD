import fs from "fs";
import path from "path";
import Logger from "../logger";
import { Meta } from "bdapi";
import { BundleBDOptions } from "./bundler";

export interface ZLibraryConfig {
	info?: any;
	changelog?: {
		title: string;
		type?: string;
		items: string[];
	}[];
	defaultConfig?: any;
}

export interface PluginConfiguration {
	entry: string;
	installScript: boolean;
	zlibrary: boolean | ZLibraryConfig;
}

const pluginConfigFileName = "plugin.json";

const defaultPluginMeta = {
	name: "Plugin",
	author: "Unknown",
	description: "Plugin bundled with BundleBD",
	version: "1.0.0",
};

const defaultPluginConfig = {
	entry: "index",
	installScript: true,
	zlibrary: false,
};

const metaKeys = [
	"name",
	"author",
	"description",
	"version",
	"invite",
	"authorId",
	"authorLink",
	"donate",
	"patreon",
	"website",
	"source",
];

const pluginConfigKeys = ["entry", "installScript", "zlibrary"];

export default function getPluginConfig(options: BundleBDOptions) {
	const pluginConfigPath = path.join(process.cwd(), options.input, pluginConfigFileName);

	const pluginConfig: PluginConfiguration = options.requireConfig ? ({} as PluginConfiguration) : defaultPluginConfig;
	const pluginMeta: Meta = defaultPluginMeta;

	if (fs.existsSync(pluginConfigPath)) {
		const config = JSON.parse(fs.readFileSync(pluginConfigPath, "utf-8"));

		for (const key in config) {
			if (metaKeys.includes(key)) {
				pluginMeta[key] = config[key];
			} else if (pluginConfigKeys.includes(key)) {
				pluginConfig[key] = config[key];
			} else {
				Logger.warn(`Unknown key '${key}' in ${pluginConfigFileName}`);
			}
		}
	} else if (options.requireConfig) {
		Logger.error(
			`No ${pluginConfigFileName} found. A plugin configuration is required. Disable the 'require-config' option to use a default configuration instead.`
		);
	} else {
		Logger.warn(`No ${pluginConfigFileName} found. Using default configuration.`);
	}

	if (options.requireConfig) {
		for (const key in defaultPluginMeta) {
			if (!(key in pluginMeta))
				Logger.error(`Missing required configuration option '${key}' in ${pluginConfigFileName}.`);
		}
	}

	return { pluginConfig, pluginMeta };
}
