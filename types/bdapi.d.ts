/* Information and Documentation from https://github.com/BetterDiscord/BetterDiscord/blob/main/renderer/src/modules/pluginapi.js */

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
	 * Determines if a particular addon is enabled.
	 * @param idOrFile Addon ID or filename.
	 * @returns Whether the addon is enabled.
	 */
	isEnabled(idOrFile: string): boolean;

	/**
	 * Enables the given addon.
	 * @param idOrFile Addon ID or filename.
	 */
	enable(idOrFile: string): void;

	/**
	 * Disables the given addon.
	 * @param idOrFile Addon ID or filename.
	 */
	disable(idOrFile: string): void;

	/**
	 * Toggles the given addon.
	 * @param idOrFile Addon ID or filename.
	 */
	toggle(idOrFile: string): void;

	/**
	 * Reloads the given addon.
	 * @param idOrFile Addon ID or filename.
	 */
	reload(idOrFile: string): void;

	/**
	 * Gets a particular addon.
	 * @param idOrFile Addon ID or filename.
	 * @returns Addon instance.
	 */
	get(idOrFile: string): T;

	/**
	 * Gets all addons of this type.
	 * @returns Array of all addon instances.
	 */
	getAll(): T[];
};

declare namespace BdApi {
	/**
	 * The React module being used inside Discord.
	 */
	const React: react;

	/**
	 * The ReactDOM module being used inside Discord.
	 */
	const ReactDOM: reactDOM;

	/**
	 * A reference object to BetterDiscord's settings.
	 * @deprecated
	 */
	const settings: any;

	/**
	 * A reference object to BetterDiscord's emotes.
	 * @deprecated
	 */
	const emotes: any;

	/**
	 * Adds a `<style>` to the document with the given ID.
	 * @param id ID to use for style element.
	 * @param css CSS to apply to the document.
	 */
	function injectCSS(id: string, css: string): void;

	/**
	 * Removes a `<style>` from the document corresponding to the given ID.
	 * @param id ID used for the style element.
	 */
	function clearCSS(id: string): void;

	/**
	 * Automatically creates and links a remote JS script.
	 * @param id ID of the script element.
	 * @param url URL of the remote script.
	 * @returns Promise resolved upon onload event.
	 * @deprecated
	 */
	function linkJS(id: string, url: string): Promise<void>;

	/**
	 * Removes a remotely linked JS script.
	 * @param id ID of the script element.
	 * @deprecated
	 */
	function unlinkJS(id: string): void;

	/**
	 * Shows a generic but very customizable modal.
	 * @param title Title of the modal.
	 * @param content Content to display in the modal.
	 */
	function alert(title: string, content: string | React.ReactElement | Array<string | React.ReactElement>): void;

	/**
	 * Shows a generic but very customizable confirmation modal with optional confirm and cancel callbacks.
	 * @param title Title of the modal.
	 * @param content A single or mixed array of React elements and strings. Everything is wrapped in Discord's `TextElement` component so strings will show and render properly.
	 * @param [options] Options to modify the modal.
	 * @param [options.danger] Whether the main button should be red or not.
	 * @param [options.confirmText] Text for the confirmation/submit button.
	 * @param [options.cancelText] Text for the cancel button.
	 * @param [options.onConfirm] Callback to occur when clicking the submit button.
	 * @param [options.onCancel] Callback to occur when clicking the cancel button.
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
	 * Shows a toast similar to android towards the bottom of the screen.
	 * @param content The content to show in the toast.
	 * @param [options] Options object. Optional parameter.
	 * @param [options.type] Changes the type of the toast stylistically and semantically.
	 * @param [options.icon] Determines whether the icon should show corresponding to the type. A toast without type will always have no icon. Default: true.
	 * @param [options.timeout] Adjusts the time (in ms) the toast should be shown for before disappearing automatically. Default: 3000.
	 * @param [options.forceShow] Whether to force showing the toast and ignore the BetterDiscord Setting. Default: false.
	 */
	function showToast(
		content: string,
		options?: {
			type?: "info" | "success" | "error" | "warning";
			icon?: boolean;
			timeout?: number;
			forceShow?: boolean;
		}
	): void;

	/**
	 * Show a notice above discord's chat layer.
	 * @param content Content of the notice.
	 * @param [options] Options for the notice
	 * @param [options.type] Type for the notice. Will affect the color.
	 * @param [options.buttons] Buttons that should be added next to the notice text.
	 * @param [options.timeout] Timeout until the notice is closed. Won't fire if it's set to 0.
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
	 * Finds a Webpack module using a filter.
	 * @param filter A filter given the exports, module, and moduleId. Returns true if the module matches.
	 * @returns Either the matching module or `undefined`.
	 * @deprecated Use {@link Webpack} instead.
	 */
	function findModule(filter: (module: any) => boolean): any;

