/// <reference path="./types/index.d.ts" />

import { useEffect, useState } from "react";

type listener = (key?: string, value?: any) => void;

/**
 * Simple utilities for managing and using a plugin's settings.
 */
export default class Settings {
	private static settings: Record<string, any> = BdApi.loadData(meta.name, "settings") || {};
	private static defaultSettings: Record<string, any>;
	private static listeners: Set<listener> = new Set();

	/**
	 * Sets the default settings. Should be run on plugin start if desired.
	 * @param settings An object containing the default settings.
	 */
	static setDefaults(settings: Record<string, any>) {
		this.defaultSettings = settings;
	}

	/**
	 * Gets the value of a setting, or a value set by {@link Settings.setDefaults} if the setting does not exist.
	 * @param key The key of the setting.
	 * @param [defaultValue] *(Optional)* The default value of the setting (will override value set by {@link Settings.setDefaults}). Useful if {@link Settings.setDefaults} is never used.
	 * @returns The value of the setting at `key`.
	 */
	static get(key: string, defaultValue?: any) {
		return this.settings?.[key] ?? defaultValue ?? this.defaultSettings?.[key];
	}

	/**
	 * Sets and saves the value of a setting.
	 * @param key The key of the setting.
	 * @param value The new value of the setting.
	 */
	static set(key: string, value: any) {
		this.settings[key] = value;
		BdApi.saveData(meta.name, "settings", this.settings);
		this.listeners.forEach((listener) => listener(key, value));
	}

	/**
	 * Adds a listener that runs when a setting is changed.
	 * @param listener A callback to run when a setting is changed. Takes two optional parameters: the key of the setting, and its new value.
	 * @returns A function to remove the listener.
	 */
	static addListener(listener: listener): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	/**
	 * Removes all listeners. Used for cleanup from {@link Settings.addListener}. Should be run at plugin stop if any listeners were added.
	 */
	static clearListeners() {
		this.listeners.clear();
	}

	/**
	 * A React hook that gets a setting as a stateful variable.
	 * @param key The key of the setting.
	 * @param [defaultValue] *(Optional)* See {@link Settings.get}
	 * @returns The value of the setting at `key` as a stateful value.
	 */
	static useSettingState(key: string, defaultValue?: any) {
		const [setting, setSetting] = useState(this.get(key, defaultValue));
		useEffect(() => {
			return this.addListener((changedKey, value) => {
				if (changedKey === key) setSetting(value);
			});
		}, []);
		return setting;
	}
}
