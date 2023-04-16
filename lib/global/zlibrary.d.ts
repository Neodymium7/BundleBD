/* Information and Documentation from https://rauenzi.github.io/BDPluginLibrary/docs/ */

declare module "zlibrary/plugin" {
	import { Settings } from "zlibrary";

	/** The Library's base Plugin class */
	export default class Plugin {
		defaultSettings: any;
		settings: any;
		constructor();
		getName(): string;
		getDescription(): string;
		getVersion(): string;
		getAuthor(): string;
		load(): void;
		start(): void;
		stop(): void;
		get isEnabled(): boolean;
		get strings(): any;
		set strings(strings: any);
		showSettingsModal(): void;
		showChangelog(footer: string): void;
		saveSettings(settings?: any): void;
		loadSettings(defaultSettings?: any): any;
		buildSetting(data: {
			name: string;
			note: string;
			type: "color" | "dropdown" | "file" | "keybind" | "radio" | "slider" | "switch" | "textbox";
			value: any;
			onChange: Function;
			id: string;
		}): Settings.SettingField;
		buildSettingsPanel(): Settings.SettingPanel;
	}
}

declare module "zlibrary" {
	import * as React from "react";
	import * as ReactDOM from "react-dom";

	/**
	 * Helpful utilities for dealing with colors.
	 */
	export class ColorConverter {
		static getDarkness(color: string): string;

		static hex2int(color: string): number;

		static hex2rgb(color: string): string;

		static int2hex(color: number): string;

		static int2rgba(color: string, alpha: number): string;

		static isValidHex(color: string): boolean;

		/**
		 * Will the red green and blue values of any color string.
		 * @param color - the color to obtain the red, green and blue values of. Can be in any of these formats: #fff, #ffffff, rgb, rgba
		 * @returns array containing the red, green, and blue values
		 */
		static getRGB(color: string): number[];

		/**
		 * Will get the darken the color by a certain percent
		 * @param color - Can be in any of these formats: #fff, #ffffff, rgb, rgba
		 * @param percent - percent to darken the color by (0-100)
		 * @returns new color in rgb format
		 */
		static darkenColor(color: string, percent: number): string;

		/**
		 * Will get the lighten the color by a certain percent
		 * @param color - Can be in any of these formats: #fff, #ffffff, rgb, rgba
		 * @param percent - percent to lighten the color by (0-100)
		 * @returns new color in rgb format
		 */
		static lightenColor(color: string, percent: number): string;

		/**
		 * Converts a color to rgba format string
		 * @param color - Can be in any of these formats: #fff, #ffffff, rgb, rgba
		 * @param alpha - alpha level for the new color
		 * @returns new color in rgb format
		 */
		static rgbToAlpha(color: string, alpha: number): string;
	}

	export const Components: {
		ColorPicker: React.Component;
		ErrorBoundary: React.Component;
	};

	/**
	 * Fires when the item is clicked.
	 * @param event - The event generated on click
	 */
	type MenuItemOnClick = (event: MouseEvent) => void;

	/**
	 * This is the generic context menu item component. It is very extensible and will adapt
	 * it's type depending on the props.
	 *
	 * Note: The item ID should be unique to this item across the entire menu. If no `id` is
	 * provided, the system will use the `label`. Plugins should ensure there are no `label`
	 * conflicts if they do not wish to provide `id`. `label` conflicts (when not using
	 * unique `id`s) can cause multiple items to be hovered at once.
	 *
	 * @param {any} props - props to pass to the react renderer
	 * @param {string} props.label - label to show on the menu item
	 * @param {string} [props.id] - specific id used for this item
	 * @param {string} [props.hint] - hint to show on the right hand side (usually keyboard combo)
	 * @param {string} [props.subtext] - description to show underneath
	 * @param {string} [props.image] - link to image to show on the side
	 * @param {Function} [props.icon] - react component to render on the side
	 * @param {Function} [props.render] - render function for custom rendering the menu item
	 * @param {MenuItemOnClick} [props.action] - function to perform on click
	 * @param {MenuItemOnClick} [props.onClick] - function to perform on click (alias of `action`)
	 * @param {Function} [props.onClose] - function to run when this is closed
	 * @param {boolean} [props.danger=false] - should the item show as danger (red)
	 * @param {boolean} [props.disabled=false] - should the item be disabled/unclickable
	 * @param {any} [props.style] - allows you to add custom styles
	 * @param {boolean} [props.closeOnClick] - allows you to prevent closing on click
	 */
	interface MenuItem {}

	/**
	 * This item is used for creating checkboxes in menus. Properties shown here are additional
	 * to those of the main MenuItem {@link MenuItem}
	 *
	 * @param {boolean} [props.checked=false] - should the checkbox be checked
	 * @param {boolean} [props.active=false] - alias of `checked`
	 */
	interface MenuToggleItem extends MenuItem {}

	/**
	 * This item is used for creating radio selections in menus. Properties shown here are additional
	 * to those of the main MenuItem {@link MenuItem}
	 *
	 * Note: for the `forceUpdate` option... Without this enabled, you will manually need to
	 * manage the state for the functional component. If you do not the toggle will appear
	 * to not update. @see {@link https://reactjs.org/docs/hooks-reference.html#usestate}
	 *
	 * @param {boolean} [props.checked=false] - should the checkbox be checked
	 * @param {boolean} [props.active=false] - alias of `checked`
	 * @param {boolean} [props.forceUpdate=true] - should the menu be force-updated after click
	 */
	interface MenuRadioItem extends MenuItem {}

	/**
	 * This item is used for creating nested submenus. Properties shown here are additional
	 * to those of the main MenuItem {@link MenuItem}
	 *
	 * @param {Array<any>} [props.render] - array of items to render in the submenu
	 * @param {Array<any>} [props.items] - alias of `render`
	 * @param {Array<any>} [props.children] - Already rendered elements
	 */
	interface SubMenuItem extends MenuItem {}

	/**
	 * This item is used for adding custom controls like sliders to the context menu.
	 * Properties shown here are additional to those of the main MenuItem {@link MenuItem}
	 *
	 * @param {Function} [props.control] - control function that renders the component
	 */
	interface MenuControlItem extends MenuItem {}

	/**
	 * A utility for building and rendering Discord's own menus.
	 */
	export class ContextMenu {
		/**
		 * Builds a single menu item. The only prop shown here is the type, the rest should
		 * match the actual component being built. View those to see what options exist
		 * for each, they often have less in common than you might think. See {@link MenuItem}
		 * for the majority of props commonly available. Check the documentation for the
		 * rest of the components.
		 *
		 * @param props - props used to build the item
		 * @param [props.type="text"] - type of the item, options: text, submenu, toggle, radio, custom, separator
		 * @returns the created component
		 *
		 * @see {@link MenuItem}
		 * @see {@link MenuToggleItem}
		 * @see {@link MenuRadioItem}
		 * @see {@link SubMenuItem}
		 * @see {@link MenuControlItem}
		 *
		 * @example
		 * // Creates a single menu item that prints "MENU ITEM" on click
		 * DiscordContextMenu.buildMenuItem({
		 *      label: "Menu Item",
		 *      action: () => {console.log("MENU ITEM");}
		 * });
		 *
		 * @example
		 * // Creates a single toggle item that starts unchecked
		 * // and print the new value on every toggle
		 * DiscordContextMenu.buildMenuItem({
		 *      type: "toggle",
		 *      label: "Item Toggle",
		 *      checked: false,
		 *      action: (newValue) => {console.log(newValue);}
		 * });
		 */
		static buildMenuItem(props: any): any;

		/**
		 * Creates the all the items **and groups** of a context menu recursively.
		 * There is no hard limit to the number of groups within groups or number
		 * of items in a menu.
		 * @param setup - array of item props used to build items. See {@link buildMenuItem}
		 * @returns  array of the created component
		 *
		 * @example
		 * // Creates a single item group item with a toggle item
		 * DiscordContextMenu.buildMenuChildren([{
		 *      type: "group",
		 *      items: [{
		 *          type: "toggle",
		 *          label: "Item Toggle",
		 *          active: false,
		 *          action: (newValue) => {console.log(newValue);}
		 *      }]
		 * }]);
		 *
		 * @example
		 * // Creates two item groups with a single toggle item each
		 * DiscordContextMenu.buildMenuChildren([{
		 *     type: "group",
		 *     items: [{
		 *         type: "toggle",
		 *         label: "Item Toggle",
		 *         active: false,
		 *         action: (newValue) => {
		 *             console.log(newValue);
		 *         }
		 *     }]
		 * }, {
		 *     type: "group",
		 *     items: [{
		 *         type: "toggle",
		 *         label: "Item Toggle",
		 *         active: false,
		 *         action: (newValue) => {
		 *             console.log(newValue);
		 *         }
		 *     }]
		 * }]);
		 */
		static buildMenuChildren(setup: any[]): any[];

		/**
		 * Creates the menu *component* including the wrapping `ContextMenu`.
		 * Calls {@link buildMenuChildren} under the covers.
		 * Used to call in combination with {@link openContextMenu}.
		 * @param setup - array of item props used to build items. See {@link buildMenuChildren}
		 * @returns the unique context menu component
		 */
		static buildMenu(setup: any[]): Function;

		/**
		 *
		 * @param event - The context menu event. This can be emulated, requires target, and all X, Y locations.
		 * @param menuComponent - Component to render. This can be any react component or output of {@link buildMenu}
		 * @param config - configuration/props for the context menu
		 * @param [config.position="right"] - default position for the menu, options: "left", "right"
		 * @param [config.align="top"] - default alignment for the menu, options: "bottom", "top"
		 * @param [config.onClose] - function to run when the menu is closed
		 * @param [config.noBlurEvent=false] - No clue
		 */
		static openContextMenu(
			event: MouseEvent | React.MouseEvent,
			menuComponent: Function,
			config?: {
				position?: string;
				align?: string;
				onClose?: Function;
				noBlurEvent?: boolean;
			}
		): void;

		/**
		 * Attempts to find and return a specific context menu type's module. Useful
		 * when patching the render of these menus.
		 * @param nameOrFilter - name of the context menu type
		 * @returns the webpack module the menu was found in
		 */
		static getDiscordMenu(nameOrFilter: string | Function): Promise<any>;

		/**
		 * Calls `forceUpdate()` on all context menus it can find. Useful for
		 * after patching a menu.
		 */
		static forceUpdateMenus(): void;

		static initialize(): void;

		static patchMenuItem(): void;

		static patchToggleItem(): void;
	}

	/**
	 * Alias for {@link ContextMenu}
	 *
	 * A utility for building and rendering Discord's own menus.
	 */
	export const DCM: typeof ContextMenu;

	/**
	 * Helpful utilities for dealing with DOM operations.
	 *
	 * This module also extends `HTMLElement` to add a set of utility functions,
	 * the same as the ones available in the module itself, but with the `element`
	 * parameter bound to `this`.
	 */
	export namespace DOMTools {
		/**
		 * Representation of a Selector
		 */
		class Selector {
			/**
			 * @param classname class to create selector for
			 */
			constructor(className: string);

