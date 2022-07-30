const fs = require("fs");
const path = require("path");
const { build } = require("esbuild");
const prettier = require("prettier");
const { dependencies } = require("../package.json");

const main = {
	entryPoints: ["src/index.ts"],
	outfile: "bin/index.js",
	bundle: true,
	external: [...Object.keys(dependencies), "terser-webpack-plugin"],
	platform: "node",
	banner: { js: "#!/usr/bin/env node\n" }
};

const loaders = {
	entryPoints: fs.readdirSync("./src/loaders").map((file) => `./src/loaders/${file}`),
	outdir: "bin/loaders"
};

const formatOptions = {
	printWidth: 200,
	tabWidth: 4,
	useTabs: true,
	trailingComma: "none",
	endOfLine: "lf",
	parser: "babel"
};

function formatMain() {
	const filePath = path.resolve(process.cwd(), main.outfile);
	const content = fs.readFileSync(filePath, "utf8");
	const formatted = prettier.format(content, formatOptions);
	fs.writeFileSync(filePath, formatted);
}

function formatLoaders() {
	const files = fs.readdirSync("./src/loaders");
	for (let i = 0; i < files.length; i++) {
		const filePath = path.resolve(process.cwd(), `./bin/loaders/${files[i]}`);
		const content = fs.readFileSync(filePath, "utf8");
		const formatted = prettier.format(content, formatOptions);
		fs.writeFileSync(filePath, formatted);
	}
}

if (process.argv.slice(2)[0] === "watch") {
	main.watch = {
		onRebuild(error) {
			if (error) return;
			formatMain();
			console.log("Built main");
		}
	};
	loaders.watch = {
		onRebuild(error) {
			if (error) return;
			formatLoaders();
			console.log("Built loaders");
		}
	};
}

build(main).then(() => {
	formatMain();
	console.log("Built main");
});
build(loaders).then(() => {
	formatLoaders();
	console.log("Built loaders");
});
