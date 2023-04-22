/// <reference path="global.d.ts" />

type ConfigObject = {
	input?: string;
	output?: string;
	requireConfig?: boolean;
	bdPath?: string;
	importAliases?: Record<string, string>;
	postcssPlugins?: any[];
};

type ConfigFunction = (plugin: string, dev: boolean) => ConfigObject;

type Config = ConfigObject | ConfigFunction;

/**
 * An optional function that allows for type checking and autocomplete for BundleBD config files.
 */
export const defineConfig: (config: Config) => any;
