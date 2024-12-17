import { Plugin } from "rollup";

interface CompressedTemplatesOptions {
	regex: RegExp;
}

export default function compressedTemplates(options: CompressedTemplatesOptions): Plugin {
	return {
		name: "compressed-templates",
		transform(code: string, id: string) {
			if (options.regex.test(id)) {
				return code.replace(/`(.*?[^\\])`/gs, (_, contents) => `\`${contents.replace(/\n/g, "\\n")}\``);
			}
		},
	};
}
