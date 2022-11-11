import path from "path";

interface ModuleCommentsOptions {
	root: string;
}

export default function moduleComments(options: ModuleCommentsOptions) {
	return {
		name: "module-comments",
		transform(code: string, id: string) {
			if (id.startsWith(options.root)) {
				id = path.relative(options.root, id).replace(/\\/g, "/");
			} else if (id.includes("node_modules")) {
				id = id.slice(id.indexOf("node_modules") + 13).split(path.sep)[0];
			} else id = id.split(path.sep).pop() || id;

			return `// ${id}\n${code}`;
		}
	};
}
