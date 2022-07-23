/// <reference path="./types/index.d.ts" />

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
const Dispatcher = Library ? Library.DiscordModules.Dispatcher : BdApi.findModuleByProps("dirtyDispatch");
// @ts-ignore
const LocaleManager = Library ? Library.DiscordModules.LocaleManager : BdApi.findModule((m) => m.Messages.CLOSE);

/**
 * Utilities for handling localization and strings.
 */
export default class Strings {
	private static strings: Record<string, string>;
	private static defaultLocale: localeCode = "en-US";
	private static locales: localesObject;

	private static setLocale() {
		this.strings = this.locales[LocaleManager.getLocale()] || this.locales[this.defaultLocale];
	}

	/**
	 * Sets the locale used as the fallback when strings for Discord's selected locale are not defined (defaults to `"en-US"`).
	 * @param locale The code of the locale to set as the default.
	 */
	static setDefaultLocale(locale: localeCode) {
		this.defaultLocale = locale;
	}

	/**
	 * Initializes `Strings` with the given locales object. Should be run on plugin start.
	 * @param locales An object containing the strings for each locale.
	 */
	static initialize(locales: localesObject) {
		this.locales = locales;
		this.setLocale();
		Dispatcher.subscribe("I18N_LOAD_SUCCESS", this.setLocale);
	}

	/**
	 * Gets a string from Discord's selected locale (or default locale if the string is not defined).
	 * @param key The key of the string.
	 * @returns The string at `key` in the selected locale.
	 */
	static get(key: string) {
		return this.strings[key] || (this.locales[this.defaultLocale] as Record<string, string>)[key];
	}

	/**
	 * Unsubscribes from Discord's locale changes. Used to clean up from {@link Strings.initialize}. Should be run on plugin stop.
	 */
	static unsubscribe() {
		Dispatcher.unsubscribe("I18N_LOAD_SUCCESS", this.setLocale);
	}
}
