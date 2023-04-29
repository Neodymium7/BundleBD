import { Plugin } from "rollup";

interface StyleLoaderOptions {
	regex: RegExp;
}

export default function styleLoader(options: StyleLoaderOptions): Plugin {
	return {
		name: "style-loader",
		transform(code: string, id: string) {
			if (options.regex.test(id) && code.includes("_loadStyle")) {
				return 'import { _loadStyle } from "styles"\n' + code;
			}
		},
		resolveId(id: string) {
			if (id === "styles") return id;
			return null;
		},
		load(id: string) {
			if (id === "styles") {
				return `
import { DOM } from "betterdiscord";
let _styles = "";
export function _loadStyle(path, css) {
	_styles += "/*" + path + "*/\\n" + css + "\\n";
}
export function addStyles() {
	DOM.addStyle(_styles);
}
export function removeStyles() {
	DOM.removeStyle();
}
export default function styles() {
	return _styles;
}`;
			}
		},
	};
}
