import fs from "fs";
import Logger from "./logger";

export function ensureFileExists(path: string, message?: string, resolveExtensions?: string[]) {
	if (resolveExtensions) {
		let resolved = false;
		for (const extension of resolveExtensions) {
			if (fs.existsSync(path + extension)) resolved = true;
		}
		if (!resolved) Logger.error(message ?? `Cannot find file '${path}'`);
	} else if (!fs.existsSync(path)) {
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

export function stringify(object: unknown, indent: string): string {
	return JSON.stringify(object, null, indent).replace(/"([^"]+)":/g, "$1:");
}
