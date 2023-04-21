/* eslint-disable @typescript-eslint/no-var-requires */
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
	parser: "babel",
};

const buildOptions = {
	entryPoints: ["bin/index.ts"],
	outfile: "bin.js",
	bundle: true,
	external: [...Object.keys(dependencies)],
	platform: "node",
	banner: { js: "#!/usr/bin/env node\n" },
};

const format = (file) => {
	const filePath = path.resolve(process.cwd(), file);
	const content = fs.readFileSync(filePath, "utf8");
	const formatted = prettier.format(content, formatOptions);
	fs.writeFileSync(filePath, formatted);
};

if (process.argv.slice(2)[0] === "watch") {
	buildOptions.watch = {
		onRebuild(error) {
			if (error) return;
			format(buildOptions.outfile);
			console.log(`Built ${buildOptions.outfile}`);
		},
	};
}

build(buildOptions).then(() => {
	format(buildOptions.outfile);
	console.log(`Built ${buildOptions.outfile}`);
});
