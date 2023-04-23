import path from "path";

interface ModuleCommentsOptions {
	root: string;
	aliases?: Record<string, string>;
}

export default function moduleComments(options: ModuleCommentsOptions) {
	return {
		name: "module-comments",
		transform(code: string, id: string) {
			// Plugin files
			if (id.startsWith(options.root)) {
				id = path.relative(options.root, id).replace(/\\/g, "/");
			}
			// Node modules
			else if (id.includes("node_modules")) {
				id = id.slice(id.indexOf("node_modules") + 13).split(path.sep)[0];
			}
			// Import aliases
			else if (options.aliases) {
				for (const key in options.aliases) {
					const regex = new RegExp(`^${path.resolve(options.aliases[key]).replace("*", "")}(.*)$`);
					if (regex.test(id)) {
						id = id.replace(regex, `${key.replace("*", "")}$1`);
						break;
					}
				}
			}
			// Unknown
			else {
				id = id.split(path.sep).pop() || id;
			}

			return `// ${id}\n${code}`;
		},
	};
}
