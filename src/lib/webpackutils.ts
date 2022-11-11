import { Webpack } from "betterdiscord";

type Filter = (e: any, m: any, i: string) => boolean;

export const WebpackUtils = {
	/**
	 * Generates a Webpack filter to get a Flux store by its name.
	 * @param name The name of the store.
	 * @returns The generated filter.
	 */
	store(name: string) {
		return (m: any) => m.getName?.() === name;
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
	}
};
