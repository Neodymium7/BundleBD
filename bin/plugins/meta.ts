import { Meta } from "bdapi";
import { Plugin } from "rollup";

export default function meta(meta: Meta): Plugin {
	return {
		name: "meta",
		resolveId(id: string) {
			// Treat meta as json file
			if (id === "meta") return "meta.json";
			return null;
		},
		load(id: string) {
			if (id === "meta.json") {
				return JSON.stringify(meta);
			}
		},
	};
}
