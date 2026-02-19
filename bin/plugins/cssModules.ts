import { Plugin } from "rollup";

interface CSSModulesOptions {
	cssModules: Record<string, string>;
}

export default function cssModules(options: CSSModulesOptions): Plugin {
	return {
		name: "css-modules",
		transform(code: string, id: string) {
			if (id in options.cssModules) {
				let moduleId: string;
				return code
					.replace(/modules(.*) = .*;/, (_, mid) => {
						moduleId = mid;
						return `modules${mid} = ${options.cssModules[id]};`;
					})
					.replace(/export default .*;/, `export default modules${moduleId};`);
			}
		},
	};
}
