# v3.4.0

## Library

-   Added overload to `expectModule` for passing a single settings object.
-   Added `getStore` method (`store` is now deprecated).
-   Added `getClasses` and `getSelectors` methods to `WebpackUtils`.

# v3.3.0

## Library

-   Added new `Logger` class for error, warning, and message logging.
-   Added `expectModule` function to `WebpackUtils` for handling errors when a module is not found.

# v3.2.1

## Library

-   Fixed boolean settings being set to `true` or `false` types instead of `boolean`.

# v3.2.0

## Bundler

-   Added `requireConfig` option, which, when true, does not use default meta options and instead requires that a `plugin.json` file is present.
-   Added `importAliases` option to the config file, which allows for defining import aliases that are replaced when bundling.

## Library

-   Added `addStyles` and `removeStyles` functions to the `styles` module. Both are simply shortcuts for adding the styles (`DOM.addStyle(styles())`) and removing them (`DOM.removeStyle()`).
-   Fixed crashing when falling back to the default locale in `createStrings`.

# v3.1.0

## Bundler

-   Added argument to bundler configuration function for `dev` option status.
-   Should no longer stop watching for changes on errors.

# v3.0.0

**BundleBD v3.0.0 has been basically rewritten, so many things will have changed that may not be included in the changelog. Check the [Wiki](https://github.com/Neodymium7/BundleBD/wiki) for more detailed, up to date documentation.**

## Bundler

### Command and Configuration

-   Options can now be supplied in the command arguments in a typical `--option value` format.
-   The Bundler Configuration file is now a `bundlebd.config.js` file in the root of the project that exports an object or function with additional options.
-   The `devOutput` and `readmeOutput` options have been removed, and the `entry` option has been renamed to `input`.

### Plugin Configuration

-   The Plugin Configuration file is now a `plugin.json` file in the plugin's root directory.
-   The `meta` option has been removed in favor of placing meta options in the main JSON object.
-   The `changelog` and `readme` options have been removed.
-   The `zlibrary` option can now take a ZeresPluginLibrary config object with changelog, default settings, etc.
-   Added `installScript` option to add a script in the bundled plugin that will install it for the user if run directly.

### General

-   Switched to Rollup instead of Webpack for cleaner output.
-   As a result, more CSS Preprocessors are supported, and some more new options have been added. Some things may behave slightly differently.
-   The bundler will now automatically create a bound instance of BdApi.
-   Now uses [Zerthox's BdApi types](https://github.com/Zerthox/betterdiscord-types) instead of the old (mediocre) ones.

## Library

### Updated

-   Removed `SettingsManager` and `StringsManager` in favor of the new `createSettings` and `createStrings` functions.

-   New `createSettings` and `createStrings` functions behave similarly to previous iterations, but now have improved typings, and place the settings/strings properties directly on the returned object instead of through `get` and `set` methods.

-   Removed previously deprecated `useSettingState` method from Settings object.

### Added

-   New `WebpackUtils` object with some helpful filters and utilities for finding Discord's internal modules. See the documentation for more information on each specific item.

# v2.1.3

## Bundler

-   Fixed inconsistent JSX processing.

# v2.1.2

## Library

-   Fixed after Discord's recent update.

# v2.1.1

## Library

### StringsManager

-   Fixed locale changes not working properly.

# v2.1.0

## General

-   Fixed some minor issues with ZLibrary typings.

## Library

### SettingsManager

-   Added `keys` property to `SettingsManager` to access the settings keys for typings, etc.
-   Added `useSettingsState` method which replaces `useSettingState`: now returns the entire settings object as a stateful value and requires no parameters (The old `useSettingState` is still usable, but marked as deprecated).
-   Fixed some issues with how settings are saved and handled.

### StringsManager

-   Added a proper `subscribe` method to `StringsManager` that should be run on plugin start.
