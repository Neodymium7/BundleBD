/// <reference path="zlibrary.d.ts" />

declare module "betterdiscord" {
	import type { BoundBdApi } from "bdapi";
	const BdApi: BoundBdApi;
	export = BdApi;
}

declare module "meta" {
	import { Meta } from "bdapi";
	const meta: Meta;
	export default meta;
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