			/**
			 * Returns the raw selector, this is how native function get the value.
			 * @returns raw selector.
			 */
			toString(): string;

			/**
			 * Returns the raw selector, this is how native function get the value.
			 * @returns raw selector.
			 */
			valueOf(): string;

			selector(symbol: string, other: string | Selector): Selector;

			/**
			 * Adds another selector as a direct child `>` to this one.
			 * @param other - Selector to add as child
			 * @returns returns self to allow chaining
			 */
			child(other: string | Selector): Selector;

			/**
			 * Adds another selector as a adjacent sibling `+` to this one.
			 * @param other - Selector to add as adjacent sibling
			 * @returns returns self to allow chaining
			 */
			adjacent(other: string | Selector): Selector;

			/**
			 * Adds another selector as a general sibling `~` to this one.
			 * @param other - Selector to add as sibling
			 * @returns returns self to allow chaining
			 */
			sibling(other: string | Selector): Selector;

			/**
			 * Adds another selector as a descendent `(space)` to this one.
			 * @param other - Selector to add as descendent
			 * @returns returns self to allow chaining
			 */
			descend(other: string | Selector): Selector;

			/**
			 * Adds another selector to this one via `,`.
			 * @param other - Selector to add
			 * @returns returns self to allow chaining
			 */
			and(other: string | Selector): Selector;
		}

		/**
		 * Representation of a Class Name
		 */
		class ClassName {
			/**
			 * @param name - name of the class to represent
			 */
			constructor(name: string);

			/**
			 * Concatenates new class names to the current one using spaces.
			 * @param classNames - list of class names to add to this class name
			 * @returns returns self to allow chaining
			 */
			add(...classNames: string[]): ClassName;

			/**
			 * Returns the raw class name, this is how native function get the value.
			 * @returns raw class name.
			 */
			toString(): string;

			/**
			 * Returns the raw class name, this is how native function get the value.
			 * @returns raw class name.
			 */
			valueOf(): string;

			/**
			 * Returns the classname represented as {@link Selector}.
			 * @returns selector representation of this class name.
			 */
			get selector(): Selector;

			get single(): string;

			get first(): string;
		}

		/**
		 * Representation of a MutationObserver but with helpful utilities.
		 */
		class DOMObserver {
			constructor(root: HTMLElement, options: any);

			observerCallback(mutations: MutationRecord[]): void;

			/**
			 * Starts observing the element. This will be called when attaching a callback.
			 * You don't need to call this manually.
			 */
			observe(): void;

			/**
			 * Disconnects this observer. This stops callbacks being called, but does not unbind them.
			 * You probably want to use {@link unsubscribeAll} instead.
			 */
			disconnect(): void;

			reconnect(): void;

			get root(): HTMLElement;
			set root(root);

			get options(): any;
			set options(options);

			get subscriptions(): any[];

			/**
			 * Subscribes to mutations.
			 * @param callback - A function to call when on a mutation
			 * @param filter - A function to call to filter mutations
			 * @param bind - Something to bind the callback to
			 * @param group - Whether to call the callback with an array of mutations instead of a single mutation
			 */
			subscribe(callback: Function, filter: Function, bind: any, group: boolean): any;

			/**
			 * Removes a subscription and disconnect if there are none left.
			 * @param - subscription A subscription object returned by observer.subscribe
			 */
			unsubscribe(subscription: any): void;

			unsubscribeAll(): void;

			/**
			 * Subscribes to mutations that affect an element matching a selector.
			 * @param callback - A function to call when on a mutation
			 * @param selector - A selector for an element to subscribe to
			 * @param bind - Something to bind the callback to
			 * @param group - Whether to call the callback with an array of mutations instead of a single mutation
			 */
			subscribeToQuerySelector(callback: Function, selector: string, bind: any, group: boolean): any;
		}

		/**
		 * Default DOMObserver for global usage.
		 * @see {@link DOMObserver}
		 */
		const observer: DOMObserver;

		/** Document/window width */
		const screenWidth: number;

		/** Document/window height */
		const screenHeight: number;

		function animate(options: { timing: Function; update: Function; duration: number }): void;

		/**
		 * Adds a style to the document.
		 * @param id - identifier to use as the element id
		 * @param css - css to add to the document
		 */
		function addStyle(id: string, css: string): void;

		/**
		 * Removes a style from the document.
		 * @param id - original identifier used
		 */
		function removeStyle(id: string): void;

		/**
		 * Adds/requires a remote script to be loaded
		 * @param id - identifier to use for this script
		 * @param url - url from which to load the script
		 * @returns promise that resolves when the script is loaded
		 */
		function addScript(id: string, url: string): Promise<void>;

		/**
		 * Removes a remote script from the document.
		 * @param id - original identifier used
		 */
		function removeScript(id: string): void;

		/**
		 * This is my shit version of not having to use `$` from jQuery. Meaning
		 * that you can pass a selector and it will automatically run {@link query}.
		 * It also means that you can pass a string of html and it will perform and return `parseHTML`.
		 * @see {@link parseHTML}
		 * @see {@link query}
		 * @param selector - Selector to query or HTML to parse
		 * @returns Either the result of `parseHTML` or `query`
		 */
		function Q(selector: string): DocumentFragment | NodeList | HTMLElement;

		/**
		 * Essentially a shorthand for `document.querySelector`. If the `baseElement` is not provided
		 * `document` is used by default.
		 * @param selector - Selector to query
		 * @param [baseElement] - Element to base the query from
		 * @returns The found element or null if not found
		 */
		function query(selector: string, baseElement?: Element): Element | null;

		/**
		 * Essentially a shorthand for `document.querySelectorAll`. If the `baseElement` is not provided
		 * `document` is used by default.
		 * @param selector - Selector to query
		 * @param [baseElement] - Element to base the query from
		 * @returns Array of all found elements
		 */
		function queryAll(selector: string, baseElement: Element): Element[];

		/**
		 * Parses a string of HTML and returns the results. If the second parameter is true,
		 * the parsed HTML will be returned as a document fragment {@see https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment }.
		 * This is extremely useful if you have a list of elements at the top level, they can then be appended all at once to another node.
		 *
		 * If the second parameter is false, then the return value will be the list of parsed
		 * nodes and there were multiple top level nodes, otherwise the single node is returned.
		 * @param html - HTML to be parsed
		 * @param [fragment=false] - Whether or not the return should be the raw `DocumentFragment`
		 * @returns The result of HTML parsing
		 */
		function parseHTML(html: string, fragment?: boolean): DocumentFragment | NodeList | HTMLElement;

		/** Alternate name for {@link parseHTML} */
		function createElement(html: string, fragment?: boolean): DocumentFragment | NodeList | HTMLElement;

		/**
		 * Takes a string of html and escapes it using the brower's own escaping mechanism.
		 * @param html - html to be escaped
		 */
		function escapeHTML(html: string): string;

		/**
		 * Takes a string and escapes it for use as a DOM id.
		 * @param id - string to be escaped
		 */
		function escapeID(id: string): string;

		/**
		 * Adds a list of classes from the target element.
		 * @param element - Element to edit classes of
		 * @param classes - Names of classes to add
		 * @returns `element` to allow for chaining
		 */
		function addClass(element: Element, ...classes: string[]): Element;

		/**
		 * Removes a list of classes from the target element.
		 * @param element - Element to edit classes of
		 * @param classes - Names of classes to remove
		 * @returns `element` to allow for chaining
		 */
		function removeClass(element: Element, ...classes: string[]): Element;

		/**
		 * When only one argument is present: Toggle class value;
		 * i.e., if class exists then remove it and return false, if not, then add it and return true.
		 * When a second argument is present:
		 * If the second argument evaluates to true, add specified class value, and if it evaluates to false, remove it.
		 * @param element - Element to edit classes of
		 * @param classname - Name of class to toggle
		 * @param [indicator] - Optional indicator for if the class should be toggled
		 * @returns `element` to allow for chaining
		 */
		function toggleClass(element: Element, classname: string, indicator?: boolean): Element;

		/**
		 * Checks if an element has a specific class
		 * @param element - Element to edit classes of
		 * @param classname - Name of class to check
		 * @returns `true` if the element has the class, `false` otherwise.
		 */
		function hasClass(element: Element, classname: string): boolean;

		/**
		 * Replaces one class with another
		 * @param element - Element to edit classes of
		 * @param oldName - Name of class to replace
		 * @param newName - New name for the class
		 * @returns `element` to allow for chaining
		 */
		function replaceClass(element: Element, oldName: string, newName: string): Element;

		/**
		 * Appends `thisNode` to `thatNode`
		 * @param thisNode - Node to be appended to another node
		 * @param thatNode - Node for `thisNode` to be appended to
		 * @returns `thisNode` to allow for chaining
		 */
		function appendTo(thisNode: Node, thatNode: Node): Node;

		/**
		 * Prepends `thisNode` to `thatNode`
		 * @param thisNode - Node to be prepended to another node
		 * @param thatNode - Node for `thisNode` to be prepended to
		 * @returns thisNode` to allow for chaining
		 */
		function prependTo(thisNode: Node, thatNode: Node): Node;

		/**
		 * Insert after a specific element, similar to jQuery's `thisElement.insertAfter(otherElement)`.
		 * @param thisNode - The node to insert
		 * @param targetNode - Node to insert after in the tree
		 * @returns `thisNode` to allow for chaining
		 */
		function insertAfter(thisNode: Node, targetNode: Node): Node;

		/**
		 * Insert after a specific element, similar to jQuery's `thisElement.after(newElement)`.
		 * @param thisNode - The node to insert
		 * @param newNode - Node to insert after in the tree
		 * @returns `thisNode` to allow for chaining
		 */
		function after(thisNode: Node, newNode: Node): Node;

		/**
		 * Gets the next sibling element that matches the selector.
		 * @param element - Element to get the next sibling of
		 * @param [selector=""] - Optional selector
		 * @returns The sibling element
		 */
		function next(element: Element, selector?: string): Element;

		/**
		 * Gets all subsequent siblings.
		 * @param element - Element to get next siblings of
		 * @returns The list of siblings
		 */
		function nextAll(element: Element): NodeList;

		/**
		 * Gets the subsequent siblings until an element matches the selector.
		 * @param element - Element to get the following siblings of
		 * @param selector - Selector to stop at
		 * @returns The list of siblings
		 */
		function nextUntil(element: Element, selector: string): Element[];

		/**
		 * Gets the previous sibling element that matches the selector.
		 * @param element - Element to get the previous sibling of
		 * @param [selector=""] - Optional selector
		 * @returns The sibling element
		 */
		function previous(element: Element, selector?: string): Element;

		/**
		 * Gets all preceeding siblings.
		 * @param element - Element to get preceeding siblings of
		 * @returns The list of siblings
		 */
		function previousAll(element: Element): NodeList;

		/**
		 * Gets the preceeding siblings until an element matches the selector.
		 * @param element - Element to get the preceeding siblings of
		 * @param selector - Selector to stop at
		 * @returns The list of siblings
		 */
		function previousUntil(element: Element, selector: string): Element[];

