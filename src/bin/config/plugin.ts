import fs from "fs";
import path from "path";
import Logger from "../logger";
import { Meta } from "bdapi";

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

const defaultPluginMeta = {
	name: "Plugin",
	author: "Unknown",
	description: "Plugin bundled with BundleBD",
	version: "1.0.0"
};

const defaultPluginConfig = {
	entry: "index",
	installScript: true,
	zlibrary: false
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
	"source"
];

const pluginConfigKeys = ["entry", "installScript", "zlibrary"];

export default function getPluginConfig(input: string) {
	const pluginConfigPath = path.join(process.cwd(), input, "plugin.json");

	const pluginConfig: PluginConfiguration = defaultPluginConfig;
	const pluginMeta: Meta = defaultPluginMeta;

	if (fs.existsSync(pluginConfigPath)) {
		const config = JSON.parse(fs.readFileSync(pluginConfigPath, "utf-8"));

		for (const key in config) {
			if (metaKeys.includes(key)) {
				pluginMeta[key] = config[key];
			} else if (pluginConfigKeys.includes(key)) {
				pluginConfig[key] = config[key];
			} else {
				Logger.warn(`Unknown key '${key}' in plugin.json`);
			}
		}
	} else Logger.warn("No plugin.json found. Using default configuration.");

	return { pluginConfig, pluginMeta };
}
