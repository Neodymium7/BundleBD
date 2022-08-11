const path = require("path");

module.exports = function style(content) {
	const isModule = content.includes("___CSS_LOADER_EXPORT___.locals");
	const exportString = isModule
		? "export default { ...___CSS_LOADER_EXPORT___.locals, _content: ___CSS_LOADER_EXPORT___.toString() };"
		: "export default ___CSS_LOADER_EXPORT___.toString();";
	return `import { load } from "styles";\n ${content.replace(
		"export default ___CSS_LOADER_EXPORT___;",
		`load("${path.basename(this.resourcePath)}", ___CSS_LOADER_EXPORT___.toString());` + exportString
	)}`;
};
