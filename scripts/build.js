/* eslint-disable @typescript-eslint/no-var-requires */
const { build } = require("esbuild");
const { dependencies } = require("../package.json");

const buildOptions = {
	entryPoints: ["bin/index.ts"],
	outfile: "bin.js",
	bundle: true,
	external: [...Object.keys(dependencies)],
	platform: "node",
	banner: { js: "#!/usr/bin/env node\n" },
};

if (process.argv.slice(2)[0] === "watch") {
	buildOptions.watch = {
		onRebuild(error) {
			if (error) return;
			console.log(`Built ${buildOptions.outfile}`);
		},
	};
}

build(buildOptions).then(() => {
	console.log(`Built ${buildOptions.outfile}`);
});
