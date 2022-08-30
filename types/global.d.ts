/// <reference path="bdapi.d.ts" />
/// <reference path="zlibrary.d.ts" />

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
	export const content: string;

	export default classNames;
}

declare module "*.css?module" {
	export { default as default } from "*.module.css";
	export { content } from "*.module.css";
}

declare module "*.module.scss" {
	export { default as default } from "*.module.css";
	export { content } from "*.module.css";
}

declare module "*.scss?module" {
	export { default as default } from "*.module.css";
	export { content } from "*.module.css";
}

declare module "*.module.sass" {
	export { default as default } from "*.module.css";
	export { content } from "*.module.css";
}

declare module "*.sass?module" {
	export { default as default } from "*.module.css";
	export { content } from "*.module.css";
}

declare module "*.css" {
	/**
	 * A string containing the contents of the stylesheet.
	 */
	const content: string;
	export default content;
}

declare module "*.scss" {
	export { default as default } from "*.css";
}

declare module "*.sass" {
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
	 * A React Component cotaining the SVG. Any props will be passed to the SVG.
	 */
	const Component: React.FunctionComponent<Record<string, any>>;
	export default Component;
}

declare module "*.svg?url" {
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
