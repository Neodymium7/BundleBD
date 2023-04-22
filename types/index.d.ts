/// <reference path="global.d.ts" />

type ConfigObject = {
	/**
	 * The path to the plugin's input folder.
	 */
	input?: string;
	/**
	 * The path to the folder that the bundled plugin will be placed into.
	 */
	output?: string;
	/**
	 * Whether or not to require a plugin config file.
	 */
	requireConfig?: boolean;
	/**
	 * Whether or not to include comments in the bundled plugin marking imported files and modules.
	 */
	moduleComments?: boolean;
	/**
	 * Options for formatting the bundled plugin.
	 */
	format?: {
		/**
		 * A string to use for indentation.
		 */
		indent?: string;
	};
	/**
	 * An absolute path to BetterDiscord's main folder, used to copy the bundled plugin when in dev mode.
	 */
	bdPath?: string;
	/**
	 * An object of import aliases to use when bundling the plugin.
	 */
	importAliases?: Record<string, string>;
	/**
	 * An array of PostCSS plugins to use when bundling the plugin.
	 */
	postcssPlugins?: any[];
};

type ConfigFunction = (plugin: string, dev: boolean) => ConfigObject;

type Config = ConfigObject | ConfigFunction;

/**
 * An optional function that allows for type checking and autocomplete for BundleBD config files.
 */
export const defineConfig: (config: Config) => any;