		/**
		 * Find which index in children a certain node is. Similar to jQuery's `$.index()`
		 * @param node - The node to find its index in parent
		 * @returns Index of the node
		 */
		function indexInParent(node: HTMLElement): number;

		/** Shorthand for {@link indexInParent} */
		function index(node: HTMLElement): number;

		/**
		 * Gets the parent of the element if it matches the selector,
		 * otherwise returns null.
		 * @param element - Element to get parent of
		 * @param [selector=""] - Selector to match parent
		 * @returns The sibling element or null
		 */
		function parent(element: Element, selector?: string): Element | null;

		/**
		 * Gets all children of Element that match the selector if provided.
		 * @param element - Element to get all children of
		 * @param selector - Selector to match the children to
		 * @returns The list of children
		 */
		function findChild(element: Element, selector: string): Element;

		/**
		 * Gets all children of Element that match the selector if provided.
		 * @param element - Element to get all children of
		 * @param selector - Selector to match the children to
		 * @returns The list of children
		 */
		function findChildren(element: Element, selector: string): Element[];

		/**
		 * Gets all ancestors of Element that match the selector if provided.
		 * @param element - Element to get all parents of
		 * @param [selector=""] - Selector to match the parents to
		 * @returns The list of parents
		 */
		function parents(element: Element, selector?: string): Element[];

		/**
		 * Gets the ancestors until an element matches the selector.
		 * @param element - Element to get the ancestors of
		 * @param selector - Selector to stop at
		 * @returns The list of parents
		 */
		function parentsUntil(element: Element, selector: string): Element[];

		/**
		 * Gets all siblings of the element that match the selector.
		 * @param element - Element to get all siblings of
		 * @param [selector="*"] - Selector to match the siblings to
		 * @returns The list of siblings
		 */
		function siblings(element: Element, selector?: string): Element[];

		/**
		 * Sets or gets css styles for a specific element. If `value` is provided
		 * then it sets the style and returns the element to allow for chaining,
		 * otherwise returns the style.
		 * @param element - Element to set the CSS of
		 * @param attribute - Attribute to get or set
		 * @param [value] - Value to set for attribute
		 * @returns When setting a value, element is returned for chaining, otherwise the value is returned.
		 */
		function css(element: Element, attribute: string, value?: string): Element | string;

		/**
		 * Sets or gets the width for a specific element. If `value` is provided
		 * then it sets the width and returns the element to allow for chaining,
		 * otherwise returns the width.
		 * @param element - Element to set the CSS of
		 * @param [value] - Width to set
		 * @returns When setting a value, element is returned for chaining, otherwise the value is returned.
		 */
		function width(element: Element, value?: string): Element | string;

		/**
		 * Sets or gets the height for a specific element. If `value` is provided
		 * then it sets the height and returns the element to allow for chaining,
		 * otherwise returns the height.
		 * @param element - Element to set the CSS of
		 * @param [value] - Height to set
		 * @returns When setting a value, element is returned for chaining, otherwise the value is returned.
		 */
		function height(element: Element, value?: string): Element | string;

		/**
		 * Sets the inner text of an element if given a value, otherwise returns it.
		 * @param element - Element to set the text of
		 * @param [text] - Content to set
		 * @returns Either the string set by this call or the current text content of the node.
		 */
		function text(element: Element, text?: string): string;

		/**
		 * Returns the innerWidth of the element.
		 * @param element - Element to retrieve inner width of
		 * @return The inner width of the element.
		 */
		function innerWidth(element: Element): number;

		/**
		 * Returns the innerHeight of the element.
		 * @param element - Element to retrieve inner height of
		 * @return The inner height of the element.
		 */
		function innerHeight(element: Element): number;

		/**
		 * Returns the outerWidth of the element.
		 * @param element - Element to retrieve outer width of
		 * @return The outer width of the element.
		 */
		function outerWidth(element: Element): number;

		/**
		 * Returns the outerHeight of the element.
		 * @param element - Element to retrieve outer height of
		 * @return The outer height of the element.
		 */
		function outerHeight(element: Element): number;

		/**
		 * Gets the offset of the element in the page.
		 * @param element - Element to get offset of
		 * @return The offset of the element
		 */
		function offset(element: Element): DOMRect;

		const listeners: any;

		/**
		 * This is similar to jQuery's `on` function and can *hopefully* be used in the same way.
		 *
		 * Rather than attempt to explain, I'll show some example usages.
		 *
		 * The following will add a click listener (in the `myPlugin` namespace) to `element`.
		 * `DOMTools.on(element, "click.myPlugin", () => {console.log("clicked!");});`
		 *
		 * The following will add a click listener (in the `myPlugin` namespace) to `element` that only fires when the target is a `.block` element.
		 * `DOMTools.on(element, "click.myPlugin", ".block", () => {console.log("clicked!");});`
		 *
		 * The following will add a click listener (without namespace) to `element`.
		 * `DOMTools.on(element, "click", () => {console.log("clicked!");});`
		 *
		 * The following will add a click listener (without namespace) to `element` that only fires once.
		 * `const cancel = DOMTools.on(element, "click", () => {console.log("fired!"); cancel();});`
		 *
		 * @param element - Element to add listener to
		 * @param event - Event to listen to with option namespace (e.g. "event.namespace")
		 * @param delegate - Selector to run on element to listen to
		 * @param [callback] - Function to fire on event
		 * @returns A function that will undo the listener
		 */
		function on(element: Element, event: string, delegate: string | Function, callback?: Function): () => void;

		/**
		 * Functionality for this method matches {@link on} but automatically cancels itself
		 * and removes the listener upon the first firing of the desired event.
		 *
		 * @param element - Element to add listener to
		 * @param event - Event to listen to with option namespace (e.g. "event.namespace")
		 * @param delegate - Selector to run on element to listen to
		 * @param [callback] - Function to fire on event
		 * @returns A function that will undo the listener
		 */
		function once(element: Element, event: string, delegate: string | Function, callback?: Function): () => void;

		function __offAll(event: string, element: Element): void;

		/**
		 * This is similar to jQuery's `off` function and can *hopefully* be used in the same way.
		 *
		 * Rather than attempt to explain, I'll show some example usages.
		 *
		 * The following will remove a click listener called `onClick` (in the `myPlugin` namespace) from `element`.
		 * `DOMTools.off(element, "click.myPlugin", onClick);`
		 *
		 * The following will remove a click listener called `onClick` (in the `myPlugin` namespace) from `element` that only fired when the target is a `.block` element.
		 * `DOMTools.off(element, "click.myPlugin", ".block", onClick);`
		 *
		 * The following will remove a click listener (without namespace) from `element`.
		 * `DOMTools.off(element, "click", onClick);`
		 *
		 * The following will remove all listeners in namespace `myPlugin` from `element`.
		 * `DOMTools.off(element, ".myPlugin");`
		 *
		 * The following will remove all click listeners in namespace `myPlugin` from *all elements*.
		 * `DOMTools.off("click.myPlugin");`
		 *
		 * The following will remove all listeners in namespace `myPlugin` from *all elements*.
		 * `DOMTools.off(".myPlugin");`
		 *
		 * @param element - Element to remove listener from
		 * @param [event] - Event to listen to with option namespace (e.g. "event.namespace")
		 * @param [delegate] - Selector to run on element to listen to
		 * @param [callback] - Function to fire on event
		 * @returns The original element to allow for chaining
		 */
		function off(
			element: Element | string,
			event?: string,
			delegate?: string | Function,
			callback?: Function
		): Element;

		/**
		 * Adds a listener for when the node is added/removed from the document body.
		 * The listener is automatically removed upon firing.
		 * @param node - node to wait for
		 * @param callback - function to be performed on event
		 * @param onMount - determines if it should fire on Mount or on Unmount
		 */
		function onMountChange(node: HTMLElement, callback: Function, onMount?: boolean): HTMLElement;

		/** Shorthand for {@link onMountChange} with third parameter `true` */
		function onMount(node: HTMLElement, callback: Function): HTMLElement;

		/** Shorthand for {@link onMountChange} with third parameter `false` */
		function onUnmount(node: HTMLElement, callback: Function): HTMLElement;

		/** Alias for {@link onMount} */
		function onAdded(node: HTMLElement, callback: Function): HTMLElement;

		/** Alias for {@link onUnmount} */
		function onRemoved(node: HTMLElement, callback: Function): HTMLElement;

		/**
		 * Helper function which combines multiple elements into one parent element
		 * @param elements - array of elements to put into a single parent
		 */
		function wrap(elements: HTMLElement[]): HTMLElement;

		/**
		 * Resolves the node to an HTMLElement. This is mainly used by library modules.
		 * @param {(jQuery|Element)} node - node to resolve
		 */
		function resolveElement(node: Element): HTMLElement;
	}

	type DiscordClassModules = {
		ContextMenu: any;
		Scrollers: any;
		AccountDetails: any;
		Typing: any;
		UserPopout: any;
		PopoutRoles: any;
		UserModal: any;
		Textarea: any;
		Popouts: any;
		App: any;
		Titles: any;
		Notices: any;
		Backdrop: any;
		Modals: any;
		AuditLog: any;
		ChannelList: any;
		MemberList: any;
		TitleWrap: any;
		Titlebar: any;
		Embeds: any;
		Layers: any;
		TooltipLayers: any;
		Margins: any;
		Dividers: any;
		Changelog: any;
		BasicInputs: any;
		Messages: any;
		Guilds: any;
		EmojiPicker: any;
		Reactions: any;
		Checkbox: any;
		Tooltips: any;
	};
	/**
	 * A large list of known and labelled classes in discord.
	 *
	 * You can use this directly, however the preferred way of doing this is to use {@link DiscordClasses} or {@link DiscordSelectors}
	 */
	export const DiscordClassModules: DiscordClassModules;

	type DiscordClasses = {
		[key in keyof typeof DiscordClassModules]: any;
	};
	/**
	 * Proxy for all the class packages, allows us to safely attempt
	 * to retrieve nested things without error. Also wraps the class in
	 * {@link DOMTools.ClassName} which adds features but can still
	 * be used in native function.
	 *
	 * For a list of all available class namespaces check out {@link DiscordClassModules}.
	 */
	export const DiscordClasses: DiscordClasses;