	/**
	 * Finds multple Webpack modules using a filter.
	 * @param filter A filter given the exports, module, and moduleId. Returns true if the module matches.
	 * @returns Either an array of matching modules or an empty array.
	 * @deprecated Use {@link Webpack} instead.
	 */
	function findAllModules(filter: (module: any) => boolean): any[];

	/**
	 * Finds a Webpack module by own properties.
	 * @param props Any desired properties.
	 * @returns Either the matching module or `undefined`.
	 * @deprecated Use {@link Webpack} instead.
	 */
	function findModuleByProps(...props: string[]): any;

	/**
	 * Finds a Webpack module by own prototypes.
	 * @param protos Any desired prototype properties.
	 * @returns Either the matching module or `undefined`.
	 * @deprecated Use {@link Webpack} instead.
	 */
	function findModuleByPrototypes(...protos: string[]): any;

	/**
	 * Finds a Webpack module by displayName property.
	 * @param name Desired displayName property.
	 * @returns Either the matching module or `undefined`.
	 * @deprecated Use {@link Webpack} instead.
	 */
	function findModuleByDisplayName(name: string): any;

	/**
	 * Get the internal React data of a specified node.
	 * @param node Node to get the React data from.
	 * @returns Either the found data or `undefined`.
	 */
	function getInternalInstance(node: HTMLElement): any;

	/**
	 * Loads previously stored data.
	 * @param pluginName Name of the plugin loading data.
	 * @param key Which piece of data to load.
	 * @returns The stored data.
	 */
	function loadData(pluginName: string, key: string): any;

	/**
	 * Loads previously stored data.
	 * @param pluginName Name of the plugin loading data.
	 * @param key Which piece of data to load.
	 * @returns The stored data.
	 */
	const getData: typeof loadData;

	/**
	 * Saves JSON-serializable data.
	 * @param pluginName Name of the plugin saving data.
	 * @param key Which piece of data to store.
	 * @param data The data to be saved.
	 */
	function saveData(pluginName: string, key: string, data: any): void;

	/**
	 * Saves JSON-serializable data.
	 * @param pluginName Name of the plugin saving data.
	 * @param key Which piece of data to store.
	 * @param data The data to be saved.
	 */
	const setData: typeof saveData;

	/**
	 * Deletes a piece of stored data, this is different than saving as null or undefined.
	 * @param pluginName Name of the plugin deleting data.
	 * @param key Which piece of data to delete.
	 */
	function deleteData(pluginName: string, key: string): void;

