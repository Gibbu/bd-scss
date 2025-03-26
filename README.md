# bd-scss

Simple package to create themes for BetterDiscord using SCSS.

> I highly recommend using the CLI I built has it does all the instructions for you: [gibbu/create-bd-theme](https://github.com/Gibbu/create-bd-theme)

<br>

## Usage

Install the package with:

```bash
npm install bd-scss
# or
yarn add bd-scss
# or
pnpm add bd-scss
# or
bun add bd-scss
```

Then create a `bd-scss.config.js` file in the root of your project folder with the following:

```js
/** @type {import('bd-scss/lib/config').Config} */
export default {
	meta: {
		name: 'Cooltheme',
		author: 'Gibbu',
		version: '1.0.0',
		description: 'My cool theme',
		source: 'https://github.com/Gibbu/Cooltheme'
	}
};
```

And then use the `bd-scss` command followed by the script you wish to use.

```bash
bd-scss dev # will build to your BetterDiscord themes folder or if you've provided a path in the `betterdiscord.themeFolder` option.

bd-scss build # will build the necessary files to distribute your theme.
```

> **NOTE**: Make sure you have `"type": "module"` set in your `package.json`.

<br>

## Compiler API

| Property        | Type                 | Required | Description                                                                                                                                    |
| --------------- | -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `meta`          | Object               | true     | The BetterDiscord theme/plugin META. View all avaiable meta [HERE](https://github.com/BetterDiscord/BetterDiscord/wiki/Plugin-and-Theme-METAs) |
| `main`          | string               | false    | The entry point to the theme.                                                                                                                  |
| `root`          | string               | false    | the root file that contains all your public facing variables.                                                                                  |
| `github`        | string \| Object     | false    | The github profile to point to when building.                                                                                                  |
| `imports`       | (string \| Object)[] | false    | Any **external** imports that should be imported with the theme.                                                                               |
| `addons`        | (string \| Object)[] | false    | Any files that should be compiled with your theme.                                                                                             |
| `betterdiscord` | Object               | false    | Settings for the BetterDiscord client mod                                                                                                      |
| `vencord`       | Object               | false    | Settings for the Vencord client mod                                                                                                            |

<br>

## Examples

- [DiscordStyles/SoftX](https://github.com/DiscordStyles/SoftX)
- [DiscordStyles/Slate](https://github.com/DiscordStyles/Slate)

<br>

## License

See the [LICENSE](https://github.com/Gibbu/bd-scss/blob/main/LICENSE) file for license rights and limitations (MIT).
