export default function meta(code: string, meta: BetterDiscord.Addon) {
	return `/**\n${Object.keys(meta).reduce(
		(string, key) => (string += ` * @${key} ${meta[key as keyof BetterDiscord.Addon]}\n`),
		""
	)} */\n\n${code}`;
}
