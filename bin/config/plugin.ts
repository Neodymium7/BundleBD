import fs from "fs";
import path from "path";
import Logger from "../logger";
import { Meta } from "bdapi";
import { BundleBDOptions } from "./bundler";

export interface PluginConfiguration {
	entry: string;
	installScript: boolean;
}

const pluginConfigFileName = "manifest.json";

const defaultPluginConfig = {
	entry: "index",
	installScript: true,
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

const pluginConfigKeys = ["entry", "installScript"];

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
			}
		}
	} else {
		Logger.error(`No ${pluginConfigFileName} found. A plugin configuration is required.`);
	}

	for (const key of requiredMetaKeys) {
		if (!(key in pluginMeta))
			Logger.error(`Missing required configuration option '${key}' in ${pluginConfigFileName}.`);
	}

	if (options.dev) pluginMeta.version += "-dev";

	return { pluginConfig, pluginMeta };
}
