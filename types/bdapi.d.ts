type react = typeof React;
type reactDOM = typeof ReactDOM;

type BDPlugin = {
	added: number;
	author: string;
	description: string;
	exports: any;
	filename: string;
	format: string;
	id: string;
	instance: any;
	modified: number;
	name: string;
	size: number;
	version: string;
	[key: string]: any;
};

type BDTheme = {
	added: number;
	author: string;
	css: string;
	description: string;
	filename: string;
	format: string;
	id: string;
	modified: number;
	name: string;
	size: number;
	version: string;
	[key: string]: any;
};

type AddonAPI<T> = {
	/**
	 * The path to the addon folder.
	 */
	folder: string;

	/**
	 * Disables the given addon.
	 * @param idOrFile Plugin ID or filename.
	 */
	disable(idOrFile: string): void;

	/**
	 * Enables the given addon.
	 * @param idOrFile Plugin ID or filename.
	 */
	enable(idOrFile: string): void;

	/**
	 * Gets the given addon if it exists.
	 * @param idOrFile Plugin ID or filename.
	 * @returns Addon object or undefined.
	 */
	get(idOrFile: string): T | undefined;

	/**
	 * Gets all addons.
	 * @returns Array of addon objects.
	 */
	getAll(): T[];

	/**
	 * Determines if an addon is enabled.
	 * @param idOrFile Plugin ID or filename.
	 * @returns Whether the addon is enabled.
	 */
	isEnabled(idOrFile: string): boolean;

	/**
	 * Reloads the given addon.
	 * @param idOrFile Plugin ID or filename.
	 */
	reload(idOrFile: string): void;

	/**
	 * Toggles the given addon.
	 * @param idOrFile Plugin ID or filename.
	 */
	toggle(idOrFile: string): void;
};

declare namespace BdApi {
	/**
	 * A reference object for BetterDiscord's emotes.
	 */
	const emotes: any;

	/**
	 * Utilities for modifying existing functions.
	 */
	class Patcher {
		/**
		 * Patches onto another function, running code after it. Able to modify the function's return value.
		 * @param caller Name of the caller of the patch function.
		 * @param module Object (or prototype) with the function to be patched.
		 * @param method Name of the method to be patched.
		 * @param callback Function to run after the original method. Is passed `this` context, `arguments`, and the `return` value of the original function.
		 * @returns Function to unpatch the original method.
		 */
		static after(
			caller: string,
			module: object,
			method: string,
			callback: (thisContext: any, arguments: any[], returnValue: any) => void
		): () => void;

		/**
		 * Patches onto another function, running code before it. Able to modify the function's incoming arguments.
		 * @param caller Name of the caller of the patch function.
		 * @param module Object (or prototype) with the function to be patched.
		 * @param method Name of the method to be patched.
		 * @param callback Function to run after the original method. Is passed `this` context and the `arguments` of the original function.
		 * @returns Function to unpatch the original method.
		 */
		static before(
			caller: string,
			module: object,
			method: string,
			callback: (thisContext: any, arguments: any) => void
		): () => void;

		/**
		 * Returns all patches by a particular caller with their `unpatch` methods.
		 * @param caller Name of the caller.
		 * @returns Array of unpatch functions.
		 */
		static getPatchesByCaller(caller: string): Array<Function>;

		/**
		 * Patches onto another function, running code instead of it. Able to modify the function's return value.
		 * @param caller Name of the caller of the patch function.
		 * @param module Object (or prototype) with the function to be patched.
		 * @param method Name of the method to be patched.
		 * @param callback Function to run after the original method. Is passed `this` context, the `arguments` of the original function, and the original function.
		 * @returns Function to unpatch the original method.
		 */
		static instead(
			caller: string,
			module: object,
			method: string,
			callback: (thisContext: any, arguments: any, originalFunction: Function) => void
		): () => void;

		/**
		 * Unpatches all patches by a particular caller.
		 * @param caller Name of the caller.
		 */
		static unpatchAll(caller: string): void;
	}

