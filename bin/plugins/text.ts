interface TextOptions {
	regex: RegExp;
}

export default function text(options: TextOptions = { regex: /\.txt$/ }) {
	return {
		name: "text",
		transform(code: string, id: string) {
			if (options.regex.test(id)) return `export default ${JSON.stringify(code)};`;
		}
	};
}
