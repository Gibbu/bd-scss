// prettier-ignore

export interface Config {
	/**
	 * The name of the file to be compiled.  
	 * This will default to your `meta.name` if this option is not provided.  
	 * 
	 * This **WILL** name both the "dist" and "base" css files.  
	 * Example: `CoolTheme.theme.css` and `CoolTheme.css`.
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
		 * 
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
	};

	/**
	 * The output path of the dist file, relative to the current working directory.  
	 * Leaving this blank will default to: `dist/[meta.name].theme.css`.
	 *
	 * Providing an array will allow you to change both the targeted file and the output path.  
	 * Example: `['src/dist/index.scss', 'dist/theme']`.
	 * 
	 * 
	 * Default: `['src/dist.scss', 'dist']`
	 */
	dist?: string | [string, string];

	/**
	 * The output path of the base file, relative to the current working directory.  
	 * Leaving this blank will default to: `dist/[meta.name].css`.
	 *
	 * Providing an array will allow you to change both the targeted file and the output path.  
	 * Example: `['src/base/index.scss', 'dist/base']`.
	 * 
	 * 
	 * Default: `['src/base.scss', 'dist']`
	 */
	base?: string | [string, string];

	/**
	 * The target path of the dev file.  
	 *
	 * Providing an array will allow you to change both the targeted file and the output path.  
	 * 
	 * If for some reason your BetterDiscord isn't in the default location provided by this package,
	 * simply change this to match your path.
	 * 
	 * Example: `['src/dev.scss', 'C:\Users\Gibbu\BetterDiscord']`
	 * 
	 * Default: `'src/dev.scss'`
	 */
	dev?: string | [string, string];

	/**
	 * Any addons that should be compiled separately from your theme files.  
	 * Example being Horizontal Server List and it's bottomhsl addon.
	 * 
	 * The first index is the target file while the 2nd index is the output file, relative to your
	 * project directory.  
	 * 
	 * You **MUST** provide the full path to file, including the extension.  
	 * As the compiler will not auto name these for you.  
	 * 
	 * Example: `['src/addons/_mycooladdon.scss', 'dist/MyCoolAddon.css']`
	 */
	addons?: ([string, string])[];

	/**
	 * The `@import` url used in the .theme.css file.  
	 * If for some reason your GitHub name isn't in the `meta.name` use this to change it.  
	 * 
	 * Example: `https://discordstyles.github.io/Fluent/Fluent.css`
	 */
	baseImport?: string;
}
