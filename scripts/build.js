const fs = require("fs");
const path = require("path");
const { build } = require("esbuild");
const prettier = require("prettier");
const { dependencies } = require("../package.json");

const formatOptions = {
	printWidth: 200,
	tabWidth: 4,
	useTabs: true,
	trailingComma: "none",
	endOfLine: "lf",
	parser: "babel"
};

const builds = [
	{
		name: "main",
		options: {
			entryPoints: ["src/index.ts"],
			outfile: "bin/index.js",
			bundle: true,
			external: [...Object.keys(dependencies), "terser-webpack-plugin"],
			platform: "node",
			banner: { js: "#!/usr/bin/env node\n" }
		},
		format: () => {
			const filePath = path.resolve(process.cwd(), "bin/index.js");
			const content = fs.readFileSync(filePath, "utf8");
			const formatted = prettier.format(content, formatOptions);
			fs.writeFileSync(filePath, formatted);
		}
	},
	{
		name: "loaders",
		options: {
			entryPoints: fs.readdirSync("./src/loaders").map((file) => `./src/loaders/${file}`),
			outdir: "bin/loaders"
		},
		format: () => {
			const files = fs.readdirSync("./bin/loaders");
			for (let i = 0; i < files.length; i++) {
				const filePath = path.resolve(process.cwd(), `./bin/loaders/${files[i]}`);
				const content = fs.readFileSync(filePath, "utf8");
				const formatted = prettier.format(content, formatOptions);
				fs.writeFileSync(filePath, formatted);
			}
		}
	},
	{
		name: "modules",
		options: {
			entryPoints: fs.readdirSync("./src/modules").map((file) => `./src/modules/${file}`),
			outdir: "bin/modules"
		},
		format: () => {
			const files = fs.readdirSync("./bin/modules");
			for (let i = 0; i < files.length; i++) {
				const filePath = path.resolve(process.cwd(), `./bin/modules/${files[i]}`);
				const content = fs.readFileSync(filePath, "utf8");
				const formatted = prettier.format(content, formatOptions);
				fs.writeFileSync(filePath, formatted);
			}
		}
	}
];

if (process.argv.slice(2)[0] === "watch") {
	for (let i = 0; i < builds.length; i++) {
		const { name, options, format } = builds[i];
		options.watch = {
			onRebuild(error) {
				if (error) return;
				format();
				console.log(`Built ${name}`);
			}
		};
	}
}

for (let i = 0; i < builds.length; i++) {
	const { name, options, format } = builds[i];
	build(options).then(() => {
		format();
		console.log(`Built ${name}`);
	});
}
