const { defineConfig } = require("../..");

module.exports = defineConfig({
	input: "src",
	output: "dist",
	importAliases: {
		"@lib/*": "./lib/*",
	},
});
