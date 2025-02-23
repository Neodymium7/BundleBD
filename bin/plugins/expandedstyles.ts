import { Plugin } from "rollup";

interface ExpandedStylesOptions {
	regex: RegExp;
}

export default function expandedStyles(options: ExpandedStylesOptions): Plugin {
	return {
		name: "expanded-styles",
		transform(code: string, id: string) {
			if (options.regex.test(id)) {
				const unescaped: string = JSON.parse(JSON.stringify(code).replace(/\\\\([^(\\")])/g, "\\$1"));
				return unescaped
					.replace(/\t/g, "  ")
					.replace(/\n+/g, "\n")
					.replace(/\\"/g, '"')
					.replace(/css = "(.*\n.*)";/s, (_, contents) => `css = \`\n${contents.trimEnd()}\`;`)
					.replace(
						/modules(.*) = ({.*});/,
						(_, id, obj) => `modules${id} = ${JSON.stringify(JSON.parse(obj), null, "  ")};`
					);
			}
		},
	};
}