	type DiscordModules = {
		React: typeof React;
		ReactDOM: typeof ReactDOM;
		Events: any;
		GuildStore: any;
		SortedGuildStore: any;
		SelectedGuildStore: any;
		GuildSync: any;
		GuildInfo: any;
		GuildChannelsStore: any;
		GuildMemberStore: any;
		MemberCountStore: any;
		GuildEmojiStore: any;
		GuildActions: any;
		GuildPermissions: any;
		ChannelStore: any;
		SelectedChannelStore: any;
		ChannelActions: any;
		PrivateChannelActions: any;
		UserInfoStore: any;
		UserSettingsStore: any;
		StreamerModeStore: any;
		UserSettingsUpdater: any;
		OnlineWatcher: any;
		CurrentUserIdle: any;
		RelationshipStore: any;
		RelationshipManager: any;
		MentionStore: any;
		UserStore: any;
		UserStatusStore: any;
		UserTypingStore: any;
		UserActivityStore: any;
		UserNameResolver: any;
		UserNoteStore: any;
		UserNoteActions: any;
		EmojiInfo: any;
		EmojiUtils: any;
		EmojiStore: any;
		InviteStore: any;
		InviteResolver: any;
		InviteActions: any;
		DiscordConstants: any;
		DiscordPermissions: any;
		Permissions: any;
		ColorConverter: any;
		ColorShader: any;
		TinyColor: any;
		ClassResolver: any;
		ButtonData: any;
		NavigationUtils: any;
		KeybindStore: any;
		MessageStore: any;
		ReactionsStore: any;
		MessageActions: any;
		MessageQueue: any;
		MessageParser: any;
		ExperimentStore: any;
		ExperimentsManager: any;
		CurrentExperiment: any;
		StreamStore: any;
		StreamPreviewStore: any;
		ImageResolver: any;
		ImageUtils: any;
		AvatarDefaults: any;
		DNDSources: any;
		DNDObjects: any;
		ElectronModule: any;
		Flux: any;
		Dispatcher: any;
		PathUtils: any;
		NotificationModule: any;
		RouterModule: any;
		APIModule: any;
		AnalyticEvents: any;
		KeyGenerator: any;
		Buffers: any;
		DeviceStore: any;
		SoftwareInfo: any;
		i18n: any;
		MediaDeviceInfo: any;
		MediaInfo: any;
		MediaEngineInfo: any;
		VoiceInfo: any;
		SoundModule: any;
		WindowInfo: any;
		DOMInfo: any;
		LocaleManager: any;
		Moment: any;
		LocationManager: any;
		Timestamps: any;
		Strings: any;
		StringFormats: any;
		StringUtils: any;
		URLParser: any;
		ExtraURLs: any;
		hljs: any;
		SimpleMarkdown: any;
		LayerManager: any;
		UserSettingsWindow: any;
		ChannelSettingsWindow: any;
		GuildSettingsWindow: any;
		ModalActions: any;
		ModalStack: any;
		UserProfileModals: any;
		AlertModal: any;
		ConfirmationModal: any;
		ChangeNicknameModal: any;
		CreateChannelModal: any;
		PruneMembersModal: any;
		NotificationSettingsModal: any;
		PrivacySettingsModal: any;
		Changelog: any;
		PopoutStack: any;
		PopoutOpener: any;
		UserPopout: any;
		ContextMenuActions: any;
		ContextMenuItemsGroup: any;
		ContextMenuItem: any;
		ExternalLink: any;
		TextElement: any;
		Anchor: any;
		Flex: any;
		FlexChild: any;
		Clickable: any;
		Titles: any;
		HeaderBar: any;
		TabBar: any;
		Tooltip: any;
		Spinner: any;
		FormTitle: any;
		FormSection: any;
		FormNotice: any;
		ScrollerThin: any;
		ScrollerAuto: any;
		AdvancedScrollerThin: any;
		AdvancedScrollerAuto: any;
		AdvancedScrollerNone: any;
		SettingsWrapper: any;
		SettingsNote: any;
		SettingsDivider: any;
		ColorPicker: any;
		Dropdown: any;
		Keybind: any;
		RadioGroup: any;
		Slider: any;
		SwitchRow: any;
		Textbox: any;
	};
	/**
	 * A large list of known and useful webpack modules internal to Discord.
	 */
	export const DiscordModules: DiscordModules;

	type DiscordSelectors = {
		[key in keyof typeof DiscordClassModules]: any;
	};
	/**
	 * Gives us a way to retrieve the internal classes as selectors without
	 * needing to concatenate strings or use string templates. Wraps the
	 * selector in {@link DOMTools.Selector} which adds features but can
	 * still be used in native function.
	 *
	 * For a list of all available class namespaces check out {@link DiscordClassModules}.
	 */
	export const DiscordSelectors: DiscordSelectors;

	type WebpackModulesFilter = (module: any) => boolean;

	/**
	 * Filters for use with {@link WebpackModules} but may prove useful elsewhere.
	 */
	export class Filters {
		/**
		 * Generates a {@link WebpackModulesFilter} that filters by a set of properties.
		 * @param props - Array of property names
		 * @param filter - Additional filter
		 * @returns A filter that checks for a set of properties
		 */
		static byProperties(props: string[], filter?: WebpackModulesFilter): WebpackModulesFilter;

		/**
		 * Generates a {@link WebpackModulesFilter} that filters by a set of properties on the object's prototype.
		 * @param fields - Array of property names
		 * @param filter - Additional filter
		 * @returns A filter that checks for a set of properties on the object's prototype
		 */
		static byPrototypeFields(fields: string[], filter?: WebpackModulesFilter): WebpackModulesFilter;

		/**
		 * Generates a {@link WebpackModulesFilter} that filters by a regex.
		 * @param search - A RegExp to check on the module
		 * @param filter - Additional filter
		 * @returns A filter that checks for a set of properties
		 */
		static byCode(search: RegExp, filter?: WebpackModulesFilter): WebpackModulesFilter;

		/**
		 * Generates a {@link WebpackModulesFilter} that filters by strings.
		 * @param strings - A set of strings to check on the module
		 * @returns A filter that checks for a set of strings
		 */
		static byString(...strings: string[]): WebpackModulesFilter;

		/**
		 * Generates a {@link WebpackModulesFilter} that filters by a set of properties.
		 * @param name - Name the module should have
		 * @returns A filter that checks for a set of properties
		 */
		static byDisplayName(name: string): WebpackModulesFilter;

		/**
		 * Generates a combined {@link WebpackModulesFilter} from a list of filters.
		 * @param filters - A list of filters
		 * @returns Combinatory filter of all arguments
		 */
		static combine(...filters: WebpackModulesFilter[]): WebpackModulesFilter;
	}

	/**
	 * Simple logger for the lib and plugins.
	 */
	export class Logger {
		/**
		 * Logs an error using a collapsed error group with stacktrace.
		 *
		 * @param module - Name of the calling module.
		 * @param message - Message or error to have logged.
		 * @param error - Error object to log with the message.
		 */
		static stacktrace(module: string, message: string, error: Error): void;

		/**
		 * Logs using error formatting. For logging an actual error object consider {@link Logger.stacktrace}
		 *
		 * @param module - Name of the calling module.
		 * @param message - Messages to have logged.
		 */
		static err(module: string, ...message: string[]): void;

		/**
		 * Logs a warning message.
		 *
		 * @param module - Name of the calling module.
		 * @param message - Messages to have logged.
		 */
		static warn(module: string, ...message: any[]): void;

		/**
		 * Logs an informational message.
		 *
		 * @param module - Name of the calling module.
		 * @param message - Messages to have logged.
		 */
		static info(module: string, ...message: any[]): void;

		/**
		 * Logs used for debugging purposes.
		 *
		 * @param module - Name of the calling module.
		 * @param message - Messages to have logged.
		 */
		static debug(module: string, ...message: any[]): void;

		/**
		 * Logs used for basic loggin.
		 *
		 * @param module - Name of the calling module.
		 * @param message - Messages to have logged.
		 */
		static log(module: string, ...message: any[]): void;

		/**
		 * Logs strings using different console levels and a module label.
		 *
		 * @param module - Name of the calling module.
		 * @param message - Messages to have logged.
		 * @param type - Type of log to use in console.
		 */
		static _log(
			module: string,
			message: any | any[],
			type?: "err" | "error" | "dbg" | "debug" | "log" | "warn" | "info"
		): void;

		static parseType(type: string): string;
	}

	/**
	 * Allows an easy way to create and show modals.
	 */
	export class Modals {
		static get ModalSizes(): any;

		/**
		 * Shows the user profile modal for a given user.
		 * @param userId - id of the user to show profile for
		 */
		static showUserProfile(userId: string): void;

		/**
		 * Acts as a wrapper for {@link module:Modals.showModal} where the `children` is a text element.
		 * @param title - title of the modal
		 * @param content - text to show inside the modal. Can be markdown.
		 * @param [options] - see {@link Modals.showModal}
		 */
		static showConfirmationModal(title: string, content: string, options?: any): void;

		/**
		 * Shows a very simple alert modal that has title, content and an okay button.
		 * @param title - title of the modal
		 * @param body - text to show inside the modal
		 */
		static showAlertModal(title: string, body: string): void;

		/**
		 * Shows a generic but very customizable modal.
		 * @param title - title of the modal
		 * @param children - a single or array of rendered react elements to act as children
		 * @param [options] - options to modify the modal
		 * @param [options.danger=false] - whether the main button should be red or not
		 * @param [options.confirmText=Okay] - text for the confirmation/submit button
		 * @param [options.cancelText=Cancel] - text for the cancel button
		 * @param [options.onConfirm=NOOP] - callback to occur when clicking the submit button
		 * @param [options.onCancel=NOOP] - callback to occur when clicking the cancel button
		 */
		static showModal(
			title: string,
			children: React.ReactElement | React.ReactElement[],
			options?: {
				danger?: boolean;
				confirmText?: string;
				cancelText?: string;
				onConfirm?: () => void;
				onCancel?: () => void;
			}
		): void;

		/**
		 * Shows a changelog modal based on changelog data.
		 * @param title - title of the modal
		 * @param version - subtitle (usually version or date) of the modal
		 * @param changelog - changelog to show inside the modal
		 * @param changelog.title - title of the changelog section
		 * @param [changelog.type=added] - type information of the section. Options: added, improved, fixed, progress.
		 * @param changelog.items - itemized list of items to show in that section. Can use markdown.
		 * @param footer - either an html element or text to show in the footer of the modal. Can use markdown.
		 */
		static showChangelogModal(
			title: string,
			version: string,
			changelog: {
				title: string;
				type?: string;
				items: string[];
			},
			footer: string
		): void;
	}

	/**
	 * Function with no arguments and no return value that may be called to revert changes made by {@link Patcher}, restoring (unpatching) original method.
	 */
	type unpatch = () => void;

	/**
	 * A callback that modifies method logic. This callback is called on each call of the original method and is provided all data about original call. Any of the data can be modified if necessary, but do so wisely.
	 *
	 * The third argument for the callback will be `undefined` for `before` patches. `originalFunction` for `instead` patches and `returnValue` for `after` patches.
	 * @param thisObject - `this` in the context of the original function.
	 * @param arguments - The original arguments of the original function.
	 * @param extraValue - For `instead` patches, this is the original function from the module. For `after` patches, this is the return value of the function.
	 * @return Makes sense only when using an `instead` or `after` patch. If something other than `undefined` is returned, the returned value replaces the value of `returnValue`. If used for `before` the return value is ignored.
	 */
	type patchCallback = (thisObject?: any, arguments?: any, extraValue?: any) => any;

	interface Patch {
		name: string;
		module: any;
		functionName: string;
		originalFunction: Function;
		proxyFunction: Function;
		revert: () => void;
		counter: number;
		children: ChildPatch[];
	}

	interface ChildPatch {
		caller: string;
		type: "before" | "after" | "instead";
		id: number;
		callback: patchCallback;
		unpatch: unpatch;
	}

