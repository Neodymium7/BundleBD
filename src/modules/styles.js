let _styles = "";

export function load(path, css) {
	_styles += `/* ${path} */\n${css}\n`;
}

export default function styles() {
	return _styles;
}