	/**
	 * Utilities for working with plugins.
	 */
	const Plugins: AddonAPI<BDPlugin>;

	/**
	 * Discord's instance of React.
	 */
	const React: react;

	/**
	 * Discord's instance of ReactDOM.
	 */
	const ReactDOM: reactDOM;

	/**
	 * A reference object for BetterDiscord's settings.
	 */
	const settings: any;

	/**
	 * Utilities for working with themes.
	 */
	const Themes: AddonAPI<BDTheme>;

	/**
	 * Shows a customizable alert modal.
	 * @param title Title to show on the modal.
	 * @param content Content to show on the modal.
	 */
	function alert(title: string, content: string | React.ReactElement | Array<string | React.ReactElement>): void;

	/**
	 * Removes a `style` element from the document's head with the given ID.
	 * @param id ID of the `style` element to be cleared.
	 */
	function clearCSS(id: string): void;

	/**
	 * Deletes saved data.
	 * @param pluginName Plugin saved data should be deleted from.
	 * @param key Key of data to be deleted.
	 */
	function deleteData(pluginName: string, key: string): void;

	/**
	 * Disables a BetterDiscord setting.
	 * @param collection Collection ID of the setting.
	 * @param category Category ID of the setting within the collection.
	 * @param id Setting ID within the category.
	 */
	function disableSetting(collection: string, category: string, id: string): void;

	/**
	 * Disables a BetterDiscord setting.
	 * @param category Category ID of the setting within the collection `settings`.
	 * @param id Setting ID within the category.
	 */
	function disableSetting(category: string, id: string): void;

	/**
	 * Enables a BetterDiscord setting.
	 * @param collection Collection ID of the setting.
	 * @param category Category ID of the setting within the collection.
	 * @param id Setting ID within the category.
	 */
	function enableSetting(collection: string, category: string, id: string): void;

	/**
	 * Enables a BetterDiscord setting.
	 * @param category Category ID of the setting within the collection `settings`.
	 * @param id Setting ID within the category.
	 */
	function enableSetting(category: string, id: string): void;

	/**
	 * Searches for all internal Discord webpack modules using a filter.
	 * @param filter Function to filter modules.
	 * @returns Array of modules or null.
	 */
	function findAllModules(filter: (module: any) => boolean): any[];

	/**
	 * Searches for an internal Discord webpack module using a filter.
	 * @param filter Function to filter modules.
	 * @returns Module or null.
	 */
	function findModule(filter: (module: any) => boolean): any;

	/**
	 * Searches for an internal Discord webpack module with a specific `displayName`.
	 * @param name `displayName` to check for.
	 * @returns Module or null.
	 */
	function findModuleByDisplayName(name: string): any;

	/**
	 * Searches for an internal Discord webpack module with specific properties.
	 * @param props Series of properties to check for.
	 * @returns Module or null.
	 */
	function findModuleByProps(...props: string[]): any;

	/**
	 * Searches for an internal Discord webpack module with specific prototypes.
	 * @param protos Series of prototypes to check for.
	 * @returns Module or null.
	 */
	function findModuleByPrototypes(...protos: string[]): any;

	/**
	 * Gets data saved in BetterDiscord's misc. data.
	 * @param key Key of data to be retrieved.
	 * @returns Retrieved data.
	 */
	function getBDData(key: string): any;

	/**
	 * Gets saved data.
	 * @param pluginName Plugin saved data should be retrieved from.
	 * @param key Key of data.
	 * @returns Retrieved data.
	 */
	const getData: typeof loadData;

	/**
	 * Gets the internal React instance for a DOM node if it exists.
	 * @param node DOM node to get the internal React instance of.
	 * @returns React instance or undefined.
	 */
	function getInternalInstance(node: HTMLElement): any | undefined;

	/**
	 * Adds a `style` element to the document's head with the given ID.
	 * @param id ID of the `style` element to be added.
	 * @param css CSS to be added to the `style` element.
	 */
	function injectCSS(id: string, css: string): void;

