/// <reference types="@betterdiscord/types" />

declare module "betterdiscord" {
	import * as react_dom from "react-dom";
	import * as react from "react";

	/** The React module being used inside Discord */
	export const React: typeof react;

	/** The ReactDOM module being used inside Discord */
	export const ReactDOM: typeof react_dom & typeof react_dom_client;

	/** A reference string for BD's version */
	export const version: string;

	/** A set of react components plugins can make use of */
	export const Components: BetterDiscord.Components;

	/** An instance of {@link BetterDiscord.Net} for using network related tools */
	export const Net: BetterDiscord.Net;

	/** An instance of {@link BetterDiscord.Webpack} to search for modules */
	export const Webpack: BetterDiscord.Webpack;

	/** An instance of {@link BetterDiscord.AddonAPI} to access plugins */
	export const Plugins: BetterDiscord.AddonAPI;

	/** An instance of {@link BetterDiscord.AddonAPI} to access themes */
	export const Themes: BetterDiscord.AddonAPI;

	/** An instance of {@link BetterDiscord.Utils} for general utility functions */
	export const Utils: BetterDiscord.Utils;

	/** An instance of {@link BetterDiscord.UI} to create interfaces */
	export const UI: BetterDiscord.UI;

	/** An instance of {@link BetterDiscord.ReactUtils} to work with React */
	export const ReactUtils: BetterDiscord.ReactUtils;

	/** An instance of {@link BetterDiscord.ContextMenu} for interacting with context menus */
	export const ContextMenu: BetterDiscord.ContextMenu;

	/** An instance of {@link BetterDiscord.Patcher} to monkey patch functions */
	export const Patcher: BetterDiscord.BoundPatcher;

	/** An instance of {@link BetterDiscord.Data} to manage data */
	export const Data: BetterDiscord.BoundData;

	/** An instance of {@link BetterDiscord.DOM} to interact with the DOM */
	export const DOM: BetterDiscord.BoundDOM;

	/** An instance of {@link BetterDiscord.Logger} for logging information */
	export const Logger: BetterDiscord.BoundLogger;

	/** An instance of {@link BetterDiscord.CommandAPI} for adding slash commands */
	export const Commands: BetterDiscord.BoundCommandAPI;

	/** An instance of {@link BetterDiscord.Hooks} for react hooks */
	export const Hooks: BetterDiscord.BoundHooks;
}

declare module "styles" {
	/**
	 * A function that returns a string of all imported styles.
	 */
	export default function styles(): string;
}

declare module "*.module.css" {
	/**
	 * An object containing the CSS module's classes.
	 */
	const classNames: {
		[className: string]: string;
	};

	/**
	 * A string of the CSS module's content.
	 */
	export const css: string;

	export default classNames;
}

declare module "*.module.scss" {
	export { default as default } from "*.module.css";
	export { css } from "*.module.css";
}

declare module "*.module.sass" {
	export { default as default } from "*.module.css";
	export { css } from "*.module.css";
}

declare module "*.module.less" {
	export { default as default } from "*.module.css";
	export { css } from "*.module.css";
}

declare module "*.module.styl" {
	export { default as default } from "*.module.css";
	export { css } from "*.module.css";
}

declare module "*.css" {
	/**
	 * A string containing the contents of the stylesheet.
	 */
	const css: string;
	export default css;
}

declare module "*.scss" {
	export { default as default } from "*.css";
}

declare module "*.sass" {
	export { default as default } from "*.css";
}

declare module "*.less" {
	export { default as default } from "*.css";
}

declare module "*.styl" {
	export { default as default } from "*.css";
}

declare module "*.txt" {
	/**
	 * A string containing the contents of the text file.
	 */
	const content: string;
	export default content;
}

declare module "*.svg" {
	/**
	 * A React Component containing the SVG. Any props will be passed to the SVG.
	 */
	export const Component: React.FunctionComponent<Record<string, any>>;
	export { default as default } from "*.png";
}

declare module "*.png" {
	/**
	 * A string containing a Base64 encoded data url of the image.
	 */
	const url: string;
	export default url;
}

declare module "*.jpg" {
	export { default as default } from "*.png";
}

declare module "*.jpeg" {
	export { default as default } from "*.png";
}

declare module "*.gif" {
	export { default as default } from "*.png";
}

declare module "*.webp" {
	export { default as default } from "*.png";
}
