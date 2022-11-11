interface StyleLoaderOptions {
	regex: RegExp;
}

export default function styleLoader(options: StyleLoaderOptions) {
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
				return 'let _styles = "";\nexport function _loadStyle(path, css) {\n\t_styles += "/*" + path + "*/\\n" + css + "\\n";\n}\nexport default function styles() {\n\treturn _styles;\n}';
			}
		}
	};
}