	/**
	 * Gets the status of a BetterDiscord setting.
	 * @param collection Collection ID of the setting.
	 * @param category Category ID of the setting within the collection.
	 * @param id Setting ID within the category.
	 * @returns Status of the setting.
	 */
	function isSettingEnabled(collection: string, category: string, id: string): boolean;

	/**
	 * Gets the status of a BetterDiscord setting.
	 * @param category Category ID of the setting within the collection `settings`.
	 * @param id Setting ID within the category.
	 * @returns Status of the setting.
	 * @deprecated
	 */
	function isSettingEnabled(category: string, id: string): boolean;

	/**
	 * Adds a `script` element to the document's head with the given ID and Javascript source.
	 * @param id ID of the `script` element to be added.
	 * @param url URL of the Javascript.
	 * @deprecated
	 */
	function linkJS(id: string, url: string): void;

	/**
	 * Gets saved data.
	 * @param pluginName Plugin saved data should be retrieved from.
	 * @param key Key of data.
	 * @returns Retrieved data.
	 */
	function loadData(pluginName: string, key: string): any;

	/**
	 * Monkey-patches a method on an object.
	 * @param module Object (or class prototype) to be patched.
	 * @param methodName name of the function to be patched.
	 * @param options Options to configure the patch.
	 * @param [options.before] Callback to be called before the original method. Can be used with `after`.
	 * @param [options.after] Callback to be called after the original method. Can be used with `before`.
	 * @param [options.instead] Callback to be called instead of the original method. Cannot be used with `before` or `after`.
	 * @param [options.once] If true, the method will be automatically unpatched after the first call.
	 * @param [options.silent] If true, log messages about patching and unpatching will be supressed.
	 * @returns A function to unpatch the patched method.
	 * @deprecated
	 */
	function monkeyPatch(
		module: any,
		methodName: string,
		options: {
			after?: Function;
			before?: Function;
			instead?: Function;
			once?: boolean;
			silent?: boolean;
		}
	): () => void;

	/**
	 * Adds a listener for when a DOM node is removed from the document body.
	 * @param node Node to be observed.
	 * @param callback Function to run when the node is removed.
	 */
	function onRemoved(node: HTMLElement, callback: () => void): void;

	/**
	 * Gives access to Electron's Dialog API. See {@link https://www.electronjs.org/docs/latest/api/dialog}.
	 * @param options Options to configure the dialog.
	 * @param options.mode Whether the dialog should open or save files.
	 * @param [options.defaultPath] Path the dialog should show on launch.
	 * @param [options.filters] Array of file filters: {@link https://www.electronjs.org/docs/latest/api/structures/file-filter}.
	 * @param [options.title] Title of the dialog.
	 * @param [options.message] Message for the dialog.
	 * @param [options.showOverwriteConfirmation] Whether the user should be prompted when overwriting a file.
	 * @param [options.showHiddenFiles] Whether hidden files should be shown.
	 * @param [options.promptToCreate] Whether the user should be prompted to create non-existant folders.
	 * @param [options.openDirectory] Whether the user should be able to select a directory as a target.
	 * @param [options.openFile] Whether the user should be able to select a file as a target.
	 * @param [options.multiSelections] Whether the user should be able to select multiple targets.
	 * @param [options.modal] Whether the dialog should act as a modal to the main window.
	 * @returns A `Promise` that resolves to an object with `cancelled`, `filePath` and `filePaths` properties.
	 */
	function openDialog(options: {
		mode?: "open" | "save";
		defaultPath?: string;
		filters?: Array<Record<string, string[]>>;
		title?: string;
		message?: string;
		showOverwriteConfirmation?: boolean;
		showHiddenFiles?: boolean;
		promptToCreate?: boolean;
		openDirectory?: boolean;
		openFile?: boolean;
		multiSelections?: boolean;
		modal?: boolean;
	}): Promise<object>;

