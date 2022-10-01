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
