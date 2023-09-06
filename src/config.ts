interface BaseVar<T> {
	/** Name of the variable you wish to bind to this config */
	variable: string;
	/** The type of input to customize the value. */
	type: T;
	/** The text to be displayed with the input. */
	label: string;
	/** Addional text to be displayed with the label. */
	hint?: string;
}

interface TextVar extends BaseVar<'text'> {
	/** The default value of the input. */
	default: string;
}

interface ColourVar extends BaseVar<'color'> {
	/** The default value of the input. */
	default: string;
}

interface CheckboxVar extends BaseVar<'checkbox'> {
	/** The default value of the input. */
	default: boolean;
}

interface SelectVar extends BaseVar<'select'> {
	/** The options of the input. */
	options: {
		/** The label of the option. */
		label: string;
		/** The value of the option. */
		value: string;
		/**
		 * The initial value of the select var.
		 *
		 * ## **At least 1 of these must be set to `true`**
		 */
		default: boolean;
	}[];
}

interface RangeVar extends BaseVar<'range'> {
	/** The default value of the input. */
	default: number;
	/** Minimum value of the input. */
	min: number | null;
	/** Maximum value of the input. */
	max: number | null;
	/** The difference between each value. */
	step: number;
	/** The units to be appended to the string. */
	units?: string;
}

interface NumberVar extends BaseVar<'number'> {
	/** The default value of the input. */
	default: number;
	/** Minimum value of the input. */
	min: number | null;
	/** Maximum value of the input. */
	max: number | null;
	/** The difference between each value. */
	step: number;
	/** The units to be appended to the string. */
	units?: string;
}

export type Var = TextVar | ColourVar | CheckboxVar | SelectVar | RangeVar | NumberVar;

export interface Config {
	/**
	 * The name of the file to be compiled.\
	 * This will default to your `meta.name` if this option is not provided.
	 *
	 * This **WILL** name both the "dist" and "base" css files.\
	 * Example: "CoolTheme" = `CoolTheme.theme.css` and `CoolTheme.css`.
	 */
	fileName?: string;

	/**
	 * The available BetterDiscord META.
	 */
	meta: {
		/**
		 * The name of your theme.
		 *
		 * To separate the theme name and filename, set the `fileName` option.
		 * @example
		 * ```txt
		 * name = "CoolTheme"
		 *
		 * Will generate:
		 * - CoolTheme.theme.css --- This being the main file that users will download.
		 * - CoolTheme.css --- This being the file that will be imported.
		 * ```
		 */
		name: string;
		/**
		 * Your Discord Tag or whatever you call yourself.
		 */
		author: string;
		/** The version of your theme */
		version: string;
		/** Discribe your theme in a short sentence. */
		description: string;
		/** The open-source location of your theme files. */
		source: string;
		/** The invite code to your Discord server. */
		invite?: string;
		/** Any donation link you wish to provide. */
		donate?: string;
		/** Your Patreon name. */
		patreon?: string;
		/** Your website. */
		website?: string;
		/** Your Discord unique ID. */
		authorId?: string;
		/**
		 * Theme setting variables.
		 *
		 * Refer to the [UserCSS guide](https://github.com/openstyles/stylus/wiki/Writing-UserCSS#var) if you require help.
		 */
		vars?: Var[];
	};

	/**
	 * The target path of the dist file.
	 *
	 * You can change either target or output by providing said objects.
	 *
	 * @default
	 * ```json
	 * {
	 * 	"target": "src/dist.scss",
	 * 	"output": "dist"
	 * }
	 * ```
	 */
	dist?: {
		target?: string;
		output?: string;
	};

	/**
	 * The target path of the base file.
	 *
	 * You can change either target or output by providing said objects.
	 *
	 * @default
	 * ```json
	 * {
	 * 	"target": "src/base.scss",
	 * 	"output": "dist"
	 * }
	 * ```
	 */
	base?: {
		target?: string;
		output?: string;
	};

	/**
	 * The target path of the dist file.
	 *
	 * You can change either target or output by providing said objects.
	 * The `output` **MUST** be an absolute path, as shown in the default.
	 *
	 * @default
	 * ```json
	 * {
	 * 	"target": "src/dist.scss",
	 * 	"output": "path/to/BetterDiscord/themes"
	 * }
	 * ```
	 */
	dev?: {
		target?: string;
		output?: string;
	};

	/**
	 * Any addons that should be compiled separately from your theme files.
	 * Example being Horizontal Server List and it's bottomhsl addon.
	 *
	 * The first index is the target file while the 2nd index is the output file,
	 * relative to your project directory.
	 *
	 * You **MUST** provide the full path to file, including the extension.
	 * As the compiler will not auto name these for you.
	 *
	 * Example: `['src/addons/_mycooladdon.scss', 'dist/MyCoolAddon.css']`
	 */
	addons?: [string, string][];

	/**
	 * The `@import` url used in the .theme.css file.
	 * If for some reason your GitHub name isn't in the `meta.name` or
	 * you're building to a differnet diectory use this to change it.
	 *
	 * Example: `https://discordstyles.github.io/Fluent/Fluent.css`
	 */
	baseImport?: string;
}
