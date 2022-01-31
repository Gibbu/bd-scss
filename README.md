# bd-scss
Simple package to create themes using SCSS for BetterDiscord.

## Usage
Install the package with:
```bash
npm install bd-scss
# or
yarn install bd-scss
#or
pnpm install bd-scss
```

Create a `bd-scss.config.json` file in the root of your project folder with the following:
```json
{
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

| Property | Type | Description |
| --- | --- | --- |
| `compiler.prefix` | boolean | Run the CSS through the PostCSS autoprefixer. |
| `dev.target` | string[] | The target of the dev script to watch and autocompile.<br>*Note: the last index **MUST** end in a file extension.* |
| `dev.output` | string | The file SCSS will compile to your BetterDiscord themes folder. |
| `build.target` | string[] | The path and file the build script will compile from. <br>*Note: the last index **MUST** end in a file extension.* |
| `build.output` | string[] | The location of the compiled CSS, relative to the project directory. <br>*Note: The compiler will auto create directories if not found.*

## License

See the [LICENSE](https://github.com/Gibbu/bd-scss/blob/main/LICENSE) file for license rights and limitations (MIT).