	/**
	 * Saves data in the plugins folder under `pluginName.config.json`, can be accessed with `loadData`.
	 * @param pluginName Plugin data should be saved to.
	 * @param key Key data should be saved to.
	 * @param data Data to be saved.
	 */
	function saveData(pluginName: string, key: string, data: any): void;

	/**
	 * Sets data in BetterDiscord's misc. data.
	 * @param key Key data should be saved to.
	 * @param data Data to be stored.
	 */
	function setBDData(key: string, data: any): void;

	/**
	 * Saves data in the plugins folder under `pluginName.config.json`, can be accessed with `loadData`.
	 * @param pluginName Plugin data should be saved to.
	 * @param key Key data should be saved to.
	 * @param data Data to be saved.
	 */
	const setData: typeof saveData;

	/**
	 * Shows a generic but very customizable confirmation modal with optional confirm and cancel callbacks.
	 * @param title Title to show in the modal header.
	 * @param content Conent to show in the modal body.
	 * @param [options] Options to configure the modal.
	 * @param [options.danger] Whether the main button should be red.
	 * @param [options.confirmText] Text for the confirmation/submit button.
	 * @param [options.cancelText] Text for the cancel button.
	 * @param [options.onConfirm] Callback to run when clicking the submit button.
	 * @param [options.onCancel] Callback to run when clicking the cancel button.
	 */
	function showConfirmationModal(
		title: string,
		content: string | React.ReactElement | Array<string | React.ReactElement>,
		options?: {
			danger: boolean;
			confirmText?: string;
			cancelText?: string;
			onConfirm?: () => void;
			onCancel?: () => void;
		}
	): void;

	/**
	 * Shows a notice banner at the top of Discord.
	 * @param content Content to show in the banner.
	 * @param [options] Options to configure the notice.
	 * @param [options.type] Changes the type of the toast stylistically and semantically.
	 * @param [options.buttons] Array of objects contiaining `label` and `onClick` properties.
	 * @param [options.timeout] Timeout (in milliseconds) until the notice is closed. Will not timeout if set to 0.
	 */
	function showNotice(
		content: string | Node,
		options?: {
			type?: "info" | "success" | "error" | "warning";
			buttons?: Array<{
				label: string;
				onClick: (immediately?: boolean) => void;
			}>;
			timeout?: number;
		}
	): void;

	/**
	 * Shows a simple toast message towards the bottom of the screen.
	 * @param content Content to show in the toast.
	 * @param [options] Options to configure the toast.
	 * @param [options.type] Changes the type of the toast stylistically and semantically.
	 * @param [options.icon] Determines whether the icon corresponding to the type should be shown.
	 * @param [options.timeout] Timeout (in milliseconds) before the toast disappears automatically.
	 */
	function showToast(
		content: string,
		options?: {
			type?: "info" | "success" | "error" | "warning";
			icon?: boolean;
			timeout?: number;
		}
	): void;

	/**
	 * Wraps a function in a `try...catch` block.
	 * @param risky Function to be wrapped.
	 * @returns The wrapped function.
	 * @deprecated
	 */
	function suppressErrors(risky: Function): Function;

	/**
	 * Tests a given object to determine if it is valid JSON.
	 * @param data Object to test.
	 * @returns Whether the object is valid JSON.
	 * @deprecated
	 */
	function testJSON(data: any): boolean;

	/**
	 * Toggles a BetterDiscord setting.
	 * @param collection Collection ID of the setting.
	 * @param category Category ID of the setting within the collection.
	 * @param id Setting ID within the category.
	 */
	function toggleSetting(collection: string, category: string, id: string): void;

	/**
	 * Disables a BetterDiscord setting.
	 * @param category Category ID of the setting within the collection `settings`.
	 * @param id Setting ID within the category.
	 */
	function toggleSetting(category: string, id: string): void;

	/**
	 * Removes a `script` element from the document's head with the given ID.
	 * @param id ID of the `script` element to be removed.
	 * @deprecated
	 */
	function unlinkJS(id: string): void;
}
