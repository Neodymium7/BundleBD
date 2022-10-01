import fs from "fs";
import path from "path";
import webpack, { ProgressPlugin, ProvidePlugin } from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import { parseString, argv, ensureDirExists } from "./utils";
import Logger from "./logger";

interface bundleConfiguration {
	entry: string;
	output: string;
	readmeOutput?: string;
	devOutput?: string;
	bdPath?: string;
}

interface pluginConfiguration {
	meta: {
		name: string;
		author: string;
		description: string;
		version: string;
		invite?: string;
		authorId?: string;
		authorLink?: string;
		donate?: string;
		patreon?: string;
		website?: string;
		source?: string;
	};
	changelog?: Array<{
		title: string;
		type?: string;
		items: string[];
	}>;
	entry?: string;
	zlibrary?: boolean;
	readme?: boolean;
}

function getBundleConfig(): bundleConfiguration {
	const configPath = path.join(process.cwd(), "bundlebd.config.json");
	const defaultConfig = { entry: "src", output: "dist" };
	const config: bundleConfiguration = Object.assign(
		defaultConfig,
		fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, "utf-8")) : {}
	);
	for (const key in config) {
		if (config[key].includes("[plugin]")) {
			if (!argv.plugin) {
				Logger.error(
					`The Bundler Configuration option '${key}' contains '[plugin],' but no Plugin argument was provided`
				);
			} else {
				config[key] = parseString(config[key], { plugin: argv.plugin });
			}
		}
	}
	return config;
}

function getPluginConfig(entry: string): pluginConfiguration {
	const defaultMeta = {
		name: "Plugin",
		author: "Unknown",
		description: "Plugin bundled with BundleBD",
		version: "1.0.0"
	};

	const acceptedMetaKeys = [
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
		"updateUrl"
	];

	const configPath = path.join(entry, "config.json");
	if (fs.existsSync(configPath)) {
		const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
		const meta = Object.assign(defaultMeta, config.meta);
		for (const key in meta) {
			if (!acceptedMetaKeys.includes(key)) {
				Logger.warn(`Invalid meta key '${key}' in config.json`);
				delete meta[key];
			}
		}
		if (config.changelog && !config.zlibrary) {
			Logger.warn("Changelogs are currently only supported for plugins using ZLibrary");
		}
		return { ...config, meta };
	} else return { meta: defaultMeta };
}

export default function getConfigs(): [webpack.Configuration, pluginConfiguration, bundleConfiguration] {
	const bundleConfig = getBundleConfig();

	const entryDir = path.join(process.cwd(), bundleConfig.entry);
	ensureDirExists(entryDir, `Cannot find entry directory '${entryDir}'`);

	const pluginConfig = getPluginConfig(entryDir);

	const styleLoader = path.resolve(__dirname, "loaders/style.js");
	const esbuildLoader = (loader: string) => ({
		loader: "esbuild-loader",
		options: {
			loader: loader,
			target: "es2020",
			tsconfigRaw: {
				compilerOptions: {
					jsx: "react"
				}
			}
		}
	});
	const svgLoader = {
		loader: "@svgr/webpack",
		options: {
			jsxRuntime: "automatic",
			babel: false
		}
	};
	const styleRules = (regex: RegExp, preLoaders?: string[]) => [
		{
			test: regex,
			resourceQuery: { not: [/module/] },
			use: [
				styleLoader,
				{
					loader: "css-loader",
					options: {
						modules: {
							auto: new RegExp(`\\.module${regex.source}`),
							localIdentName: pluginConfig.meta.name + "-[name]-[local]"
						},
						importLoaders: preLoaders?.length || 0
					}
				},
				...(preLoaders || [])
			]
		},
		{
			test: regex,
			resourceQuery: /module/,
			use: [
				styleLoader,
				{
					loader: "css-loader",
					options: {
						modules: {
							localIdentName: pluginConfig.meta.name + "-[name]-[local]"
						},
						importLoaders: preLoaders?.length || 0
					}
				},
				...(preLoaders || [])
			]
		}
	];

	const webpackConfig: webpack.Configuration = {
		mode: "production",
		watch: argv.development,
		target: "node",
		entry: pluginConfig.entry ? path.join(entryDir, pluginConfig.entry) : entryDir,
		output: {
			filename: pluginConfig.meta.name.replace(/\s/g, "") + ".plugin.js",
			path: path.resolve(argv.development ? bundleConfig.devOutput ?? bundleConfig.output : bundleConfig.output),
			library: pluginConfig.zlibrary
				? {
						type: "assign",
						name: "Plugin"
				  }
				: {
						type: "commonjs2",
						export: "default"
				  }
		},
		resolve: {
			extensions: [".js", ".jsx", ".ts", ".tsx"],
			alias: {
				styles: path.resolve(__dirname, "modules/styles")
			}
		},
		module: {
			rules: [
				{
					test: /\.jsx?$/,
					use: esbuildLoader("jsx")
				},
				{
					test: /\.tsx?$/,
					use: esbuildLoader("tsx")
				},
				...styleRules(/\.css$/),
				...styleRules(/\.s[ac]ss$/, ["sass-loader"]),
				{
					test: /\.txt$/,
					type: "asset/source"
				},
				{
					test: /\.svg$/,
					issuer: /\.[jt]sx?$/,
					resourceQuery: { not: [/url/] },
					use: [esbuildLoader("jsx"), svgLoader]
				},
				{
					test: /\.svg$/,
					issuer: /\.[jt]sx?$/,
					resourceQuery: /url/,
					type: "asset/inline"
				},
				{
					test: /\.svg$/,
					issuer: { not: /\.[jt]sx?$/ },
					type: "asset/inline"
				},
				{
					test: /\.png$|\.jpe?g$/,
					type: "asset/inline"
				}
			]
		},
		externals: {
			react: "var BdApi.React",
			"react-dom": "var BdApi.ReactDOM",
			zlibrary: "var Library",
			"zlibrary/plugin": "var BasePlugin",
			pluginName: `var "${pluginConfig.meta.name}"`,
			betterdiscord: "var BdApi"
		},
		plugins: [
			new ProvidePlugin({
				React: "react"
			}),
			new ProgressPlugin()
		],
		optimization: {
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						compress: { defaults: false },
						format: { comments: false },
						mangle: false
					}
				})
			]
		}
	};

	return [webpackConfig, pluginConfig, bundleConfig];
}
