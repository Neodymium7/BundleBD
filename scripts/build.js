/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { build } = require("esbuild");
const prettier = require("prettier");
const { dependencies } = require("../package.json");

const externalPlugin = {
	name: "external-plugin",
	setup(build) {
		let filter = /^[^./]|^\.[^./]|^\.\.[^/]/;
		build.onResolve({ filter }, (args) => ({ path: args.path, external: true }));
	},
};

const noCommentsPlugin = {
	name: "no-comments-plugin",
	setup(build) {
		build.onEnd((result) => {
			if (result.errors.length > 0) return;

			const content = fs.readFileSync("index.js", "utf8");
			fs.writeFileSync("index.js", content.replace(/\n?\/\/.*\n/g, ""));
		});
	},
};

const declarationPlugin = {
	name: "declaration-plugin",
	setup(build) {
		build.onEnd((result) => {
			if (result.errors.length > 0) return;
			execSync("tsc");

			if (!fs.existsSync("types/global")) fs.mkdirSync("types/global");
			fs.readdirSync("lib/global").forEach((file) => {
				fs.copyFileSync(`lib/global/${file}`, `types/global/${file}`);
			});
			const content = fs.readFileSync("types/index.d.ts", "utf8");
			fs.writeFileSync("types/index.d.ts", content.replace("../lib/global/", "global/"));
		});
	},
};

const formatOptions = {
	printWidth: 200,
	tabWidth: 4,
	useTabs: true,
	trailingComma: "none",
	endOfLine: "lf",
	parser: "babel",
};

const builds = [
	{
		name: "bin",
		options: {
			entryPoints: ["bin/index.ts"],
			outfile: "bin.js",
			bundle: true,
			external: [...Object.keys(dependencies)],
			platform: "node",
			banner: { js: "#!/usr/bin/env node\n" },
		},
	},
	{
		name: "lib",
		options: {
			entryPoints: ["lib/index.ts"],
			outfile: "index.js",
			bundle: true,
			platform: "node",
			format: "esm",
			plugins: [externalPlugin, declarationPlugin, noCommentsPlugin],
		},
	},
];

const format = (file) => {
	const filePath = path.resolve(process.cwd(), file);
	const content = fs.readFileSync(filePath, "utf8");
	const formatted = prettier.format(content, formatOptions);
	fs.writeFileSync(filePath, formatted);
};

if (process.argv.slice(2)[0] === "watch") {
	for (const currBuild of builds) {
		const { name, options } = currBuild;
		options.watch = {
			onRebuild(error) {
				if (error) return;
				format(options.outfile);
				console.log(`Built ${name}`);
			},
		};
	}
}

for (const currBuild of builds) {
	const { name, options } = currBuild;
	build(options).then(() => {
		format(options.outfile);
		console.log(`Built ${name}`);
	});
}
