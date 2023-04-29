import fs from "fs";
import path from "path";
import { RollupOptions } from "rollup";
import { Meta } from "bdapi";
import { checkDirExists, ensureDirExists, ensureFileExists } from "../utils";
import Logger from "../logger";
import { BundleBDOptions } from "./bundler";
import { PluginConfiguration } from "./plugin";

import alias from "@rollup/plugin-alias";
import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace, { RollupReplaceOptions } from "@rollup/plugin-replace";
import svgr from "@svgr/rollup";
import esbuild from "rollup-plugin-esbuild";
import styles from "rollup-plugin-styles";
import styleLoader from "../plugins/styleloader";
import text from "../plugins/text";
import moduleComments from "../plugins/modulecomments";
import constPlugin from "../plugins/const";
import meta from "../plugins/meta";

type AliasEntry = { find: RegExp; replacement: string };

const resolveExtensions = [".js", ".ts", ".jsx", ".tsx"];

const polyfilled = [
	"request",
	"https",
	"original-fs",
	"fs",
	"path",
	"events",
	"electron",
	"process",
	"vm",
	"module",
	"buffer",
	"crypto",
];

const stylesRegex = /(\.css$)|(\.s[ac]ss$)|(\.less$)|(\.styl$)/;
const constRegex = new RegExp(stylesRegex.source + "|(\\.svg$)|(\\.png$)|(\\.jpg$)|(\\.jpeg$)|(\\.gif$)|(\\.webp$)");

const createReplaced = (globals: Record<string, string>): RollupReplaceOptions => {
	const replaced = {
		delimiters: ["= ", ";"] as [string, string],
		preventAssignment: true,
	};
	for (const key in globals) {
		replaced[`require('${key}')`] = replaced.delimiters[0] + globals[key] + replaced.delimiters[1];
	}
	return replaced;
};

const createAliases = (aliases: Record<string, string>) => {
	const entries: AliasEntry[] = [];
	for (const key in aliases) {
		entries.push({
			find: new RegExp(`^${key.replace("/*", "(.*)")}$`),
			replacement: path.resolve(aliases[key].replace("/*", "$1")),
		});
	}
	return entries;
};

export default function getRollupConfig(options: BundleBDOptions, pluginConfig: PluginConfiguration, pluginMeta: Meta) {
	const globals = {
		betterdiscord: `new BdApi("${pluginMeta.name}")`,
		zlibrary: "Library",
		"zlibrary/plugin": "BasePlugin",
		react: "BdApi.React",
		"react-dom": "BdApi.ReactDOM",
		lodash: "_",
	};

	const entryDir = path.join(process.cwd(), options.input);
	ensureDirExists(entryDir, `Cannot find input directory '${entryDir}'`);

	const entryPath = path.join(entryDir, pluginConfig.entry);
	ensureFileExists(
		entryPath,
		`Cannot resolve entry file. Check the 'entry' property in the plugin's configuration`,
		resolveExtensions
	);

	const outputDir = path.join(process.cwd(), options.output);
	if (!checkDirExists(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

	const outputPath = path.join(outputDir, pluginMeta.name.replace(/\s/g, "") + ".plugin.js");

	// To stop ts from complaining
	type StylesMode = ["inject", (varname: string, id: string) => string];
	const stylesOptions = {
		mode: [
			"inject",
			(varname: string, id: string) => `_loadStyle("${path.basename(id)}", ${varname});`,
		] as StylesMode,
		plugins: options.postcssPlugins,
	};

	const rollupConfig: RollupOptions = {
		input: entryPath,
		output: {
			file: outputPath,
			format: pluginConfig.zlibrary ? "iife" : "cjs",
			exports: "default",
			globals: {
				...globals,
				...polyfilled.reduce((prev, curr) => ({ ...prev, [curr]: `require('${curr}')` }), {}),
			},
			name: "Plugin",
			interop: "default",
			generatedCode: {
				constBindings: true,
				objectShorthand: true,
				arrowFunctions: true,
			},
		},
		external: [...Object.keys(globals), ...polyfilled],
		plugins: [
			nodeResolve({ extensions: resolveExtensions }),
			styles({
				exclude: /\.module\.\S+$/,
				...stylesOptions,
			}),
			styles({
				include: /\.module\.\S+$/,
				modules: {
					generateScopedName(name, file) {
						return pluginMeta.name + "-" + path.basename(file).split(".")[0] + "-" + name;
					},
				},
				...stylesOptions,
			}),
			styleLoader({ regex: stylesRegex }),
			text(),
			json({
				preferConst: true,
				indent: options.format.indent,
			}),
			image(),
			svgr({
				namedExport: "Component",
				jsxRuntime: "automatic",
				babel: false,
			}),
			esbuild({
				target: "es2022",
				jsxFactory: "BdApi.React.createElement",
				jsxFragment: "BdApi.React.Fragment",
				loaders: {
					".js": "jsx",
					".ts": "tsx",
					".svg": "jsx",
				},
				jsx: "transform",
			}),
			constPlugin({ regex: constRegex }),
			replace(createReplaced(globals)),
			meta(pluginMeta),
			options.moduleComments && moduleComments({ root: entryDir, aliases: options.importAliases }),
			options.importAliases &&
				alias({
					entries: createAliases(options.importAliases),
				}),
		],
		onwarn: ({ message }) => Logger.warn(message),
	};

	return rollupConfig;
}
