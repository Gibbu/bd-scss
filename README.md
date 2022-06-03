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

Create a `bd-scss.config.json` file in the root of your project folder with the following:
```json
{
	"meta": {
		"name": "Cooltheme",
		"author": "Me",
		"version": "1.0.0",
		"description": "The best theme there is",
		"source": "https://github.com"
	},
	"compiler": {
		"prefix": true
	},
	"dev": [
		{
			"target": ["src", "main.scss"],
			"output": "Theme.theme.css"
		}
	],
	"build": [
		{
			"target": ["src", "main.scss"],
			"output": ["dist", "Theme.theme.css"]
		}
	]
}
```

And then use the `bd-scss` command followed by the script you wish to use.
```bash
bd-scss dev # will run the dev script and build the bd-scss.config.json dev object.

bd-scss build # will run the build script and build the bd-scss.config.json build object.
```
> the `dev` script can take a `--bdFolder` option to change the location of the BetterDiscord folder is located.

<br>

### API
| Property | Type | Description |
| --- | --- | --- |
| `meta` | Object | The BetterDiscord theme/plugin META. View all avaiable meta [HERE](https://github.com/BetterDiscord/BetterDiscord/wiki/Plugin-and-Theme-METAs) |
| `compiler.prefix` | boolean | Run the CSS through the PostCSS autoprefixer. |
| `dev.target` | string[] | The target of the dev script to watch and autocompile.<br>*Note: the last index **MUST** end in a file extension.* |
| `dev.output` | string | The file SCSS will compile to your BetterDiscord themes folder. |
| `build.target` | string[] | The path and file the build script will compile from. <br>*Note: the last index **MUST** end in a file extension.* |
| `build.output` | string[] | The location of the compiled CSS, relative to the project directory. <br>*Note: The compiler will auto create directories if not found.*

<br>

## Examples

- [DiscordStyles/SoftX](https://github.com/DiscordStyles/SoftX)
- [DiscordStyles/Slate](https://github.com/DiscordStyles/Slate)

<br>

## License

See the [LICENSE](https://github.com/Gibbu/bd-scss/blob/main/LICENSE) file for license rights and limitations (MIT).