import { Webpack } from "betterdiscord";
import Logger from "./logger";
import { SearchOptions } from "bdapi";

type Filter = (e: any, m: any, i: string) => boolean;

/**
 * Options for the `expectModule` function. Takes all options for a normal `getModule` query as well as:
 * - `name`: The name of the module (for error logging)
 * - `fatal`: Whether or not to stop plugin execution when the module is not found
 * - `fallback`: A fallback value to use when the module is not found
 * - `onError`: A callback function that is run when the module is not found
 */
type ExpectModuleOptions<T> = {
	name?: string;
	fatal?: boolean;
	fallback?: T;
	onError?: () => void;
} & SearchOptions<boolean>;

export const WebpackUtils = {
	/**
	 * Gets a Flux store by its name.
	 * @param name The name of the store.
	 * @returns The found store.
	 */
	getStore(name: string) {
		return Webpack.getModule((m: any) => m._dispatchToken && m.getName() === name);
	},

	/**
	 * Generates a Webpack filter to get a Flux store by its name.
	 * @param name The name of the store.
	 * @returns The generated filter.
	 * @deprecated use `getStore` instead.
	 */
	store(name: string) {
		return (m: any) => m._dispatchToken && m.getName() === name;
	},

	/**
	 * Generates a Webpack filter to get a module by its Webpack id.
	 * @param id The Webpack module id.
	 * @returns The generated filter.
	 */
	byId(id: string) {
		return (_e: any, _m: any, i: string) => i === id;
	},

	/**
	 * Generates a Webpack filter to get a module with property values that satisfy a set of filters.
	 * @param filters Filters that property values on the module must satisfy.
	 * @returns The generated filter.
	 */
	byValues(...filters: Filter[]) {
		return (e: any, m: any, i: string) => {
			let match = true;

			for (const filter of filters) {
				if (!Object.values(e).some((v) => filter(v, m, i))) {
					match = false;
					break;
				}
			}

			return match;
		};
	},

	/**
	 * Finds a module with a property value that satisfies a filter, as well as the key of that property. Useful for patching.
	 * @param filter A function to use to filter modules.
	 * @returns An array containing the module and key.
	 */
	getModuleWithKey(filter: Filter): [any, string] {
		let target: any;
		let id: string;
		let key: string;
		Webpack.getModule(
			(e, m, i) => {
				if (filter(e, m, i)) {
					target = m;
					id = i;
					return true;
				}
				return false;
			},
			{ searchExports: true }
		);
		for (const k in target.exports) {
			if (filter(target.exports[k], target, id)) {
				key = k;
				break;
			}
		}
		return [target.exports, key];
	},

	/**
	 * Finds a module using a filter function, and handles the error if the module is not found.
	 * @param filter A function to use to filter modules.
	 * @param options Options for the module search and error handling.
	 * @returns The found module or the fallback if the module cannot be found.
	 */
	expectModule<T>(filter: Filter, options?: ExpectModuleOptions<T>): T {
		const found = Webpack.getModule(filter, options);
		if (found) return found;

		const name = options.name ? `'${options.name}'` : `query with filter '${filter.toString()}'`;
		const fallbackMessage = !options.fatal && options.fallback ? " Using fallback value instead." : "";
		const errorMessage = `Module ${name} not found.${fallbackMessage}\n\nContact the plugin developer to inform them of this error.`;

		Logger.error(errorMessage);
		options.onError?.();
		if (options.fatal) throw new Error(errorMessage);

		return options.fallback;
	},
};
