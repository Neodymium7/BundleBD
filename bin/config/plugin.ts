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

const requiredMetaKeys = ["name", "author", "description", "version"];

const pluginConfigKeys = ["entry", "installScript", "zlibrary"];

export default function getPluginConfig(options: BundleBDOptions) {
	const pluginConfigPath = path.join(process.cwd(), options.input, pluginConfigFileName);

	const pluginConfig: PluginConfiguration = defaultPluginConfig;
	const pluginMeta = {} as Meta;

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
	} else {
		Logger.error(`No ${pluginConfigFileName} found. A plugin configuration is required.`);
	}

	for (const key of requiredMetaKeys) {
		if (!(key in pluginMeta))
			Logger.error(`Missing required configuration option '${key}' in ${pluginConfigFileName}.`);
	}

	return { pluginConfig, pluginMeta };
}
