module.exports = function style(content) {
	const isModule = content.includes("___CSS_LOADER_EXPORT___.locals");
	const ignoreLoad = content
		.replace(/(\\n|\s)/g, "")
		.includes('___CSS_LOADER_EXPORT___.push([module.id,"/*ignoreLoad*/');
	if (ignoreLoad) {
		content = content.replace(
			/___CSS_LOADER_EXPORT___\.push\(\[module\.id, "(\\n|\s)*\/\* *ignoreLoad *\*\/(\\n|\s)*/,
			'___CSS_LOADER_EXPORT___.push([module.id, "'
		);
	}
	const exportString = isModule
		? "export default Object.assign(___CSS_LOADER_EXPORT___.locals, { _content: ___CSS_LOADER_EXPORT___.toString() });"
		: "export default ___CSS_LOADER_EXPORT___.toString();";
	return ignoreLoad
		? content.replace("export default ___CSS_LOADER_EXPORT___;", exportString)
		: `import { Styles } from "bundlebd";\n ${content.replace(
				"export default ___CSS_LOADER_EXPORT___;",
				"Styles._load(___CSS_LOADER_EXPORT___.toString());" + exportString
		  )}`;
};
