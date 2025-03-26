import { readFileSync } from "fs";

export const start = "start";

export const stop = "stop";

export const func = () => {
	readFileSync("./file");
};
