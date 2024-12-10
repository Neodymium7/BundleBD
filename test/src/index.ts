import { createElement } from "react";
import { DOM, Webpack, Meta } from "betterdiscord";
import { start, stop } from "./utils";
import { Component } from "./component";
import css from "./styles/styles.css";
import scss from "./styles/styles.scss";
import less from "./styles/styles.less";
import stylus from "./styles/styles.styl";
import module, { css as moduleCss } from "./styles/styles.module.css";
import strings from "./strings.json";
import text from "./text.txt";
import { doSomething } from "@lib";
import { doThings } from "@lib/utils";

export default class TestPlugin {
	meta: Meta;

	constructor(meta: Meta) {
		this.meta = meta;
	}

	start() {
		console.log(start, strings["hello-world"], text);
		doThings();
		doSomething();
		console.log(this.meta.name);

		const Module = Webpack.getModule((m) => m);
		console.log("Wow this is a pretty cool module: ", Module);

		BdApi.UI.showToast("Hello World!");

		DOM.addStyle(css + scss + less + stylus + moduleCss);
		console.log(module.class);
	}

	stop() {
		console.log(stop, strings.goodbye);

		DOM.removeStyle();
	}

	getSettingsPanel() {
		return createElement(Component);
	}
}
