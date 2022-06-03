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

Then create a `bd-scss.config.json` file in the root of your project folder with the following:
```json
{
	"meta": {
		"name": "Cooltheme",
		"author": "Gibbu",
		"version": "1.0.0",
		"description": "My cool theme",
		"source": "https://github.com/Gibbu/Cooltheme"
	},
	"compiler": {
		"prefix": true
	},
	"dist": {
		"target": ["src", "dist.css"],
		"output": ["dist", "Cooltheme.theme.css"]
	},
	"dev": {
		"target": ["src", "dev.scss"],
		"output": ["Cooltheme.theme.css"]
	},
	"base": {
		"target": ["src", "base.scss"],
		"output": ["dist", "Cooltheme.css"]
	},
	"addons": []
}
```

And then use the `bd-scss` command followed by the script you wish to use.
```bash
bd-scss dev # will target the `dev` object.

bd-scss build # will run both `dist` and `base` objects. You shouldn't manually run this command. GitHub actions will.
```
> the `dev` script can take a `--bdFolder` option to change the location of the BetterDiscord folder is located.

<br>

### Compiler API
These properties are available on `dist`, `dev`, `base` objects and the `addons` object array.  
**NOTE:** The last index of the array **MUST** have a file extension. If not the compiler will split the string and make a directory inside a directory and so on.

| Property | Type | Description |
| --- | --- | --- |
| `target` | string[] | The targeted SCSS file. |
| `output` | string[] | The location of the compiled SCSS file. |

### API

| Property | Type | Description |
| --- | --- | --- |
| `meta` | Object | The BetterDiscord theme/plugin META. View all avaiable meta [HERE](https://github.com/BetterDiscord/BetterDiscord/wiki/Plugin-and-Theme-METAs) |
| `compiler.prefix` | boolean | Run the CSS through the PostCSS autoprefixer. (Recommended) |
| `dev.output` | string[] | The file SCSS will compile to your BetterDiscord themes folder or the path given by the `--bdFolder` option. |
| `main.output` | string[] | The location of the compiled CSS, relative to the project directory. |
| `base.output` | string[] | The location of the compiled CSS, relative to the project directory. |

<br>

## Examples

- [DiscordStyles/SoftX](https://github.com/DiscordStyles/SoftX)
- [DiscordStyles/Slate](https://github.com/DiscordStyles/Slate)

<br>

## License

See the [LICENSE](https://github.com/Gibbu/bd-scss/blob/main/LICENSE) file for license rights and limitations (MIT).