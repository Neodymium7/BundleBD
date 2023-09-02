import { Plugin } from "rollup";

interface ConstOptions {
	regex: RegExp;
}

export default function constPlugin(options: ConstOptions): Plugin {
	return {
		name: "const",
		transform(code: string, id: string) {
			if (options.regex.test(id)) {
				return code.replace(/^var /gm, "const ").replace(/^export var /gm, "export const ");
			}
		},
	};
}
