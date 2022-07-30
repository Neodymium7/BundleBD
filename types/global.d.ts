/// <reference path="bdapi.d.ts" />
/// <reference path="zlibrary.d.ts" />

declare const meta: {
	readonly name: string;
	readonly author: string;
	readonly description: string;
	readonly version: string;
	readonly invite?: string;
	readonly authorId?: string;
	readonly authorLink?: string;
	readonly donate?: string;
	readonly patreon?: string;
	readonly website?: string;
	readonly source?: string;
};

declare module "*.module.css" {
	/**
	 * An object containing the CSS module's classes and a string of the module's content.
	 */
	const content: {
		[className: string]: string;
		/**
		 * A string containing the contents of the CSS module.
		 */
		_content: string;
	};
	export default content;
}

declare module "*.css?module" {
	export { default as default } from "*.module.css";
}

declare module "*.module.scss" {
	export { default as default } from "*.module.css";
}

declare module "*.scss?module" {
	export { default as default } from "*.module.css";
}

declare module "*.module.sass" {
	export { default as default } from "*.module.css";
}

declare module "*.sass?module" {
	export { default as default } from "*.module.css";
}

declare module "*.css" {
	/**
	 * A string containing the contents of the CSS file.
	 */
	const content: string;
	export default content;
}

declare module "*.scss" {
	/**
	 * A string containing the contents of the compiled SCSS file.
	 */
	const content: string;
	export default content;
}

declare module "*.sass" {
	/**
	 * A string containing the contents of the compiled Sass file.
	 */
	const content: string;
	export default content;
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