	/**
	 * Patcher that can patch other functions allowing you to run code before, after or
	 * instead of the original function. Can also alter arguments and return values.
	 */
	export class Patcher {
		static get patches(): Patch[];

		/**
		 * Returns all the patches done by a specific caller
		 * @param name - Name of the patch caller
		 */
		static getPatchesByCaller(name: string): Patch[];

		/**
		 * Unpatches all patches passed, or when a string is passed unpatches all
		 * patches done by that specific caller.
		 * @param patches - Either an array of patches to unpatch or a caller name
		 */
		static unpatchAll(patches?: Patch[] | string): void;

		static resolveModule(module: any): any;

		static makeOverride(patch: Patch): () => any;

		static rePatch(patch: Patch): void;

		static makePatch(module: any, functionName: string, name: string): Patch;

		/**
		 * This method patches onto another function, allowing your code to run beforehand.
		 * Using this, you are also able to modify the incoming arguments before the original method is run.
		 *
		 * @param caller - Name of the caller of the patch function. Using this you can undo all patches with the same name using {@link Patcher.unpatchAll}. Use `""` if you don't care.
		 * @param moduleToPatch - Object with the function to be patched. Can also patch an object's prototype.
		 * @param functionName - Name of the method to be patched
		 * @param callback - Function to run before the original method
		 * @param options - Object used to pass additional options.
		 * @param [options.displayName] You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
		 * @param [options.forcePatch=true] Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
		 * @return Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
		 */
		static before(
			caller: string,
			moduleToPatch: any,
			functionName: string,
			callback: patchCallback,
			options?: { displayName: string; forcePatch: boolean }
		): unpatch;

		/**
		 * This method patches onto another function, allowing your code to run beforehand.
		 * Using this, you are also able to modify the incoming arguments before the original method is run.
		 *
		 * @param caller - Name of the caller of the patch function. Using this you can undo all patches with the same name using {@link Patcher.unpatchAll}. Use `""` if you don't care.
		 * @param moduleToPatch - Object with the function to be patched. Can also patch an object's prototype.
		 * @param functionName - Name of the method to be patched
		 * @param callback - Function to run before the original method
		 * @param options - Object used to pass additional options.
		 * @param [options.displayName] You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
		 * @param [options.forcePatch=true] Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
		 * @return Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
		 */
		static before(
			moduleToPatch: any,
			functionName: string,
			callback: patchCallback,
			options?: { displayName: string; forcePatch: boolean }
		): unpatch;

		/**
		 * This method patches onto another function, allowing your code to run after.
		 * Using this, you are also able to modify the return value, using the return of your code instead.
		 *
		 * @param caller - Name of the caller of the patch function. Using this you can undo all patches with the same name using {@link Patcher.unpatchAll}. Use `""` if you don't care.
		 * @param moduleToPatch - Object with the function to be patched. Can also patch an object's prototype.
		 * @param functionName - Name of the method to be patched
		 * @param callback - Function to run instead of the original method
		 * @param options - Object used to pass additional options.
		 * @param [options.displayName] You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
		 * @param [options.forcePatch=true] Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
		 * @return Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
		 */
		static after(
			caller: string,
			moduleToPatch: any,
			functionName: string,
			callback: patchCallback,
			options?: { displayName: string; forcePatch: boolean }
		): unpatch;

		/**
		 * This method patches onto another function, allowing your code to run after.
		 * Using this, you are also able to modify the return value, using the return of your code instead.
		 *
		 * @param caller - Name of the caller of the patch function. Using this you can undo all patches with the same name using {@link Patcher.unpatchAll}. Use `""` if you don't care.
		 * @param moduleToPatch - Object with the function to be patched. Can also patch an object's prototype.
		 * @param functionName - Name of the method to be patched
		 * @param callback - Function to run instead of the original method
		 * @param options - Object used to pass additional options.
		 * @param [options.displayName] You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
		 * @param [options.forcePatch=true] Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
		 * @return Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
		 */
		static after(
			moduleToPatch: any,
			functionName: string,
			callback: patchCallback,
			options?: { displayName: string; forcePatch: boolean }
		): unpatch;

		/**
		 * This method patches onto another function, allowing your code to run instead.
		 * Using this, you are also able to modify the return value, using the return of your code instead.
		 *
		 * @param caller - Name of the caller of the patch function. Using this you can undo all patches with the same name using {@link Patcher.unpatchAll}. Use `""` if you don't care.
		 * @param moduleToPatch - Object with the function to be patched. Can also patch an object's prototype.
		 * @param functionName - Name of the method to be patched
		 * @param callback - Function to run after the original method
		 * @param options - Object used to pass additional options.
		 * @param [options.displayName] You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
		 * @param [options.forcePatch=true] Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
		 * @return Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
		 */
		static instead(
			caller: string,
			moduleToPatch: any,
			functionName: string,
			callback: patchCallback,
			options?: { displayName: string; forcePatch: boolean }
		): unpatch;

		/**
		 * This method patches onto another function, allowing your code to run instead.
		 * Using this, you are also able to modify the return value, using the return of your code instead.
		 *
		 * @param caller - Name of the caller of the patch function. Using this you can undo all patches with the same name using {@link Patcher.unpatchAll}. Use `""` if you don't care.
		 * @param moduleToPatch - Object with the function to be patched. Can also patch an object's prototype.
		 * @param functionName - Name of the method to be patched
		 * @param callback - Function to run after the original method
		 * @param options - Object used to pass additional options.
		 * @param [options.displayName] You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
		 * @param [options.forcePatch=true] Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
		 * @return Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
		 */
		static instead(
			moduleToPatch: any,
			functionName: string,
			callback: patchCallback,
			options?: { displayName: string; forcePatch: boolean }
		): unpatch;

		/**
		 * This method patches onto another function, allowing your code to run before, instead or after the original function.
		 * Using this you are able to modify the incoming arguments before the original function is run as well as the return
		 * value before the original function actually returns.
		 *
		 * @param caller - Name of the caller of the patch function. Using this you can undo all patches with the same name using {@link Patcher.unpatchAll}. Use `""` if you don't care.
		 * @param moduleToPatch - Object with the function to be patched. Can also patch an object's prototype.
		 * @param functionName - Name of the method to be patched
		 * @param callback - Function to run after the original method
		 * @param options - Object used to pass additional options.
		 * @param [options.type=after] - Determines whether to run the function `before`, `instead`, or `after` the original.
		 * @param [options.displayName] You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
		 * @param [options.forcePatch=true] Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
		 * @return Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
		 */
		static pushChildPatch(
			caller: string,
			moduleToPatch: any,
			functionName: string,
			callback: patchCallback,
			options?: {
				type?: "before" | "instead" | "after";
				displayName?: string;
				forcePatch?: boolean;
			}
		): unpatch;
	}

	/**
	 * Function that gets the remote version from the file contents.
	 * @param fileContent - the content of the remote file
	 * @returns remote version
	 */
	type versioner = (fileContent: string) => string;

	/**
	 * Comparator that takes the current version and the remote version,
	 * then compares them returning `true` if there is an update and `false` otherwise.
	 * @param currentVersion - the current version of the plugin
	 * @param remoteVersion - the remote version of the plugin
	 * @returns whether the plugin has an update or not
	 */
	type comparator = (currentVersion: string, remoteVersion: string) => boolean;

	/**
	 * Functions that check for and update existing plugins.
	 */
	export class PluginUpdater {
		static get CSS(): string;

		/**
		 * Checks for updates for the specified plugin at the specified link. The final
		 * parameter should link to the raw text of the plugin and will compare semantic
		 * versions.
		 * @param pluginName - name of the plugin
		 * @param currentVersion - current version (semantic versioning only)
		 * @param updateURL - url to check for update
		 * @param [versioner] - versioner that finds the remote version. If not provided uses {@link PluginUpdater.defaultVersioner}.
		 * @param [comparator] - comparator that determines if there is an update. If not provided uses {@link PluginUpdater.defaultComparator}.
		 */
		static checkForUpdate(
			pluginName: string,
			currentVersion: string,
			updateURL: string,
			versioner?: versioner,
			comparator?: comparator
		): void;

		/**
		 * Will check for updates and automatically show or remove the update notice
		 * bar based on the internal result. Better not to call this directly and to
		 * instead use {@link PluginUpdater.checkForUpdate}.
		 * @param pluginName - name of the plugin to check
		 * @param updateLink - link to the raw text version of the plugin
		 */
		static processUpdateCheck(pluginName: string, updateLink: string): Promise<void>;

		/**
		 * The default versioner used as {@link versioner} for {@link PluginUpdater.checkForUpdate}.
		 * This works on basic semantic versioning e.g. "1.0.0". You do not need to provide this as a versioner if your plugin adheres
		 * to this style as this will be used as default.
		 * @param content
		 */
		static defaultVersioner(content: string): string;

		/**
		 * The default comparator used as {@link comparator} for {@link PluginUpdater.checkForUpdate}.
		 * This works on basic semantic versioning e.g. "1.0.0". You do not need to provide this as a comparator if your plugin adheres
		 * to this style as this will be used as default.
		 * @param currentVersion
		 * @param remoteVersion
		 */
		static defaultComparator(currentVersion: string, remoteVersion: string): boolean;

		static patchPluginList(): void;

		/**
		 * Creates the update button found in the plugins page of BetterDiscord
		 * settings. Returned button will already have listeners to create the tooltip.
		 * @returns check for update button
		 */
		static createUpdateButton(): HTMLElement;

		/**
		 * Will download the latest version and replace the the old plugin version.
		 * @param pluginName - name of the plugin to download
		 * @param updateLink - link to the raw text version of the plugin
		 */
		static downloadPlugin(pluginName: string, updateLink: string): void;

		/**
		 * Will show the update notice top bar seen in Discord. Better not to call
		 * this directly and to instead use {@link PluginUpdater.checkForUpdate}.
		 * @param pluginName - name of the plugin
		 * @param updateLink - link to the raw text version of the plugin
		 */
		static showUpdateNotice(pluginName: string, updateLink: string): void;

		/**
		 * Will remove the plugin from the update notice top bar seen in Discord.
		 * Better not to call this directly and to instead use {@link PluginUpdater.checkForUpdate}.
		 * @param pluginName - name of the plugin
		 */
		static removeUpdateNotice(pluginName: string): void;
	}

	/**
	 * A series of useful functions for BetterDiscord plugins.
	 * @deprecated 1/21/22 Use Alternatives
	 */
	export class PluginUtilities {
		/**
		 * Loads data through BetterDiscord's API.
		 * @param name - name for the file (usually plugin name)
		 * @param key - which key the data is saved under
		 * @param defaultData - default data to populate the object with
		 * @returns the combined saved and default data
		 * @deprecated 1/21/22 Use Utilities or BdApi directly
		 */
		static loadData(name: string, key: string, defaultData: any): any;

		/**
		 * Saves data through BetterDiscord's API.
		 * @param {string} name - name for the file (usually plugin name)
		 * @param {string} key - which key the data should be saved under
		 * @param {object} data - data to save
		 * @deprecated 1/21/22 Use Utilities or BdApi directly
		 */
		static saveData(name: string, key: string, data: any): void;

