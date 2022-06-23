# bd-scss

Simple package to create themes for BetterDiscord using SCSS.

<br>

## Usage

Install the package with:

```bash
npm install bd-scss
# or
yarn add bd-scss
# or
pnpm add bd-scss
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
		source: 'https://github.com/Gibbu/Cooltheme',
	},
};
```

And then use the `bd-scss` command followed by the script you wish to use.

```bash
bd-scss dev # will build to your BetterDiscord themes folder or if you've provided a path in the dev option.

bd-scss build # will build the necessary files to distribute your theme.
```

> **NOTE**: Make sure you have `"type": "module"` set in your `package.json`.

<br>

## Compiler API

| Property     | Type                         | Required | Description                                                                                                                                    |
| ------------ | ---------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `meta`       | Object                       | true     | The BetterDiscord theme/plugin META. View all avaiable meta [HERE](https://github.com/BetterDiscord/BetterDiscord/wiki/Plugin-and-Theme-METAs) |
| `dev`        | (string \| [string, string]) | false    | The target path of the dev file.                                                                                                               |
| `dist`       | (string \| [string, string]) | false    | The output path of the dist file, relative to the current working directory.                                                                   |
| `base`       | (string \| [string, string]) | false    | The output path of the base file, relative to the current working directory.                                                                   |
| `fileName`   | string                       | false    | The name of the file to be compiled. This will default to your `meta.name` if this option is not provided.                                     |
| `addons`     | ([string, string])[]         | false    | Any addons that should be compiled separately from your theme files.                                                                           |
| `baseImport` | string                       | false    | The `@import` url used in the .theme.css file.                                                                                                 |

Providing a string with the `dist` and `base` options will change the **OUTPUT** path.  
While providing a string with the `dev` option will change the **TARGET** file.

You can overwrite all with an array. The 1st index being the target file and the 2nd being the output path.  
However the `dev` output is an absolute path. So you must provide the full path.

> Example: `C:\Users\Gibbu\AppData\Roaming\BetterDiscord\themes`

<br>

## Examples

- [DiscordStyles/SoftX](https://github.com/DiscordStyles/SoftX)
- [DiscordStyles/Slate](https://github.com/DiscordStyles/Slate)

<br>

## License

See the [LICENSE](https://github.com/Gibbu/bd-scss/blob/main/LICENSE) file for license rights and limitations (MIT).
