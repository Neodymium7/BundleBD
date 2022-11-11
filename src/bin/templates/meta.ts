import { Meta } from "bdapi";

export default function meta(code: string, meta: Meta) {
	return `/**\n${Object.keys(meta).reduce(
		(string, key) => (string += ` * @${key} ${meta[key]}\n`),
		""
	)} */\n\n${code}`;
}
