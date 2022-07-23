/// <reference path="./types/index.d.ts" />

/**
 * Utilities for managing and injecting styles. Will be included by default in any plugin that automatically loads a stylesheet.
 */
export default class Styles {
	private static styles = "";
	private static added: string[] = [];

	/**
	 * A method used by the bundler's internals: **avoid use in a plugin**. To add your own CSS dynamically, use {@link Styles.add} instead.
	 */
	static _load(css: string) {
		this.styles += css + "\n";
	}

	/**
	 * Injects styles from all imported stylesheets. Should be run on plugin start.
	 */
	static inject() {
		BdApi.injectCSS(meta.name, this.styles);
	}

	/**
	 * Adds and injects a string of CSS. Useful for adding styles dynamically or styles not included in imported stylesheets. Should be run after {@link Styles.inject}.
	 * @param css A string of CSS to add and inject.
	 */
	static add(css: string) {
		this.added.push(css);
		BdApi.injectCSS(meta.name, this.styles + this.added.join("\n"));
	}

	/**
	 * Removes a string of CSS that was added with {@link Styles.add}.
	 * @param css A string of CSS to remove.
	 */
	static remove(css: string) {
		this.added = this.added.filter((c) => c !== css);
		BdApi.injectCSS(meta.name, this.styles + this.added.join("\n"));
	}

	/**
	 * Clears all CSS and stylesheets that were previously injected. Should be run on plugin stop.
	 */
	static clear() {
		BdApi.clearCSS(meta.name);
		this.added = [];
	}
}
