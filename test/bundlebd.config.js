const { defineConfig } = require("..");
const path = require("path");

module.exports = defineConfig({
	input: "src",
	output: "dist",
	importAliases: {
		"@lib/*": "lib/*",
	},
	format: {
		indent: "  ",
	},
	generateCSSModuleScopedName: (plugin, name, file) => {
		return plugin + "__" + path.basename(file).split(".")[0] + "--" + name;
	},
});