		/**
		 * Loads settings through BetterDiscord's API.
		 * @param name - name for the file (usually plugin name)
		 * @param defaultSettings - default data to populate the object with
		 * @returns the combined saved and default settings
		 * @deprecated 1/21/22 Use Utilities or BdApi directly
		 */
		static loadSettings(name: string, defaultSettings: any): any;

		/**
		 * Saves settings through BetterDiscord's API.
		 * @param name - name for the file (usually plugin name)
		 * @param data - settings to save
		 * @deprecated 1/21/22 Use Utilities or BdApi directly
		 */
		static saveSettings(name: string, data: any): void;

		/**
		 * Get the full path to the BetterDiscord folder.
		 * @returns full path to the BetterDiscord folder
		 * @deprecated 1/21/22 Use BdApi
		 */
		static getBDFolder(subtarget?: string): string;

		/**
		 * Get the full path to the plugins folder.
		 * @returns full path to the plugins folder
		 * @deprecated 1/21/22 Use BdApi
		 */
		static getPluginsFolder(): string;

		/**
		 * Get the full path to the themes folder.
		 * @returns full path to the themes folder
		 * @deprecated 1/21/22 Use BdApi
		 */
		static getThemesFolder(): string;

		/**
		 * Adds a style to the document.
		 * @param id - identifier to use as the element id
		 * @param css - css to add to the document
		 * @deprecated 1/21/22 Use DOMTools
		 */
		static addStyle(id: string, css: string): void;

		/**
		 * Removes a style from the document.
		 * @param id - original identifier used
		 * @deprecated 1/21/22 Use DOMTools
		 */
		static removeStyle(id: string): void;

		/**
		 * Adds/requires a remote script to be loaded
		 * @param id - identifier to use for this script
		 * @param url - url from which to load the script
		 * @returns promise that resolves when the script is loaded
		 * @deprecated 1/21/22 Use DOMTools
		 */
		static addScript(id: string, url: string): Promise<void>;

		/**
		 * Removes a remote script from the document.
		 * @param id - original identifier used
		 * @deprecated 1/21/22 Use DOMTools
		 */
		static removeScript(id: string): void;
	}

	/**
	 * Allows an easy way to create and show popouts.
	 */
	export class Popouts {
		static get AnimationTypes(): { FADE: 3; SCALE: 2; TRANSLATE: 1 };

		static initialize(): void;

		/**
		 * Shows the user popout for a user relative to a target element
		 * @param target - Element to show the popout in relation to
		 * @param user - Discord User object for the user to show
		 * @param [options] - Options to modify the request
		 * @param [options.guild="currentGuildId"] - Id of the guild  (uses current if not specified)
		 * @param [options.channel="currentChannelId"] - Id of the channel (uses current if not specified)
		 * @param [options.position="right"] - Positioning relative to element
		 * @param [options.align="top"] - Positioning relative to element
		 */
		static showUserPopout(
			target: HTMLElement,
			user: any,
			options?: {
				guild?: string;
				channel?: string;
				position?: "top" | "bottom" | "left" | "right";
				align?: "top" | "bottom" | "left" | "right";
			}
		): void;

		/**
		 * Shows a react popout relative to a target element
		 * @param target - Element to show the popout in relation to
		 * @param [options] - Options to modify the request
		 * @param [options.position="right"] - General position relative to element
		 * @param [options.align="top"] - Alignment relative to element
		 * @param [options.animation=Popouts.AnimationTypes.TRANSLATE] - Animation type to use
		 * @param [options.autoInvert=true] - Try to automatically adjust the position if it overflows the screen
		 * @param [options.nudgeAlignIntoViewport=true] - Try to automatically adjust the alignment if it overflows the screen
		 * @param [options.spacing=8] - Spacing between target and popout
		 */
		static openPopout(
			target: HTMLElement,
			options?: {
				position?: "top" | "bottom" | "left" | "right";
				align?: "top" | "bottom" | "left" | "right";
				animation?: 3 | 2 | 1;
				autoInvert?: boolean;
				nudgeAlignIntoViewport?: boolean;
				spacing?: number;
			}
		): number;

		static closePopout(id: number): void;

		static dispose(): void;
	}

	export namespace ReactComponents {
		class ReactComponent {
			constructor(id: string, component: Function, selector: string, filter: Function);

			id: string;

			component: Function;

			selector: string;

			filter: Function;

			forceUpdateAll(): void;
		}

		const components: Map<string, ReactComponent>;

		const unknownComponents: Set<ReactComponent>;

		const listeners: Map<string, { id: string; children: Function[]; filter: Function }>;

		const nameSetters: Set<{ name: string; filter: Function }>;

		function initialize(): void;

		function push(component: Function, selector: string, filter: Function): ReactComponent;

		/**
		 * Finds a component from the components array or by waiting for it to be mounted.
		 * @param name The component's name
		 * @param selector A selector to look for
		 */
		function getComponentByName(name: string, selector: string): Promise<ReactComponent>;

		/**
		 * Finds a component from the components array or by waiting for it to be mounted.
		 * @param {String} name The component's name
		 * @param {Object} selector A selector to look for
		 * @param {Function} filter A function to filter components if a single element is rendered by multiple components
		 * @return {Promise<ReactComponent>}
		 */
		function getComponent(name: string, selector: any, filter: Function): Promise<ReactComponent>;

		function setName(name: string, filter: Function): Set<{ name: string; filter: Function }>;

		function processUnknown(component: ReactComponent): ReactComponent;

		function recursiveComponents(internalInstance?: any): any;
	}

	export class ReactTools {
		static get rootInstance(): any;

		/**
		 * Grabs the react internal instance of a specific node.
		 * @param node - node to obtain react instance of
		 * @return the internal react instance
		 */
		static getReactInstance(node: HTMLElement): any;

		/**
		 * Grabs a value from the react internal instance. Allows you to grab
		 * long depth values safely without accessing no longer valid properties.
		 * @param node - node to obtain react instance of
		 * @param path - path to the requested value
		 * @return the value requested or undefined if not found.
		 */
		static getReactProperty(node: HTMLElement, path: string): any;

		/**
		 * Grabs a value from the react internal instance. Allows you to grab
		 * long depth values safely without accessing no longer valid properties.
		 * @param node - node to obtain react instance of
		 * @param {object} options - options for the search
		 * @param {array} [options.include] - list of items to include from the search
		 * @param {array} [options.exclude=["Popout", "Tooltip", "Scroller", "BackgroundFlash"]] - list of items to exclude from the search
		 * @param {callable} [options.filter=_=>_] - filter to check the current instance with (should return a boolean)
		 * @return {(*|null)} the owner instance or undefined if not found.
		 */
		static getOwnerInstance(
			node: HTMLElement,
			options?: {
				include?: string[];
				exclude?: string[];
				filter?: (instance: any) => boolean;
			}
		): any;

		/**
		 * Grabs the react internal state node trees of a specific node.
		 * @param node - node to obtain state nodes of
		 * @return list of found state nodes
		 */
		static getStateNodes(node: HTMLElement): any[];

		/**
		 * Grabs the react internal component tree of a specific node.
		 * @param node - node to obtain react components of
		 * @return list of found react components
		 */
		static getComponents(node: HTMLElement): any[];

		/**
		 * Creates and renders a react element that wraps dom elements.
		 * @param element - element or array of elements to wrap into a react element
		 * @returns rendered react element
		 */
		static createWrappedElement(element: HTMLElement | HTMLElement[]): any;

		/**
		 * Creates an unrendered react component that wraps dom elements.
		 * @param element - element or array of elements to wrap into a react component
		 * @returns unrendered react component
		 */
		static wrapElement(element: HTMLElement | HTMLElement[]): any;
	}

	/**
	 * Acts as an interface for anything that should be listenable.
	 */
	class Listenable {
		constructor();

		/**
		 * Adds a listener to the current object.
		 * @param callback - callback for when the event occurs
		 * @returns a way to cancel the listener without needing to call `removeListener`
		 */
		addListener(callback: Function): () => void;

		/**
		 * Removes a listener from the current object.
		 * @param callback - callback that was originally registered
		 */
		removeListener(callback: Function): void;

		/**
		 * Alerts the listeners that an event occurred. Data passed is optional
		 * [...data] - Any data desired to be passed to listeners
		 */
		alertListeners(...data: any[]): void;
	}

	export namespace Settings {
		const CSS: string;

		class ReactSetting extends React.Component {}

		/**
		 * Setting field to extend to create new settings
		 */
		class SettingField extends Listenable {
			/**
			 * @param name - name label of the setting
			 * @param note - help/note to show underneath or above the setting
			 * @param onChange - callback to perform on setting change
			 * @param settingtype - actual setting to render
			 * @param [props] - object of props to give to the setting and the settingtype
			 * @param [props.noteOnTop=false] - determines if the note should be shown above the element or not.
			 */
			constructor(
				name: string,
				note: string,
				onChange: Function,
				settingtype: Function | HTMLElement,
				props?: { [key: string]: any; noteOnTop?: boolean }
			);

			/** @returns root element for setting */
			getElement(): HTMLElement;

			/** Fires onchange to listeners */
			onChange(): void;

			/** Fired when root node added to DOM */
			onAdded(): void;

			/** Fired when root node removed from DOM */
			onRemoved(): void;
		}

		/**
		 * Grouping of controls for easier management in settings panels.
		 */
		class SettingGroup extends Listenable {
			/**
			 * @param groupName - title for the group of settings
			 * @param [options] - additional options for the group
			 * @param [options.callback] - callback called on settings changed
			 * @param [options.collapsible=true] - determines if the group should be collapsible
			 * @param [options.shown=false] - determines if the group should be expanded by default
			 */
			constructor(groupName: string, options?: { callback?: Function; collapsible?: boolean; shown?: boolean });

			/** @returns root node for the group. */
			getElement(): HTMLElement;

			/**
			 * Adds multiple nodes to this group.
			 * @param nodes - list of nodes to add to the group container
			 * @returns returns self for chaining
			 */
			append(...nodes: (HTMLElement | SettingField | SettingGroup)[]): SettingGroup;

			/**
			 * Appends this node to another
			 * @param node - node to attach the group to.
			 * @returns returns self for chaining
			 */
			appendTo(node: HTMLElement): SettingGroup;

			/** Fires onchange to listeners */
			onChange(): void;
		}

		/**
		 * Grouping of controls for easier management in settings panels.
		 */
		class SettingPanel extends Listenable {
			/**
			 * Creates a new settings panel
			 * @param onChange - callback to fire when settings change
			 * @param nodes  - list of nodes to add to the panel container
			 */
			constructor(onChange: Function, ...nodes: (HTMLElement | SettingField | SettingGroup)[]);

			/**
			 * Creates a new settings panel
			 * @param onChange - callback to fire when settings change
			 * @param nodes  - list of nodes to add to the panel container
			 * @returns root node for the panel.
			 */
			static build(onChange: Function, ...nodes: (HTMLElement | SettingField | SettingGroup)[]): HTMLElement;

			/** @returns root node for the panel. */
			getElement(): HTMLElement;

