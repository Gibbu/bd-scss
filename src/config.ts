import { getConfig, getDataFolder } from './utils.js';

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
	default: 0 | 1;
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
		/** URL to whatever you wish to link to. */
		authorLink?: string;
		/**
		 * Theme setting variables.
		 *
		 * Refer to the [UserCSS guide](https://github.com/openstyles/stylus/wiki/Writing-UserCSS#var) if you require help.
		 */
		vars?: Var[];
	};

	github?: {
		/**
		 * The name of the github profile your theme be will hosted on.\
		 * Default to `meta.author` if this option is not provided.
		 */
		profile?: string;

		/**
		 * The name of the theme file that users will download.\
		 * Default to `meta.name` if this option is not provided.
		 *
		 * Example: `Fluent.theme.css`
		 */
		repo?: string;
	};

	/** The name of the files to be compiled. */
	theme?: {
		/**
		 * The name of the theme file that users will download.\
		 * Default to `meta.name` if this option is not provided.
		 *
		 * Example: `Fluent.theme.css`
		 */
		file?: string;

		/**
		 * The name of the css file that the `theme.file` will be importing.\
		 * Default to `meta.name` if this option is not provided.
		 */
		base?: string;
	};

	/**
	 * Change the location of each file.
	 *
	 * All `target` options are relative to the current directory.\
	 * Both `dist.output` and `base.output` options are relative to the current directory.
	 *
	 * `dev.output` is an absolute path. So you **must** provide the full path to where ever you wish it to compile.\
	 * Default is to your BetterDiscord themes directory.
	 */
	files?: {
		/** Targets the `src/dist.css` file. */
		dist?: {
			/** Relative to the current directory. */
			target?: string;
			/** Relative to the current directory. */
			output?: string;
		};
		base?: {
			/** Relative to the current directory. */
			target?: string;
			/** Relative to the current directory. */
			output?: string;
		};
		dev?: {
			/** Relative to the current directory. */
			target?: string;
			/**
			 * Absolute path.
			 *
			 * You **must** provide a full path.
			 */
			output?: string;
		};
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
}

const dataFolder = getDataFolder();
const config = await getConfig();

export const CONFIG = {
	dev: {
		target: config?.files?.dev?.target || 'src/dev.scss',
		output: config?.files?.dev?.output || dataFolder
	},
	dist: {
		target: config?.files?.dist?.target || 'src/dist.scss',
		output: config?.files?.dist?.output || 'dist'
	},
	base: {
		target: config?.files?.base?.target || 'src/base.scss',
		output: config?.files?.base?.output || 'dist'
	},
	theme: {
		file: config?.theme?.file || config?.meta?.name || '',
		base: config?.theme?.base || config?.meta?.name || ''
	},
	github: {
		profile: config?.github?.profile || config?.meta?.author || '',
		repo: config?.github?.repo || config?.meta?.name || ''
	}
};
