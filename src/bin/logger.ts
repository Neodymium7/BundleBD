export default class Logger {
	private static _log(tag: string, message: string, color = 15) {
		console.log(`\u001b[1;${color}m[${new Date().toLocaleTimeString()}] [${tag}] ${message}\u001b[0m`);
	}

	static log(message: string) {
		this._log("INFO", message);
	}

	static warn(message: string) {
		this._log("WARN", message, 33);
	}

	static error(message: string, fatal = true) {
		this._log("ERROR", message, 31);
		if (fatal) {
			process.exit(1);
		}
	}
}