			/**
			 * Adds multiple nodes to this panel.
			 * @param nodes - list of nodes to add to the panel container
			 * @returns returns self for chaining
			 */
			append(...nodes: (HTMLElement | SettingField | SettingGroup)[]): SettingPanel;

			/** Fires onchange to listeners */
			onChange(): void;
		}

		/**
		 * Creates a textbox using discord's built in textbox.
		 */
		class Textbox extends SettingField {
			/**
			 * @param name - name label of the setting
			 * @param note - help/note to show underneath or above the setting
			 * @param value - current text in box
			 * @param onChange - callback to perform on setting change, callback receives text
			 * @param [options] - object of options to give to the setting
			 * @param [options.placeholder=""] - placeholder for when textbox is empty
			 * @param [options.disabled=false] - should the setting be disabled
			 */
			constructor(
				name: string,
				note: string,
				value: string,
				onChange: Function,
				options?: { placeholder?: string; disabled?: false }
			);
		}

		/**
		 * Creates a color picker using Discord's built in color picker
		 * as a base. Input and output using hex strings.
		 */
		class ColorPicker extends SettingField {
			/**
			 * @param name - name label of the setting
			 * @param note - help/note to show underneath or above the setting
			 * @param value - current hex color
			 * @param onChange - callback to perform on setting change, callback receives hex string
			 * @param [options] - object of options to give to the setting
			 * @param [options.disabled=false] - should the setting be disabled
			 * @param [options.defaultColor] - default color to show as large option
			 * @param [options.colors] - preset colors to show in swatch
			 */
			constructor(
				name: string,
				note: string,
				value: string,
				onChange: Function,
				options?: { disabled?: boolean; defaultColor?: string; colors?: number[] }
			);

			/** Default colors for ColorPicker */
			static get presetColors(): number[];
		}

		/**
		 * Creates a file picker using chromium's default.
		 */
		class FilePicker extends SettingField {
			/**
			 * @param name - name label of the setting
			 * @param note - help/note to show underneath or above the setting
			 * @param onChange - callback to perform on setting change, callback receives File object
			 * @param [options] - object of options to give to the setting
			 * @param [options.disabled=false] - should the setting be disabled
			 * @param [options.accept] - what file types should be accepted
			 * @param [options.multiple=false] - should multiple files be accepted
			 */
			constructor(
				name: string,
				note: string,
				onChange: Function,
				options?: { disabled?: boolean; accept?: string | string[]; multiple?: boolean }
			);
		}

		/**
		 * Used to render the marker.
		 * @param value - The value to render
		 * @returns the text to show in the marker
		 */
		type SliderMarkerValue = (value: number) => string;

		/**
		 * Used to render the grabber tooltip.
		 * @param value - The value to render
		 * @returns the text to show in the tooltip
		 */
		type SliderRenderValue = (value: number) => string;

		/**
		 * Creates a slider/range using discord's built in slider.
		 * @memberof module:Settings
		 * @extends module:Settings.SettingField
		 */
		class Slider extends SettingField {
			/**
			 *
			 * @param name - name label of the setting
			 * @param note - help/note to show underneath or above the setting
			 * @param min - minimum value allowed
			 * @param max - maximum value allowed
			 * @param value - currently selected value
			 * @param onChange - callback to fire when setting is changed, callback receives number
			 * @param [options] - object of options to give to the setting
			 * @param [options.disabled=false] - should the setting be disabled
			 * @param [options.fillStyles] - object of css styles to add to active slider
			 * @param [options.defaultValue] - value highlighted as default
			 * @param [options.keyboardStep] - step moved when using arrow keys
			 * @param [options.markers] - array of vertical markers to show on the slider
			 * @param [options.stickToMarkers] - should the slider be forced to use markers
			 * @param [options.equidistant] - should the markers be scaled to be equidistant
			 * @param [options.onMarkerRender] - function to call to render the value in the marker
			 * @param [options.renderMarker] - alias of `onMarkerRender`
			 * @param [options.onValueRender] - function to call to render the value in the tooltip
			 * @param [options.renderValue] - alias of `onValueRender`
			 * @param [options.units] - can be used in place of `onValueRender` will use this string and render Math.round(value) + units
			 */
			constructor(
				name: string,
				note: string,
				min: number,
				max: number,
				value: number,
				onChange: Function,
				options?: {
					disabled?: boolean;
					fillStyles?: any;
					defaultValue?: number;
					keyboardStep?: number;
					markers?: number[];
					stickToMarkers?: boolean;
					equidistant?: boolean;
					onMarkerRender?: SliderMarkerValue;
					renderMarker?: SliderMarkerValue;
					onValueRender?: SliderRenderValue;
					renderValue?: SliderRenderValue;
					units?: string;
				}
			);
		}

		/**
		 * Creates a switch using discord's built in switch.
		 */
		class Switch extends SettingField {
			/**
			 * @param name - name label of the setting
			 * @param note - help/note to show underneath or above the setting
			 * @param isChecked - should switch be checked
			 * @param onChange - callback to perform on setting change, callback receives boolean
			 * @param [options] - object of options to give to the setting
			 * @param [options.disabled=false] - should the setting be disabled
			 */
			constructor(
				name: string,
				note: string,
				isChecked: boolean,
				onChange: Function,
				options?: { disabled?: boolean }
			);

			onAdded(): void;
		}

		/**
		 * @property {string} label - label to show in the dropdown
		 * @property {*} value - actual value represented by label (this is passed via onChange)
		 */
		interface DropdownItem {
			label: string;
			value: any;
		}

		/**
		 * Creates a dropdown using discord's built in dropdown.
		 */
		class Dropdown extends SettingField {
			/**
			 * @param name - name label of the setting
			 * @param note - help/note to show underneath or above the setting
			 * @param defaultValue - currently selected value
			 * @param values - array of all options available
			 * @param onChange - callback to perform on setting change, callback item value
			 * @param [options] - object of options to give to the setting
			 * @param [options.clearable=false] - should be able to empty the field value
			 * @param [options.searchable=false] - should user be able to search the dropdown
			 * @param [options.disabled=false] - should the setting be disabled
			 */
			constructor(
				name: string,
				note: string,
				defaultValue: any,
				values: DropdownItem[],
				onChange: Function,
				options?: {
					clearable?: boolean;
					searchable?: boolean;
					disabled?: boolean;
				}
			);
		}

		/**
		 * Creates a keybind setting using discord's built in keybind recorder.
		 * @memberof module:Settings=
		 * @extends module:Settings.SettingField
		 */
		class Keybind extends SettingField {
			/**
			 * @param label - name label of the setting
			 * @param help - help/note to show underneath or above the setting
			 * @param value - array of key names
			 * @param onChange - callback to perform on setting change, callback receives array of keycodes
			 * @param [options] - object of options to give to the setting
			 * @param [options.disabled=false] - should the setting be disabled
			 */
			constructor(
				label: string,
				help: string,
				value: string[],
				onChange: Function,
				options?: { disabled?: boolean }
			);
		}

		/**
		 * @property name - label to show in the dropdown
		 * @property value - actual value represented by label (this is passed via onChange)
		 * @property desc - description/help text to show below name
		 * @property color - hex string to color the item
		 */
		interface RadioItem {
			name: string;
			value: any;
			desc: string;
			color: string;
		}

		/**
		 * Creates a radio group using discord's built in radios.
		 */
		class RadioGroup extends SettingField {
			/**
			 * @param name - name label of the setting
			 * @param note - help/note to show underneath or above the setting
			 * @param defaultValue - currently selected value
			 * @param values - array of all options available
			 * @param onChange - callback to perform on setting change, callback item value
			 * @param [options] - object of options to give to the setting
			 * @param [options.disabled=false] - should the setting be disabled
			 */
			constructor(
				name: string,
				note: string,
				defaultValue: any,
				values: RadioItem[],
				onChange: Function,
				options?: { disabled?: boolean }
			);
		}
	}

	/**
	 * Toast maker similar to Android.
	 */
	export class Toast {
		static get CSS(): string;

		/** Shorthand for `type = "success"` for {@link Toasts.show} */
		static success(content: string, options?: { icon?: string; timeout?: number }): Promise<void>;

		/** Shorthand for `type = "info"` for {@link Toasts.show} */
		static info(content: string, options?: { icon?: string; timeout?: number }): Promise<void>;

		/** Shorthand for `type = "warning"` for {@link Toasts.show} */
		static warning(content: string, options?: { icon?: string; timeout?: number }): Promise<void>;

		/** Shorthand for `type = "error"` for {@link Toasts.show} */
		static error(content: string, options?: { icon?: string; timeout?: number }): Promise<void>;

		/** Shorthand for `type = "default"` for {@link Toasts.show} */
		static default(content: string, options?: { icon?: string; timeout?: number }): Promise<void>;

		/**
		 * Shows a simple toast, similar to Android, centered over
		 * the textarea if it exists, and center screen otherwise.
		 * Vertically it shows towards the bottom like in Android.
		 * @param content - The string to show in the toast.
		 * @param options - additional options for the toast
		 * @param [options.type] - Changes the type of the toast stylistically and semantically. {@link Toasts.ToastTypes}
		 * @param [options.icon] - URL to an optional icon
		 * @param [options.timeout=3000] - Adjusts the time (in ms) the toast should be shown for before disappearing automatically
		 * @returns Promise that resolves when the toast is removed from the DOM
		 */
		static show(content: string, options?: { type?: string; icon?: string; timeout?: number }): Promise<void>;

		static buildToast(message: string, type: string, icon: string): string;

		static getIcon(icon: string): string;

		static ensureContainer(): void;

		static parseType(type: string): string;

		/**
		 * Enumeration of accepted types.
		 */
		static get ToastTypes(): {
			default: "";
			error: "error";
			success: "success";
			warning: "warning";
			info: "info";
		};
	}

	/**
	 * Tooltip that automatically show and hide themselves on mouseenter and mouseleave events.
	 * Will also remove themselves if the node to watch is removed from DOM through
	 * a MutationObserver.
	 *
	 * Note this is not using Discord's internals but normal DOM manipulation and emulates
	 * Discord's own tooltips as closely as possible.
	 */
	export class Tooltip {
		/**
		 * @param node - DOM node to monitor and show the tooltip on
		 * @param text - string to show in the tooltip
		 * @param options - additional options for the tooltip
		 * @param [options.style=black] - correlates to the discord styling/colors (black, brand, green, grey, red, yellow)
		 * @param [options.side=top] - can be any of top, right, bottom, left
		 * @param [options.preventFlip=false] - prevents moving the tooltip to the opposite side if it is too big or goes offscreen
		 * @param [options.isTimestamp=false] - adds the timestampTooltip class (disables text wrapping)
		 * @param [options.disablePointerEvents=false] - disables pointer events
		 * @param [options.disabled=false] - whether the tooltip should be disabled from showing on hover
		 */
		constructor(
			node: HTMLElement,
			text: string,
			options?: {
				style?: string;
				side?: string;
				preventFlip?: boolean;
				isTimestamp?: boolean;
				disablePointerEvents?: boolean;
				disabled?: boolean;
			}
		);

