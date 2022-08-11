/// <reference path="../types/global.d.ts" />

import { Webpack } from "betterdiscord";

/**
 * A locale availbe in Discord.
 */
type localeCode =
	| "da"
	| "de"
	| "en-US"
	| "es-ES"
	| "fr"
	| "hr"
	| "it"
	| "lt"
	| "hu"
	| "nl"
	| "no"
	| "pl"
	| "pt-BR"
	| "pt-PT"
	| "ro"
	| "fi"
	| "sv-SE"
	| "vi"
	| "tr"
	| "cs"
	| "el"
	| "bg"
	| "ru"
	| "uk"
	| "hi"
	| "th"
	| "zh-CN"
	| "ja"
	| "zh-TW"
	| "ko";

/**
 * An object with keys for each available locale, and values of objects containing the strings for that locale.
 */
type localesObject = {
	[locale in localeCode]?: Record<string, string>;
};

// @ts-ignore
const Dispatcher = Library ? Library.DiscordModules.Dispatcher : Webpack.getModule(Webpack.Filters.byProps("dirtyDispatch"));
// @ts-ignore
const LocaleManager = Library ? Library.DiscordModules.LocaleManager : Webpack.getModule((m) => m.Messages.CLOSE);

/**
 * A class for handling localization and strings.
 */
export default class StringsManager<T extends localesObject> {
	private strings: T[keyof T];
	private defaultLocale: keyof T;
	private locales: T;

	/**
	 * Creates a `StringsManager` object with the given locales object.
	 * @param locales An object containing the strings for each locale.
	 * @param [defaultLocale] The code of the locale to use as a fallback when strings for Discord's selected locale are not defined (defaults to `"en-US"`).
	 */
	constructor(locales: T, defaultLocale?: keyof T) {
		this.locales = locales;
		this.defaultLocale = defaultLocale || "en-US";
		this.setLocale();
		Dispatcher.subscribe("I18N_LOAD_SUCCESS", this.setLocale);
	}

	private setLocale() {
		this.strings = this.locales[LocaleManager.getLocale()] || this.locales[this.defaultLocale];
	}

	/**
	 * Gets a string from Discord's selected locale (or default locale if the string is not defined).
	 * @param key The key of the string.
	 * @returns The string at `key` in the selected locale.
	 */
	get(key: keyof typeof this.strings) {
		return this.strings[key] || this.locales[this.defaultLocale][key];
	}

	/**
	 * Unsubscribes from Discord's locale changes. Should be run on plugin stop.
	 */
	unsubscribe() {
		Dispatcher.unsubscribe("I18N_LOAD_SUCCESS", this.setLocale);
	}
}
