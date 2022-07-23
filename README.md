# BundleBD

A simple bundler for BetterDiscord plugins. Uses Webpack to bundle plugins composed of multiple files/modules. Allows for the use of Typescript, JSX, CSS and Sass files, and more.

## Contents

### [Getting Started](#getting-started-1)

-   [Installation](#installation)
-   [Basics](#basics)
-   [Using Typescript](#using-typescript)
-   [Using JSX](#using-jsx)
-   [The meta Object](#the-meta-object)
-   [Using BdApi](#using-bdapi)
-   [Using Stylesheets](#using-stylesheets)
-   [ZeresPluginLibrary Support](#zerespluginlibrary-support)
-   [Other File Types](#other-file-types)

### [Command Arguments](#command-arguments-1)

-   [Plugin Name](#plugin-name)
-   [Development Mode](#development-mode)
-   [npm Scripts](#npm-scripts)

### [Configuration](#configuration-1)

-   [Bundler Configuration](#bundler-configuration)
-   [Plugin Configuration](#plugin-configuration)
-   [Typescript Configuration](#typescript-configuration)

### [Built-in Modules](#built-in-modules-1)

-   [Settings](#settings)
-   [Strings](#strings)
-   [Styles](#styles)

### [FAQ](#faq-1)

1.  [What?! Another Discord plugin bundler/builder/transpiler?](#1-what-another-discord-plugin-bundlerbuildertranspiler-arent-there-a-few-of-those-already)
2.  [Why are typings/autocomplete not working?](#2-why-are-typingsautocomplete-not-working)
3.  [I have a feature/change suggestion or bug to report, what should I do?](#3-i-have-a-featurechange-suggestion-or-bug-to-report-what-should-i-do)
4.  [Why are there not any built in Discord Module references?](#4-why-are-there-not-any-built-in-discord-module-references)

# Getting Started

## Installation

To install BundleBD, simply create a new folder, open it in [VSCode](https://code.visualstudio.com/) or your preferred editor/terminal, and run:

```
npm i bundlebd -D
```

## Basics

First make sure you read the BetterDiscord Plugin Docs (Coming Soon) and know at least the basics of making plugins.

### Usage

By default, the bundler will look in the `src` directory for the plugin's files. Create a new `src` folder, and inside of it create an `index.js` file, exporting a simple BetterDiscord Plugin without the meta. For example:

```js
// src/index.js

export default class MyAmazingPlugin {
	start() {
		console.log("Plugin started");
	}

	stop() {
		console.log("Plugin stopped");
	}
}
```

Now you can run...

```
npx bundlebd
```

...in the terminal to bundle the plugin. The bundler will, by default, place the bundled plugin in the `dist` folder, creating it if necessary.

### Basic Configuration

Now that you have your bundled plugin, you might want to configure it beyond the defaults. The default name _'Plugin'_ does not sound very appealing or descriptive.

Luckily, customizing the plugin's name is easy. You can provide a name argument to the command like:

```
npx bundlebd MyAmazingPlugin
```

Now our plugin has a proper name! Unfortunately, its description, version, and other meta information are less than ideal.

Just like the name, configuring the other information is simple, but it requires a little bit more work.

To start, create a `config.json` file in the same folder as your plugin's main file. So in our example, the file would be in `src`. In this configuration file, you can specify more information about your plugin. For example, the contents of the file might look like:

```jsonc
// src/config.json

{
	"meta": {
		"name": "MyAmazingPlugin",
		"author": "Neodymium",
		"description": "A plugin that does absolutely nothing",
		"version": "1.0.0"
	}
}
```

Now when you bundle your plugin, the bundler will detect the configuration file and use its information instead of the defaults. For all configuration options, see [Plugin Configuration](#plugin-configuration).

### Multiple Files/Modules

Of course, the real appeal of using a bundler is the ability to bundle multiple modules into one plugin file. To use multiple files/modules, just use Javascript's [ES module syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). As an example, let's say there are two files in the `src` folder with the following contents:

```js
// src/index.js

import { helloWorld } from "./utils";

export default class MyAmazingPlugin {
	start() {
		helloWorld();
	}

	stop() {
		console.log("Plugin stopped");
	}
}
```

```js
// src/utils.js

export function helloWorld() {
	console.log("Hello world!");
}
```

Now, when the bundler sees that the plugin's main file imports from `utils.js`, it will bundle it into the plugin.

## Using [Typescript](https://www.typescriptlang.org/)

Using Typescript is very simple. Just include a Typescript file in your plugin, and the bundler will automatically transpile it for you. For example, the following will result in a plugin similar to the previous example, with no additional configuration:

```ts
// src/index.ts

import { hello } from "./utils";

export default class MyAmazingPlugin {
	start() {
		let message: string;
		message = hello("Neodymium");
		console.log(message);
	}

	stop() {
		console.log("Plugin stopped");
	}
}
```

```ts
// src/utils.ts

export function hello(name: string): string {
	return `Hello ${name}!`;
}
```

### Typings

To resolve issues with typings for BdApi, Zlibrary, and BundleBD's Built-in Modules, see [here](#2-why-are-typingsautocomplete-not-working).

## Using [JSX](https://reactjs.org/docs/introducing-jsx.html)

Just like Typescript, JSX is very easy to use. Just include some JSX elements in your code, and the bundler will automatically transpile them into `React.createElement` calls. For example:

```jsx
// src/index.jsx

export default class MyAmazingPlugin {
	start() {
		const element = <div className="class">Hello World!</div>;
		console.log(element);
	}

	stop() {
		console.log("Plugin stopped");
	}
}
```

### With Typescript

Using JSX alongside Typescript is still simple, but may result in some errors.

First, if you use JSX in Typescript, make sure the file has a `.tsx` extension. Not doing so will result in errors, and the plugin will not bundle successfully.

Additionally, you may get a warning along the lines of:

```
'React' refers to a UMD global, but the current file is a module. Consider adding an import instead.
```

You can safely ignore this warning, as the bundler will include a reference to Discord's React instance in the bundled plugin. However, there are two ways to get rid of it. The first is to include...

```js
import React from "react";
```

...at the top of your file. The second is to create a `tsconfig.json` file in the project's root directory with the following contents:

```json
{
	"compilerOptions": {
		"jsx": "react-jsx"
	}
}
```

See [Typescript Configuration](#typescript-configuration) for more recommended TSConfig options.

## The meta Object

Eventually, BetterDiscord will pass a plugin's meta into the plugin or its constructor for it to access its own metadata. Since this is not implemented yet, every plugin bundled with BundleBD can globally acces a `meta` object, allowing the plugin to access its own metadata. For all of the keys available on the `meta` object, see [here](#meta).

```jsonc
// src/config.json

{
	"meta": {
		"name": "MyAmazingPlugin",
		"author": "Neodymium",
		"description": "A plugin that does absolutely nothing",
		"version": "1.0.0"
	}
}
```

```js
// src/index.js

export default class MyAmazingPlugin {
	start() {
		console.log(meta.name); // "MyAmazingPlugin"
		console.log(meta.author); // "Neodymium"
		console.log(meta.description); // "A plugin that does absolutely nothing"
		console.log(meta.version); // "1.0.0"
	}

	stop() {}
}
```

The bundler includes typings/autocomplete for the meta object. If they are not being detected, see [here](#2-why-are-typingsautocomplete-not-working).

## Using BdApi

Utilizing BdApi is just as easy as it is in a normal BetterDiscord plugin, since BdApi is still globally available:

```js
// src/index.js

export default class MyAmazingPlugin {
	start() {
		const UserPopoutBody = BdApi.findModule((m) => m.default?.displayName === "UserPopoutBody");
		console.log(UserPopoutBody);
	}

	stop() {}
}
```

The bundler includes typings/autocomplete for BdApi. If they are not being detected, see [here](#2-why-are-typingsautocomplete-not-working).

## Using Stylesheets

**_(Currently BundleBD supports CSS, [SCSS](https://sass-lang.com/guide), and [Sass](https://sass-lang.com/guide), but more CSS extension languages may be added in the future)_**

As should be expected by this point, stylesheets are also easy to use, but their usage requires a few more steps. The first step is to simply import the stylesheet you want to use in your plugin. For example:

```js
// src/index.js

import "./index.css";

export default class MyAmazingPlugin {
	start() {
		console.log("Plugin started");
	}

	stop() {
		console.log("Plugin stopped");
	}
}
```

### Injecting Styles

The second step is to inject any imported stylesheets into the DOM when the plugin is started. When you import a stylesheet, it will be automatically loaded into the bundler's built-in [Styles](#styles) class, which is bundled with your plugin by default whenever you import a stylesheet. In order to inject the styles, you need to use `Styles.inject()`. Here's an example of injection in action:

```js
// src/index.js

// When the bundler sees a stylesheet is imported, it will automatically load it into the Styles class.
import "./index.css";
import Styles from "bundlebd/styles";

export default class MyAmazingPlugin {
	start() {
		// Then, when the plugin is started, you can use inject() to inject the styles into Discord.
		Styles.inject();
		console.log("Plugin started");
	}

	stop() {
		console.log("Plugin stopped");
	}
}
```

There's only one more step left, but it's crucial: cleanup. Just like you use `Styles.inject()` when your plugin starts, you need to use `Styles.clear()` when your plugin stops to remove all injected styles from Discord. Here's an example:

```js
// src/index.js

import "./index.css";
import Styles from "bundlebd/styles";

export default class MyAmazingPlugin {
	start() {
		Styles.inject();
		console.log("Plugin started");
	}

	stop() {
		// Always remember to clear the styles whenever you inject!
		Styles.clear();
		console.log("Plugin stopped");
	}
}
```

### Imports and URLs

Local @imports and URLs included in imported stylesheets will be bundled with the plugin. For more information on how imports and URLs are handled, see [here](https://github.com/webpack-contrib/css-loader#readme), and for information on how local files like images will be bundled, see [Other File Types](#other-file-types).

### What Are CSS Modules?

A great feature included with the bundler is the ability to use CSS modules. You might already be familiar with them, but if not, here's a quick scenario:

Let's say two plugins inject styles, and both include the same class. This will result in conflicts between the two plugins, and the styling might not work as intended. You could change all the class names in the plugins to be unique, or you could use CSS modules instead.

When importing CSS modules, the bundler will take the normal stylesheet with local class like this:

```css
/* A local class */
.class {
	color: red;
}
```

And turn it into something like this with global classes:

```css
/* A global class that will be used in the injected stylesheet */
.Plugin-index-class {
	color: red;
}
```

This makes conflicts much less likely. CSS modules have many more use cases and features, but they won't be covered here. For more info see [here](https://github.com/css-modules/css-modules).

### Using CSS Modules

Using CSS modules is very similar to using regular stylsheets:

The bundler will treat any files with the extention `.module.css`, `.module.scss`, `.module.sass`, etc. as CSS modules. Also, if you include a query string of `?module` to any normal stylesheet, it will be treated as a CSS module.

They are automatically loaded just like normal stylesheets, and injected and cleared in the same way. The one difference is that instead of using hardcoded strings as class names, the CSS module will export an object with the local class names as keys to get the global class names. Here's an example to make the whole process easier to see:

```css
/* src/index.module.css */

.redText {
	color: red;
}
```

```js
// src/index.jsx

import styleModule from "./index.module.css";
import Styles from "bundlebd/styles";

export default class MyAmazingPlugin {
	start() {
		Styles.inject();
		// Now the content of the element will be red!
		const element = <div className={styleModule.redText}>Hello World!</div>;
		console.log("Plugin started");
	}

	stop() {
		Styles.clear();
		console.log("Plugin stopped");
	}
}
```

**Or with the query string option (my personal preference):**

```css
/* src/index.css */

.redText {
	color: red;
}
```

```js
// src/index.jsx

import styleModule from "./index.css?module";
import Styles from "bundlebd/styles";

//... Rest of the Code ...
```

### Advanced Options

The bundler has more options for using stylesheets, but they will likely be used much less than basic stylesheet and CSS module usage.

If for whatever reason you don't want an imported stylesheet or CSS module to be automatically loaded for injection, or if you don't want the built-in [Styles](#styles) class to be bundled with your plugin, you can add `/* ignoreLoad */` to the top of the stylesheet or CSS module. Since it will not be loaded, calling `Styles.inject()` will not inject the stylesheet, and you'll need to do whatever you want to with it manually.

```css
/* ignoreLoad */

/* this stylesheet won't be loaded for injection automatically */
.class {
	color: red;
}
```

Whether loaded or not, a stylesheet will export a string containing the contents of the stylesheet with imports and urls resolved. A CSS module will also export a string of the module's contents (after being processed to its global form) that can be accessed using the `_content` property.

```css
/* src/index.css */

.class {
	color: red;
}
```

```js
// src/index.js

import stylesheet from "./index.css";
import styleModule from "./index.css?module";

export default class MyAmazingPlugin {
	start() {
		console.log(stylesheet); // will log '.class { color: red; }'
		console.log(styleModule._content); // will log '.MyAmazingPlugin-index-class { color: red; }'
	}

	stop() {
		console.log("Plugin stopped");
	}
}
```

Using both of these extra features, you can use your own implementation of injecting styles, or achieve more advanced behavior like injecting different stylesheets dynamically or at different times.

```js
// src/index.js

import stylesheet from "./index.css";
import otherStyleModule from "./styles.css?module";

export default class MyAmazingPlugin {
	start() {
		setTimeout(() => {
			this.styles = stylesheet;
			BdApi.injectCSS("MyAmazingPlugin", this.styles);
		}, 1000);

		setTimeout(() => {
			this.styles += otherStyleModule._content;
			BdApi.injectCSS("MyAmazingPlugin", this.styles);
		}, 3000);
	}

	stop() {
		BdApi.clearCSS("MyAmazingPlugin");
	}
}
```

### Built-in Styles Module

BundleBD includes a built-in Styles module that provides utilities for injecting and clearing styles. It is not required, but reccommended to use it, especially if imported styleheets are being automatically loaded by the Styles module. For more information, see [Styles](#styles).

## [ZeresPluginLibrary](https://github.com/rauenzi/BDPluginLibrary) Support

The bundler can easily bundle plugins that use Zlibrary. All you need to do is set [zlibrary](#zlibrary) to true in your plugin's `config.json` file:

```jsonc
// src/config.json

{
	"meta": {
		"name": "MyAmazingPlugin",
		"author": "Neodymium",
		"description": "A plugin that does absolutely nothing",
		"version": "1.0.0"
	},
	"zlibrary": true
}
```

### Usage

Using the library in your plugin itself is very simple as well, just import the library from `@zlibrary` and the base Plugin class from `@zlibrary/plugin` and use them as you would normally.

```js
// src/index.js

import Plugin from "@zlibrary/plugin";
import { DiscordModules } from "@zlibrary";

export default class MyAmazingPlugin extends Plugin {
	onStart() {
		const UserStore = DiscordModules.UserStore;
		console.log(UserStore.getCurrentUser());
	}

	onStop() {
		console.log("Plugin stopped");
	}
}
```

### Warnings

When bundling, BundleBD will warn you if you import the library without setting the config option to true, or if you use the library without extending your plugin from the base Plugin class, both of which will prevent your plugin from working properly.

### Typings

BundleBD includes typings/autocomplete for ZLibrary. If they are not being detected, see [here](#2-why-are-typingsautocomplete-not-working).

## Other File Types

### JSON Files

Using JSON files is pretty simple as well. Just import the file like normal, and you can access the object stored in it:

```jsonc
// src/strings.json

{
	"hello": "Hello World!",
	"goodbye": "Bye Bye!"
}
```

```js
//src/index.js

import strings from "./strings.json";

export default class MyAmazingPlugin {
	start() {
		console.log(strings.hello); // Will log 'Hello World!'
	}

	stop() {
		console.log(strings.goodbye); // Will log 'Bye Bye!'
	}
}
```

To make sure you have type validation and autocomplete for JSON files, see [here](#typescript-configuration), and confirm you have `resolveJsonModule` set to true.

### Text Files

Plain old text files are also supported, and can be imported as strings:

```jsonc
// src/message.txt

Hello World!
```

```js
//src/index.js

import message from "./message.txt";

export default class MyAmazingPlugin {
	start() {
		console.log(message); // Will log 'Hello World!'
	}

	stop() {}
}
```

### Images

PNG, JPG, and JPEG image are supported as well, and can be imported as Base64 encoded urls:

```js
//src/index.jsx

import image from "./image.png";

export default class MyAmazingPlugin {
	start() {
		const image = <img src={image} />;
	}

	stop() {}
}
```

This behavior also appies to CSS files:

```css
/* src/index.css */

.class {
	background-image: url(./image.png);
}
```

### SVGs

SVGs are treated a little differently than normal images. Importing an SVG in a Javascrript or Typescript file will, by default, give you a React Component to use with JSX:

```jsx
//src/index.jsx

import Icon from "./icon.svg";

export default class MyAmazingPlugin {
	start() {
		const svg = <Icon width="18" height="18" />;
	}

	stop() {}
}
```

If you instead want to import it as a Base64 string, you can use the `?url` resource query:

```js
//src/index.jsx

import url from "./icon.svg?url";

export default class MyAmazingPlugin {
	start() {
		const image = <img src={url} />;
	}

	stop() {}
}
```

In CSS files, SVGs will be treated the same as normal [images](#images).

# Command Arguments

The `bundlebd` command takes two possible arguments, but neither is required. The arguments can be given in any order.

## Plugin Name

The first argument is the name of the plugin you want to bundle. Its main purpose is to parse the strings given in the [Bundler Configuration's](#bundler-configuration) properties. However, if the [Plugin Configuration's](#plugin-configuration) meta does not contain a name property, the plugin name argument will be used instead. The Plugin Name should not contain any spaces. Defaults to `Plugin`.

### Usage

```
npx bundlebd MyAmazingPlugin
```

## Development Mode

The second argument is whether or not to enable Development Mode. Development Mode will be enabled if the command is passed the argument `--development` or `-D`. When Development Mode is enabled, the bundler will watch for changes and bundle the plugin when they occur, as well as copy the bundled plugin to BetterDiscord's plugins folder using the [Bundler Configuration's](#bundler-configuration) [bdPath](#bdpath) property. If you don't want the plugin to be copied to BetterDiscord's plugins folder, you can set [bdPath](#bdpath) to `none`.

### Usage

```
npx bundlebd --development
```

**OR**

```
npx bundlebd -D
```

### Usage With Plugin Name

```
npx bundlebd MyAmazingPlugin --development
```

**OR**

```
npx bundlebd --development MyAmazingPlugin
```

**_Note: --development can be replaced with -D in the above examples as well._**

## npm Scripts

If you don't want to type out the command every time, you can create scripts in your package.json file to run instead. For example you can add:

```jsonc
// package.json

{
    ... Rest of your package.json file ...

	"scripts": {
		"build": "bundlebd",
		"dev": "bundlebd --development"
	}
}
```

And now you can use `npm run build PluginName` and `npm run dev PluginName` instead.

If you only have one plugin you want to bundle, you can also include the Plugin Name in the script:

```jsonc
// package.json

{
    ... Rest of your package.json file ...

	"scripts": {
		"build": "bundlebd PluginName",
		"dev": "bundlebd --development PluginName"
	}
}
```

Now just run `npm run build` or `npm run dev` to bundle your plugin.

# Configuration

BundleBD includes many different options for configuration. Its behavior and options are configured in two different files: the [Bundler Configuration](#bundler-configuration) and the [Plugin Configuration](#plugin-configuration). Each configuration type has defaults, so neither type of file is required, but they are highly reccomended.

## Bundler Configuration

The Bundler Configuration configures the basic behavior of the bundler in a `bundlebd.config.json` file in the root directory.

### entry

A relative path to the entry folder for a plugin. This is the folder that contains a plugin's main file and [Plugin Configuration](#plugin-configuration) file. You can use `[plugin]` anywhere in the value to refer to a [Plugin Name](#plugin-name) argument passed to the command.

**Defaults to `src`.**

### output

A relative path to the folder that a bundled plugin will be placed into. You can use `[plugin]` anywhere in the value to refer to a [Plugin Name](#plugin-name) argument passed to the command.

**Defaults to `dist`.**

### filename

The name of a bundled plugin file. You can use `[plugin]` anywhere in the value to refer to a [Plugin Name](#plugin-name) argument passed to the command.

**Defaults to `[plugin].plugin.js`.**

### readme

Either a boolean or a relative path to the folder that a README.md file will be placed into. You can use `[plugin]` anywhere in the value to refer to a [Plugin Name](#plugin-name) argument passed to the command. If given a value of `true` and not a path, the README.md file will be placed in the same folder as the bundled plugin.

If true or a valid output path, the bundler will look for a README.md file in the plugin's entry folder, parse it with the plugin's meta using `{{` and `}}` as delimeters, and copy the result to the given path or output folder.

As an example, if the value of readme is `true`:

`src/README.md` (input):

```md
# {{name}}

{{description}}

by {{author}}

## Some other stuff here
```

`dist/README.md` (output):

```md
# MyAmazingPlugin

A plugin that does absolutely nothing

by Neodymium

## Some other stuff here
```

If the value of readme was a path such as `[plugin]/readme`, the output would be placed in `MyAmazingPlugin/readme/README.md` instead.

**Defaults to `false`.**

### bdPath

An absolute path to BetterDiscord's main folder. This is used to copy the bundled plugin to the plugins folder when [Development Mode](#development-mode) is enabled. If you want to disable copying the bundled plugin, set this value to `none`.

**By default, will warn the user that no bdPath is set.**

### Example

```jsonc
// bundlebd.config.json

{
	"entry": "[plugin]/src",
	"output": "[plugin]/dist",
	"filename": "[plugin].plugin.js",
	"readme": "[plugin]",
	"bdPath": "C:/Users/Neodymium/AppData/Roaming/BetterDiscord"
}
```

## Plugin Configuration

The Plugin Configuration configures the plugin-specific information and options in a `config.json` file in your plugin's entry folder.

### meta

The plugin's metadata that will be used to generate the plugin's meta. See [here](https://github.com/BetterDiscord/BetterDiscord/wiki/Plugin-and-Theme-METAs#fields) for more information on each possible property.

**Defaults to:**

```jsonc
{
	"name": "Plugin", // Or the command's Plugin Name argument if passed
	"author": "Unknown",
	"description": "Plugin bundled with BundleBD",
	"version": "1.0.0"
}
```

#### What's the difference between the meta's name property and the [Plugin Name](#plugin-name) argument?

Usually, the meta's name is for resolving the name of the plugin inside of the plugin itself, and the Plugin Name argument is for resolving file names and paths in the Bundler Configuration.

### changelog

A ZLibrary style changelog array. See the [Docs](https://rauenzi.github.io/BDPluginLibrary/docs/tutorial-getting-started.html#skeleton-configjson) for more information on the specific options.

**Excluded by default.**

**_Note: Changelogs are only currently suported on plugins using ZLibrary._**

### entry

The relative path from the plugin's [entry folder](#entry) to the main file of the plugin.

**_Defaults to `index`._**

### zlibrary

A boolean that determines whether or not to bundle the plugin with [ZeresPluginLibrary support](#zerespluginlibrary-support).

**_Defaults to `false`._**

### Example

```jsonc
// MyAmazingPlugin/src/config.json (Using the entry folder from the Bundle Configuration example)

{
	"meta": {
		"name": "MyAmazingPlugin",
		"author": "Neodymium",
		"description": "A plugin that does absolutely nothing",
		"version": "1.0.0"
	},
	"changelog": [
		{ "title": "Added", "items": ["Added stuff"] },
		{ "title": "Fixed", "type": "fixed", "items": ["Fixed a bug", "Fixed another bug"] }
	],
	"entry": "main.js",
	"zlibrary": true
}
```

## Typescript Configuration

While by no means required, configuring Typescript can solve issues with Typescript not resolving typings, and can make development easier, even when not using Typescript. Thus, it is recommended. To configure Typescript, just add a `tsconfig.json` file in your root folder. Here's an example of a simple TSConfig with some recommended settings for using the bundler:

```jsonc
// tsconfig.json

{
	"compilerOptions": {
		"types": ["node", "bundlebd"],
		"resolveJsonModule": true,
		"allowSyntheticDefaultImports": true,
		"jsx": "react-jsx"
	}
}
```

For more information on TSConfig files, their options, and what each one does, see the [TSConfig Reference](https://www.typescriptlang.org/tsconfig).

# Built-in Modules

The BundleBD package includes some built in modules for commonly needed functionality like styles, settings, etc. **None of the modules are required or bundled with plugins by default** (except for [Styles](#styles), which is needed when the bundler automatically loads styles. If you don't want styles to be automatically loaded and the Styles module bundled, see [here](#advanced-options)). The modules can be imported and bundled just like any other file.

## Settings

**Simple utilities for managing and using a plugin's settings.**

```js
import Settings from "bundlebd/settings";
```

### `Settings.setDefaults()`

Sets the default settings. Should be run on plugin start if desired. Takes an object of default settings as a parameter.

```ts
static setDefaults(settings: Record<string, any>): void
```

### `Settings.get()`

Gets the value of a setting, or a value set by [Settings.setDefaults](#settingssetdefaults) if the setting does not exist. Takes as parameters the key of the setting, and optionally a default value, which will override a default value set by [Settings.setDefaults](#settingssetdefaults) (Useful if setDefaults is never used). Returns the value of the setting.

```ts
static get(key: string, defaultValue?: any): any
```

### `Settings.set()`

Sets and saves the value of a setting. Takes the key of the setting and the new value as parameters.

```ts
static set(key: string, value: any): void
```

### `Settings.addListener()`

Adds a listener that runs when a setting is changed. Takes a callback function with optional key and value arguments (for the key of the changed setting and its new value) to run when a setting is changed. Returns a function to remove the listener.

```ts
static addListener(callback: (key?: string, value?: any) => void): () => void
```

### `Settings.clearListeners()`

Removes all listeners. Used for cleanup from [Settings.addListener](#settingsaddlistener). Should be run at plugin stop if any listeners were added and not removed.

```ts
static clearListeners(): void
```

### `Settings.useSettingState()`

A [React hook](https://reactjs.org/docs/hooks-intro.html) that gets a setting as a stateful variable. Takes the same parameters as [Settings.get](#settingsget).

```ts
static useSettingState(key: string, defaultValue?: any): any
```

### Example

An example of the Settings module in action.

```js
import Settings from "bundlebd/settings";

export default class Plugin {
	start() {
		// Sets the default settings.
		Settings.setDefaults({ color: "red", checked: true });

		// Gets the value of the 'color' setting. Since no value is saved, returns the default of 'red'.
		const red = Settings.get("color");

		// Gets the value of the 'color' setting. Since no value is saved, and a defaultValue parameter is passed, returns 'blue'.
		const blue = Settings.get("color", "blue");

		// Sets the value of the 'color' setting to 'green' and saves it to the plugin's config file.
		Settings.set("color", "green");

		// Gets the value of the 'color' setting. Since a value is saved, returns 'green'.
		// Since a value is now saved to the plugin's config file, even when the plugin is restarted, each variable will be set to saved value of 'green'.
		const green = Settings.get("color");

		// Will log when any setting is changed and what its new value is.
		const remove = Settings.addListener((key, value) => {
			console.log(`${key} changed to ${value}!`);
		});

		// This would the previously added listener.
		// remove();
	}

	stop() {
		// Removes all listeners. Always be sure to remove listeners when the plugin is stopped if you've added any.
		Settings.clearListeners();
	}
}
```

### `Settings.useSettingState` Example

```jsx
export default function MyComponent(props) {
	// Now whenever the value of the 'color' setting changes, the component will be updated.
	const color = Settings.useSettingState("color", "red");

	return <div style={{ color }}>This text is colored!</div>;
}
```

## Strings

**Utilities for handling localization and strings.**

```js
import Strings from "bundlebd/strings";
```

### `Strings.setDefaultLocale()`

Sets the locale used as the fallback when strings for Discord's selected locale are not defined (defaults to `en-US` when setDefaultLocale is not used). Takes a code for one of Discord's supported locales as a parameter.

```ts
static setDefaultLocale(locale: string): void
```

### `Strings.initialize()`

Initializes [Strings](#strings) with the given locales object. Should be run on plugin start. Takes as a parameter an object containing an object of strings for each locale.

```ts
static initialize(locales: { [locale: string]: Record<string, string> }): void
```

### `Strings.get()`

Gets a string from Discord's selected locale (or default locale set by [Strings.setDefaultLocale](#stringssetdefaultlocale) if the string is not defined). Takes as a parameter the key of the desired string and returns the string.

```ts
static get(key: string): string
```

### `Strings.unsubscribe()`

Unsubscribes from Discord's locale changes. Used to clean up from [Strings.initialize](#stringsinitialize). Should be run on plugin stop.

```ts
static unsubscribe(): void
```

### Example

An example of the Strings module in action.

```js
import Strings from "bundlebd/strings";

const locales = {
	"en-US": {
		HELLO: "Hello",
		HELLO_WORLD: "Hello world!"
	},
	de: {
		HELLO: "Hallo"
	}
};

export default class Plugin {
	start() {
		// Sets the default locale to 'en-US'. It already is by default, but this is just to demonstrate usage of the method.
		Strings.setDefaultLocale("en-US");

		// Initializes Strings with the locales object.
		Strings.initialize(locales);

		// Gets the string at key 'HELLO' for Discord's selected locale (Let's say its English for now). So it will return 'Hello'.
		let hello = Strings.get("HELLO");

		// Now let's say the user changes their locale to German...

		// It will return 'Hallo' since the string is defined for the selected locale.
		hello = Strings.get("HELLO");

		// Since there is no string for the key 'HELLO_WORLD' for German, it will return the string for the key 'HELLO_WORLD' for the default locale, or in this case, English. So it will return 'Hello world!'.
		hello = Strings.get("HELLO_WORLD");
	}

	stop() {
		// Unsubscribes from locale changes for cleanup.
		Strings.unsubscribe();
	}
}
```

If you want, you can also import the locales object from a JSON file:

```jsonc
// src/locales.json

{
	"en-US": {
		"HELLO": "Hello",
		"HELLO_WORLD": "Hello world!"
	},
	"de": {
		"HELLO": "Hallo"
	}
}
```

```js
// src/index.js

import Strings from "bundlebd/strings";
import locales from "./locales.json";

export default class Plugin {
	start() {
		Strings.initialize(locales);
	}

	stop() {
		Strings.unsubscribe();
	}
}
```

## Styles

**Utilities for managing and injecting styles. Will be included by default in any plugin that automatically loads a stylesheet.**

```js
import Styles from "bundlebd/styles";
```

### `Styles.inject()`

Injects styles from all imported stylesheets. Should be run on plugin start.

```ts
static inject(): void
```

### `Styles.add()`

Adds and injects a string of CSS. Useful for adding styles dynamically or styles not included in imported stylesheets. Should be run after [Styles.inject](#stylesinject). Takes a string of CSS to add.

```ts
static add(css: string): void
```

### `Styles.remove()`

Removes a string of CSS that was added with [Styles.add](#stylesadd). Takes as a parameter the string of CSS to remove.

```ts
static remove(css: string): void
```

### `Styles.clear()`

Clears all CSS and stylesheets that were previously injected. Should be run on plugin stop.

```ts
static clear(): void
```

### Example

An example of the Styles module in action.

```js
import "./index.css";
import Styles from "bundlebd/styles";

export default class Plugin {
	start() {
		// Injects all automatically loaded stylesheets (any imported stylesheets without an 'ignoreLoad' comment).
		// In this case will inject the contents of 'index.css' (as long as it does not have 'ignoreLoad').
		Styles.inject();

		// Adds the given string along with previously injected CSS (the imported stylesheets).
		Styles.add(".blue { color: blue; }");

		const css = "div { color: red; }";

		// Adds the css string along with previously injected CSS.
		// If we kept adding different strings, all of them would be added on to the injected styles.
		Styles.add(css);

		// Removes the 'css' string that was previously added (but keeps everythig else).
		Styles.remove(css);

		// Now that we removed the 'css' string, the only styles currently injected are the contents of 'index.css' and '.blue { color: blue; }'.
	}

	stop() {
		// Clears all injected styles.
		Styles.clear();
	}
}
```

# FAQ

## 1. What?! Another Discord plugin bundler/builder/transpiler? Aren't there a few of those already?

### Well, there's a few reasons I decided to make a new one...

First, none of the others really worked perfectly and exactly the way I wanted them to, and most were lacking guides or documentation. This is definitely something I could deal with though, which leads me to my second, and main reason for making this bundler.

I was just kind of bored and wanted something useful to make ¯\\\_(ツ)\_/¯. I was working on some kind of Webpack configuration for my own plugin development, so I decided to put the work into making it a hopefully easy to use public package. Even if BundleBD isn't the most feature-rich or well optimized Discord plugin bundler on the market, the experience from making a real package (for the first time for me) and utilizing some of the skills I've learned in the past was definitely worth all the effort. And maybe over time it will be able to grow into something better.

## 2. Why are typings/autocomplete not working?

Due to how VS Code and Typescript look for type declarations by default, BundleBD's types may not be automatically detected and used for autocomplete. There are a few solutions to this though.

### Solution 1: Including a reference directive

This one is pretty self explanatory. Adding a reference directive to the top of your file will allow Typescript to detect the bundler's types, like so:

```ts
/// <reference types="bundlebd" />

export default class Plugin {
	start() {
		console.log("No more type issues!");
	}

	stop() {}
}
```

### Solution 2: Importing one of the built-in modules

Just like including a reference directive, you can import one of the bundler's [built-in modules](#built-in-modules-1), and Typescript will detect the bundler's types. **Don't do this if you're not actually using the imported module.**

```ts
import Styles from "bundlebd/styles";
import "./index.css";

export default class Plugin {
	start() {
		Styles.inject();
		console.log("No more type issues!");
	}

	stop() {
		Styles.clear();
	}
}
```

### Solution 3: TSConfig (Recommended)

Using a TSConfig file requires a little extra work, but should automatically detect the bundler's types in _every_ file. Simply make a `tsconfig.json` file in your root folder with the following contents:

```jsonc
// tsconfig.json

{
	"compilerOptions": {
		"types": ["node", "bundlebd"]
	}
}
```

Or, if you're already using a TSConfig file, you can add the types property to it.

For more information on recommended Typescript configuration, see [here](#typescript-configuration).

## 3. I have a feature/change suggestion or bug to report, what should I do?

Just make an issue on [Github](https://github.com/Neodymium7/BundleBD/issues), and I'll be sure to take a look at it and be happy to solve any problems or consider any requests. Make sure your issue thoroughly and clearly describes the bug or feature, and include any other info like examples, images, etc. that might be helpful.

## 4. Why are there not any built-in Discord Module references?

I didn't really think it was all that necessary. When you're making a smaller plugin, chances are you just want to find and use the modules you need yourself. When you're making a larger, more complex plugin, you'd probably be using ZLibrary and its built-in DiscordModules. If there becomes a need for it or if I get a lot of requests for it (like that many people will really be using this bundler lmao), I'll definitely put in the effort to add some.