		/** Alias for the constructor */
		static create(
			node: HTMLElement,
			text: string,
			options?: {
				style?: string;
				side?: string;
				preventFlip?: boolean;
				isTimestamp?: boolean;
				disablePointerEvents?: boolean;
				disabled?: boolean;
			}
		): Tooltip;

		/** Container where the tooltip will be appended. */
		get container(): HTMLElement;

		/** Boolean representing if the tooltip will fit on screen above the element */
		get canShowAbove(): boolean;

		/** Boolean representing if the tooltip will fit on screen below the element */
		get canShowBelow(): boolean;

		/** Boolean representing if the tooltip will fit on screen to the left of the element */
		get canShowLeft(): boolean;

		/** Boolean representing if the tooltip will fit on screen to the right of the element */
		get canShowRight(): boolean;

		/** Hides the tooltip. Automatically called on mouseleave. */
		hide(): void;

		/** Shows the tooltip. Automatically called on mouseenter. Will attempt to flip if position was wrong. */
		show(): void;

		/** Force showing the tooltip above the node. */
		showAbove(): void;

		/** Force showing the tooltip below the node. */
		showBelow(): void;

		/** Force showing the tooltip to the left of the node. */
		showLeft(): void;

		/** Force showing the tooltip to the right of the node. */
		showRight(): void;

		centerHorizontally(): void;

		centerVertically(): void;
	}

	/**
	 * Random set of utilities that didn't fit elsewhere.
	 */
	export class Utilities {
		/**
		 * Stably sorts arrays since `.sort()` has issues.
		 * @param list - array to sort
		 * @param comparator - comparator to sort by
		 */
		static stableSort(list: any[], comparator: Function): void;

		/**
		 * Generates an automatically memoizing version of an object.
		 * @param object - object to memoize
		 * @returns the proxy to the object that memoizes properties
		 */
		static memoizeObject(object: any): any;

		/**
		 * Wraps the method in a `try..catch` block.
		 * @param method - method to wrap
		 * @param description - description of method
		 * @returns wrapped version of method
		 */
		static suppressErrors<T extends Function>(method: T, description: string): T;

		static isNil(anything: any): boolean;

		/**
		 * Format template strings with placeholders (`${placeholder}`) into full strings.
		 * Quick example: `Utilities.formatString("Hello, ${user}", {user: "Zerebos"})`
		 * would return "Hello, Zerebos".
		 * @param string - string to format
		 * @param values - object literal of placeholders to replacements
		 * @returns the properly formatted string
		 */
		static formatTString(string: string, values: Record<string, string>): string;

		/**
		 * Format strings with placeholders (`{{placeholder}}`) into full strings.
		 * Quick example: `Utilities.formatString("Hello, {{user}}", {user: "Zerebos"})`
		 * would return "Hello, Zerebos".
		 * @param string - string to format
		 * @param values - object literal of placeholders to replacements
		 * @returns the properly formatted string
		 */
		static formatString(string: string, values: Record<string, string>): string;

		/**
		 * Finds a value, subobject, or array from a tree that matches a specific filter. Great for patching render functions.
		 * @param tree React tree to look through. Can be a rendered object or an internal instance.
		 * @param searchFilter Filter function to check subobjects against.
		 */
		static findInReactTree(tree: any, searchFilter: (item: any) => boolean): any;

		/**
		 * Finds a value, subobject, or array from a tree that matches a specific filter.
		 * @param tree Tree that should be walked
		 * @param searchFilter Filter to check against each object and subobject
		 * @param options Additional options to customize the search
		 * @param [options.walkable=null] Array of strings to use as keys that are allowed to be walked on. Null value indicates all keys are walkable
		 * @param [options.ignore=[]] Array of strings to use as keys to exclude from the search, most helpful when `walkable = null`.
		 */
		static findInTree(
			tree: any,
			searchFilter: (item: any) => boolean,
			options?: { walkable?: string[]; ignore?: string[] }
		): any;

		/**
		 * Gets a nested property (if it exists) safely. Path should be something like `prop.prop2.prop3`.
		 * Numbers can be used for arrays as well like `prop.prop2.array.0.id`.
		 * @param obj - object to get nested property of
		 * @param path - representation of the property to obtain
		 */
		static getNestedProp(obj: any, path: string): any;

		/**
		 * Builds a classname string from any number of arguments. This includes arrays and objects.
		 * When given an array all values from the array are added to the list.
		 * When given an object they keys are added as the classnames if the value is truthy.
		 * Copyright (c) 2018 Jed Watson https://github.com/JedWatson/classnames MIT License
		 * @param arguments - anything that should be used to add classnames.
		 */
		static className(...arguments: any[]): string;

		/**
		 * Safely adds to the prototype of an existing object by checking if the
		 * property exists on the prototype.
		 * @param object - Object whose prototype to extend
		 * @param prop - Name of the prototype property to add
		 * @param func - Function to run
		 */
		static addToPrototype(object: any, prop: string, func: Function): Function;

		/**
		 * Deep extends an object with a set of other objects. Objects later in the list
		 * of `extenders` have priority, that is to say if one sets a key to be a primitive,
		 * it will be overwritten with the next one with the same key. If it is an object,
		 * and the keys match, the object is extended. This happens recursively.
		 * @param extendee - Object to be extended
		 * @param extenders - Objects to extend with
		 * @returns A reference to `extendee`
		 */
		static extend(extendee: any, ...extenders: any[]): any;

		/**
		 * Clones an object and all it's properties.
		 * @param value The value to clone
		 * @return The cloned value
		 */
		static deepclone(value: any): any;

		/**
		 * Freezes an object and all it's properties.
		 * @param object The object to freeze
		 * @param exclude A function to filter object that shouldn't be frozen
		 */
		static deepfreeze(object: any, exclude: (object: any) => boolean): any;

		/**
		 * Removes an item from an array. This differs from Array.prototype.filter as it mutates the original array instead of creating a new one.
		 * @param array The array to filter
		 * @param item The item to remove from the array
		 * @return The filtered array
		 */
		static removeFromArray(array: any[], item: any, filter: any): any[];

		/**
		 * Returns a function, that, as long as it continues to be invoked, will not
		 * be triggered. The function will be called after it stops being called for
		 * N milliseconds.
		 *
		 * Adapted from the version by David Walsh (https://davidwalsh.name/javascript-debounce-function)
		 * @param executor
		 * @param delay
		 */
		static debounce(executor: Function, delay: number): void;

		/**
		 * Loads data through BetterDiscord's API.
		 * @param name - name for the file (usually plugin name)
		 * @param key - which key the data is saved under
		 * @param defaultData - default data to populate the object with
		 * @returns the combined saved and default data
		 */
		static loadData(name: string, key: string, defaultData: any): any;

		/**
		 * Saves data through BetterDiscord's API.
		 * @param name - name for the file (usually plugin name)
		 * @param key - which key the data should be saved under
		 * @param data - data to save
		 */
		static saveData(name: string, key: string, data: any): void;

		/**
		 * Loads settings through BetterDiscord's API.
		 * @param name - name for the file (usually plugin name)
		 * @param defaultSettings - default data to populate the object with
		 * @returns the combined saved and default settings
		 */
		static loadSettings(name: string, defaultSettings: any): any;

		/**
		 * Saves settings through BetterDiscord's API.
		 * @param {string} name - name for the file (usually plugin name)
		 * @param {object} data - settings to save
		 */
		static saveSettings(name: string, data: any): void;
	}

	export class WebpackModules {
		static find(filter: WebpackModulesFilter, first?: boolean): any;

		static findAll(filter: WebpackModulesFilter): any[];

		static findByUniqueProperties(props: string[], first?: boolean): any | any[];

		static findByDisplayName(name: string): any;

		/**
		 * Finds a module using a filter function.
		 * @param filter A function to use to filter modules
		 * @param first Whether to return only the first matching module
		 */
		static getModule(filter: WebpackModulesFilter, first?: boolean): any;

		/**
		 * Gets the index in the webpack require cache of a specific
		 * module using a filter.
		 * @param filter A function to use to filter modules
		 */
		static getIndex(filter: WebpackModulesFilter): number | null;

		/**
		 * Gets the index in the webpack require cache of a specific
		 * module that was already found.
		 * @param module An already acquired module
		 */
		static getIndexByModule(module: any): number | null;

		/**
		 * Finds all modules matching a filter function.
		 * @param filter A function to use to filter modules
		 */
		static getModules(filter: WebpackModulesFilter): any[];

		/**
		 * Finds a module by its name.
		 * @param name The name of the module
		 * @param fallback A function to use to filter modules if not finding a known module
		 */
		static getModuleByName(name: string, fallback: WebpackModulesFilter): any;

		/**
		 * Finds a module by its display name.
		 * @param name The display name of the module
		 */
		static getByDisplayName(name: string): any;

		/**
		 * Finds a module using its code.
		 * @param regex A regular expression to use to filter modules
		 * @param first Whether to return the only the first matching module
		 */
		static getByRegex(regex: RegExp, first?: boolean): any;

		/**
		 * Finds a single module using properties on its prototype.
		 * @param prototypes Properties to use to filter modules
		 */
		static getByPrototypes(...prototypes: string[]): any;

		/**
		 * Finds all modules with a set of properties of its prototype.
		 * @param prototypes Properties to use to filter modules
		 */
		static getAllByPrototypes(...prototypes: string[]): any[];

		/**
		 * Finds a single module using its own properties.
		 * @param props Properties to use to filter modules
		 */
		static getByProps(...props: string[]): any;

		/**
		 * Finds all modules with a set of properties.
		 * @param props Properties to use to filter modules
		 */
		static getAllByProps(...props: string[]): any[];

		/**
		 * Finds a single module using a set of strings.
		 * @param strings Strings to use to filter modules
		 */
		static getByString(...strings: string[]): any;

		/**
		 * Finds all modules with a set of strings.
		 * @param strings Strings to use to filter modules
		 */
		static getAllByString(...strings: string[]): any[];

		/**
		 * Gets a specific module by index of the webpack require cache.
		 * Best used in combination with getIndex in order to patch a
		 * specific function.
		 *
		 * Note: this gives the **raw** module, meaning the actual module
		 * is in returnValue.exports. This is done in order to be able
		 * to patch modules which export a single function directly.
		 * @param index Index into the webpack require cache
		 */
		static getByIndex(index: number): any;

		/**
		 * Discord's __webpack_require__ function.
		 */
		static get require(): Function;

		/**
		 * Returns all loaded modules.
		 */
		static getAllModules(): any[];

		static get chunkName(): "webpackChunkdiscord_app";

		static initialize(): void;

		/**
		 * Adds a listener for when discord loaded a chunk. Useful for subscribing to lazy loaded modules.
		 * @param listener - Function to subscribe for chunks
		 * @returns A cancelling function
		 */
		static addListener(listener: Function): () => boolean;

		/**
		 * Removes a listener for when discord loaded a chunk.
		 * @param listener
		 */
		static removeListener(listener: Function): boolean;

		static handlePush(chunk: any): any;
	}

	export {};
}
