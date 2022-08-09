/// <reference path="../types/global.d.ts" />

import { useEffect, useState } from "react";

/** A callback that is run when a setting is changed. */
type Listener<T> = (key: keyof T, value: T[keyof T]) => void;

/**
 * Simple class for managing and using a plugin's settings.
 */
export default class SettingsManager<T extends Record<string, any>> {
	private settings: T;
	private defaultSettings: T;
	private listeners: Set<Listener<T>>;

	/**
	 * Creates a new `SettingsManager` object with the given default settings.
	 * @param defaultSettings An object containing the default settings.
	 */
	constructor(defaultSettings: T) {
		this.defaultSettings = defaultSettings;
		// @ts-ignore
		this.settings = BdApi.loadData(pluginName, "settings") || {};
		this.listeners = new Set();
	}

	/**
	 * Gets the value of a setting, or a default value if the setting does not exist.
	 * @param key The key of the setting.
	 * @returns The value of the setting at `key`.
	 */
	get<K extends keyof T>(key: K): T[K] {
		const value = this.settings[key] ?? this.defaultSettings?.[key];
		return value!;
	}

	/**
	 * Sets and saves the value of a setting.
	 * @param key The key of the setting.
	 * @param value The new value of the setting.
	 */
	set<K extends keyof T>(key: K, value: T[K]) {
		this.settings[key] = value;
		// @ts-ignore
		BdApi.saveData(pluginName, "settings", this.settings);
		for (const listener of this.listeners) listener(key, value);
	}

	/**
	 * Adds a listener that runs when a setting is changed.
	 * @param listener A callback to run when a setting is changed. Takes two optional parameters: the key of the setting, and its new value.
	 * @returns A function to remove the listener.
	 */
	addListener(listener: Listener<T>): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	/**
	 * Removes all listeners. Used for cleanup from {@link addListener}. Should be run at plugin stop if any listeners were added.
	 */
	clearListeners() {
		this.listeners.clear();
	}

	/**
	 * A React hook that gets a setting as a stateful variable.
	 * @param key The key of the setting.
	 * @returns The value of the setting at `key` as a stateful value.
	 */
	useSettingState<K extends keyof T>(key: K): T[K] {
		const [setting, setSetting] = useState(this.get(key));
		useEffect(() => {
			return this.addListener((changedKey, value) => {
				if (changedKey === key) setSetting(value);
			});
		}, []);
		return setting;
	}
}