	/**
	 * This function monkey-patches a method on an object. The patching callback may be run before, after or instead of target method.
	 *  - Be careful when monkey-patching. Think not only about original functionality of target method and your changes, but also about developers of other plugins, who may also patch this method before or after you. Try to change target method behaviour as little as possible, and avoid changing method signatures.
	 *  - Display name of patched method is changed, so you can see if a function has been patched (and how many times) while debugging or in the stack trace. Also, patched methods have property `__monkeyPatched` set to `true`, in case you want to check something programmatically.
	 * @param what Object to be patched. You can can also pass class prototypes to patch all class instances.
	 * @param methodName name of the function to be patched.
	 * @param options Options object to configure the patch.
	 * @param [options.after] Callback that will be called after original target method call. You can modify return value here, so it will be passed to external code which calls target method. Can be combined with `before`.
	 * @param [options.before] Callback that will be called before original target method call. You can modify arguments here, so it will be passed to original method. Can be combined with `after`.
	 * @param [options.instead] Callback that will be called instead of original target method call. You can get access to original method using `originalMethod` parameter if you want to call it, but you do not have to. Can't be combined with `before` or `after`.
	 * @param [options.once] Set to `true` if you want to automatically unpatch method after first call.
	 * @param [options.silent] Set to `true` if you want to suppress log messages about patching and unpatching.
	 * @returns A function that cancels the monkey-patch.
	 * @deprecated
	 */
	function monkeyPatch(
		what: any,
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
	 * Adds a listener for when the node is removed from the document body.
	 * @param node Node to be observed.
	 * @param callback Callback function to run when fired.
	 */
	function onRemoved(node: HTMLElement, callback: () => void): void;

	/**
	 * Wraps a given function in a `try..catch` block.
	 * @param method Function to wrap.
	 * @param message Additional messasge to print when an error occurs
	 * @returns The mew wrapped function.
	 * @deprecated
	 */
	function suppressErrors(method: Function, message: string): Function;

	/**
	 * Tests a given object to determine if it is valid JSON.
	 * @param data Data to be tested.
	 * @returns Result of the test.
	 * @deprecated
	 */
	function testJSON(data: any): boolean;

	/**
	 * Gets a specific setting's status from BetterDiscord.
	 * @param collection Collection ID.
	 * @param category Category ID in the collection.
	 * @param id Setting ID in the category.
	 * @returns If the setting is enabled.
	 * @deprecated
	 */
	function isSettingEnabled(collection: string, category: string, id: string): boolean;

	/**
	 * Gets a specific setting's status from BetterDiscord.
	 * @param category Category ID in the collection `settings`.
	 * @param id Setting ID in the category.
	 * @returns If the setting is enabled.
	 * @deprecated
	 */
	function isSettingEnabled(category: string, id: string): boolean;

	/**
	 * Enables a BetterDiscord setting by IDs.
	 * @param collection Collection ID.
	 * @param category Category ID in the collection.
	 * @param id Setting ID in the category.
	 * @deprecated
	 */
	function enableSetting(collection: string, category: string, id: string): void;

	/**
	 * Enables a BetterDiscord setting by IDs.
	 * @param category Category ID in the collection `settings`.
	 * @param id Setting ID in the category.
	 * @deprecated
	 */
	function enableSetting(category: string, id: string): void;

	/**
	 * Disables a BetterDiscord setting by IDs.
	 * @param collection Collection ID.
	 * @param category Category ID in the collection.
	 * @param id Setting ID in the category.
	 * @deprecated
	 */
	function disableSetting(collection: string, category: string, id: string): void;

	/**
	 * Disables a BetterDiscord setting by IDs.
	 * @param category Category ID in the collection `settings`.
	 * @param id Setting ID in the category.
	 * @deprecated
	 */
	function disableSetting(category: string, id: string): void;

	/**
	 * Toggle a BetterDiscord setting by IDs.
	 * @param collection Collection ID.
	 * @param category Category ID in the collection.
	 * @param id Setting ID in the category.
	 * @deprecated
	 */
	function toggleSetting(collection: string, category: string, id: string): void;

	/**
	 * Toggle a BetterDiscord setting by IDs.
	 * @param category Category ID in the collection `settings`.
	 * @param id Setting ID in the category.
	 * @deprecated
	 */
	function toggleSetting(category: string, id: string): void;

	/**
	 * Gets some data in BetterDiscord's misc data.
	 * @param key Key of the data to load.
	 * @returns The stored data.
	 * @deprecated
	 */
	function getBDData(key: string): any;

	/**
	 * Sets some data in BetterDiscord's misc data.
	 * @param key Key of the data to store.
	 * @param data Data to store.
	 * @deprecated
	 */
	function setBDData(key: string, data: any): void;

	/**
	 * Gives access to Electron's Dialog API. See {@link https://www.electronjs.org/docs/latest/api/dialog}.
	 * @param options Options object to configure the dialog.
	 * @param [options.mode] Determines whether the dialog should open or save files.
	 * @param [options.defaultPath] Path the dialog should show on launch.
	 * @param [options.filters] An array of file filters: {@link https://www.electronjs.org/docs/latest/api/structures/file-filter}.
	 * @param [options.title] Title for the titlebar.
	 * @param [options.message] Message for the dialog.
	 * @param [options.showOverwriteConfirmation] Whether the user should be prompted when overwriting a file.
	 * @param [options.showHiddenFiles] Whether hidden files should be shown in the dialog.
	 * @param [options.promptToCreate] Whether the user should be prompted to create non-existant folders.
	 * @param [options.openDirectory] Whether the user should be able to select a directory as a target.
	 * @param [options.openFile] Whether the user should be able to select a file as a target.
	 * @param [options.multiSelections] Whether the user should be able to select multiple targets.
	 * @param [options.modal] Whether the dialog should act as a modal to the main window.
	 * @returns A `Promise` that resolves to an `object` that has a `boolean` cancelled and a `filePath` string for saving and a `filePaths` string array for opening.
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
	 * An instance of {@link AddonAPI} to access plugins.
	 */
	const Plugins: AddonAPI<BDPlugin>;

	/**
	 * An instance of {@link AddonAPI} to access themes.
	 */
	const Themes: AddonAPI<BDTheme>;

	/**
	 * `Patcher` is a utility class for modifying existing functions.
	 * This is extremely useful for modifying the internals of Discord by adjusting return value or React renders, or arguments of internal functions.
	 */
	const Patcher: {
		/**
		 * This method patches onto another function, allowing your code to run beforehand.
		 * Using this, you are also able to modify the incoming arguments before the original method is run.
		 * @param caller Name of the caller of the patch function.
		 * @param module Object with the function to be patched. Can also be an object's prototype.
		 * @param method Name of the function to be patched.
		 * @param callback Function to run before the original method. The function is given the `this` context and the `arguments` of the original function.
		 * @returns Function that cancels the original patch.
		 */
		before(
			caller: string,
			module: object,
			method: string,
			callback: (thisContext: any, arguments: any) => void
		): () => void;

		/**
		 * This method patches onto another function, allowing your code to run instead.
		 * Using this, you are also able to modify the return value, using the return of your code instead.
		 * @param caller Name of the caller of the patch function.
		 * @param module Object with the function to be patched. Can also be an object's prototype.
		 * @param method Name of the function to be patched.
		 * @param callback Function to run before the original method. The function is given the `this` context, `arguments` of the original function, and also the original function.
		 * @returns Function that cancels the original patch.
		 */
		instead(
			caller: string,
			module: object,
			method: string,
			callback: (thisContext: any, arguments: any, originalFunction: Function) => void
		): () => void;

		/**
		 * This method patches onto another function, allowing your code to run after.
		 * Using this, you are also able to modify the return value.
		 * @param caller Name of the caller of the patch function.
		 * @param module Object with the function to be patched. Can also be an object's prototype.
		 * @param method Name of the function to be patched.
		 * @param callback callback Function to run after the original method. The function is given the `this` context, the `arguments` of the original function, and the `return` value of the original function.
		 * @returns Function that cancels the original patch.
		 */
		after(
			caller: string,
			module: object,
			method: string,
			callback: (thisContext: any, arguments: any[], returnValue: any) => void
		): () => void;

		/**
		 * Returns all patches by a particular caller. The patches all have an `unpatch()` method.
		 * @param caller ID of the original patches.
		 * @returns Array of all the patch objects.
		 */
		getPatchesByCaller(caller: string): Array<Function>;

		/**
		 * Automatically cancels all patches created with a specific ID.
		 * @param caller ID of the original patches.
		 */
		unpatchAll(caller: string): void;
	};

	/**
	 * `Webpack` is a utility class for getting internal Webpack modules.
	 * This is extremely useful for interacting with the internals of Discord.
	 */
	const Webpack: {
		/**
		 * Series of Filters to be used for finding Webpack modules.
		 */
		Filters: {
			/**
			 * Generates a function that filters by a set of properties.
			 * @param props List of property names.
			 * @returns A filter that checks for a set of properties.
			 */
			byProps(...props: string[]): (module: any) => boolean;

			/**
			 * Generates a function that filters by a set of properties on the object's prototype.
			 * @param props List of property names.
			 * @returns A filter that checks for a set of properties on the object's prototype.
			 */
			byPrototypeFields(...props: string[]): (module: any) => boolean;

			/**
			 * Generates a function that filters by a regex.
			 * @param regex A RegExp to check on the module.
			 * @returns A filter that checks for a regex match.
			 */
			byRegex(regex: RegExp): (module: any) => boolean;

			/**
			 * Generates a function that filters by strings.
			 * @param strings A list of strings.
			 * @returns {function} A filter that checks for a set of strings.
			 */
			byStrings(...strings: string[]): (module: any) => boolean;

			/**
			 * Generates a function that filters by a name.
			 * @param name Name the module should have.
			 * @returns A filter that checks for a name.
			 */
			byDisplayName(name: string): (module: any) => boolean;

			/**
			 * Generates a combined function from a list of filters.
			 * @param filters A list of filters.
			 * @returns Combinatory filter of all arguments.
			 */
			combine(...filters: Array<(module: any) => boolean>): (module: any) => boolean;
		};

		/**
		 * Finds a module using a filter function.
		 * @param filter A function to use to filter modules. It is given exports, module, and moduleID. Return true to signify match.
		 * @param [options] Options object.
		 * @param [options.first] Whether to return only the first matching module.
		 * @param [options.defaultExport] Whether to return default export when matching the default export.
		 * @return The found module.
		 */
		getModule(
			filter: (module: any) => boolean,
			options?: {
				first?: boolean;
				defaultExport?: boolean;
			}
		): any;

		/**
		 * Finds multiple modules using multiple filters.
		 *
		 * @param queries Whether to return only the first matching module
		 * @param queries.filter A function to use to filter modules
		 * @param [queries.first] Whether to return only the first matching module
		 * @param [queries.defaultExport] Whether to return default export when matching the default export
		 * @return The found modules.
		 */
		getBulk(
			...queries: {
				filter: (module: any) => boolean;
				first?: boolean;
				defaultExport?: boolean;
			}[]
		): any[];

		/**
		 * Finds a module that lazily loaded.
		 * @param filter A function to use to filter modules. It is given exports. Return true to signify match.
		 * @param [options] Options object.
		 * @param [options.signal] AbortSignal of an AbortController to cancel the promise
		 * @param [options.defaultExport] Whether to return default export when matching the default export
		 * @returns A promise that resolves to the found module.
		 */
		waitForModule(
			filter: (module: any) => boolean,
			options?: {
				signal?: AbortSignal;
				defaultExport?: boolean;
			}
		): Promise<any>;
	};
}
