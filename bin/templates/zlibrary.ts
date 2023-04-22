import { Meta } from "bdapi";
import { stringify } from "../utils";
import { ZLibraryConfig } from "../config/plugin";

export default function zlibrary(code: string, meta: Meta, zlibraryConfig: boolean | ZLibraryConfig, indent: string) {
	const defaultInfo = {
		name: meta.name,
		authors: [
			{
				name: meta.author,
			},
		],
		version: meta.version,
		description: meta.description,
		github: meta.source,
	};

	if (typeof zlibraryConfig === "boolean") {
		zlibraryConfig = {
			info: defaultInfo,
		};
	} else {
		zlibraryConfig.info = { ...defaultInfo, ...zlibraryConfig.info };
	}

	const { info, changelog, defaultConfig, ...others } = zlibraryConfig;

	return `const config = ${stringify({ info, changelog, defaultConfig, ...others })};

${`if (!global.ZeresPluginLibrary) {
    BdApi.UI.showConfirmationModal("Library Missing", \`The library plugin needed for \${config.info.name} is missing. Please click Download Now to install it.\`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
            });
        }
    });
}`.replace(/ {4}/g, indent)}

function buildPlugin([BasePlugin, Library]) {
${indent}${code.replace(/\n/g, `\n${indent}`)}

${indent}return Plugin;
}

module.exports = global.ZeresPluginLibrary ? buildPlugin(global.ZeresPluginLibrary.buildPlugin(config)) : class { start() {}; stop() {} };`;
}
