import fs from "fs";
import Logger from "./logger";

function escape(string: string) {
	return string.replace(/[[\]{}()*+?.\\^$|]/g, "\\$&");
}

export const argv: { development: boolean; plugin?: string } = (() => {
	const argv = process.argv.slice(2);
	const options = argv.filter((arg) => arg.startsWith("-"));
	const development = options.includes("--development") || options.includes("-D");
	const plugin = argv.filter((arg) => !arg.startsWith("-"))[0]?.replace(/\s/g, "");
	return { plugin, development };
})();

export function parseString(
	string: string,
	options: Record<string, string>,
	delimeters?: { open: string; close: string }
) {
	if (!delimeters) delimeters = { open: "[", close: "]" };
	const { open, close } = delimeters;
	return Object.keys(options).reduce(
		(prev, key) => prev.replace(new RegExp(escape(open + key + close), "g"), options[key]),
		string
	);
}

export function ensureFileExists(path: string, message?: string) {
	if (!fs.existsSync(path)) {
		Logger.error(message ?? `Cannot find file '${path}'`);
	}
}

export function checkDirExists(path: string) {
	return fs.existsSync(path) && (fs.lstatSync(path).isDirectory() || fs.lstatSync(path).isSymbolicLink());
}

export function ensureDirExists(path: string, message?: string) {
	if (!checkDirExists(path)) {
		Logger.error(message ?? `Cannot find directory '${path}'`);
	}
}
