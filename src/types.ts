export type Addon =
	| string
	| {
			/** The target file relative to the current directory. */
			target: string;
			/** The output name of the addon. */
			name?: string;
			/**
			 * Include this addon to the end user theme file?
			 *
			 * Providing this option will mean you don't need to include it\
			 * in the `imports` array.
			 *
			 * @default false
			 */
			dist?: boolean;
			/**
			 * Include this addon to the dev theme file.
			 *
			 * @default false
			 */
			dev?: boolean;
	  };

export type Import =
	| string
	| {
			/**
			 * The external URL to the import.
			 *
			 * If path is used, it **will** be relative to the current directory.\
			 */
			url: string;
			/**
			 * Include this import with the dev theme file.
			 *
			 * @default true
			 */
			dev?: boolean;
	  };

export type GitHub =
	| string
	| {
			/** The github user/org */
			profile: string;
			/** The name of the repo */
			repo: string;
	  };

export interface RequiredMeta {
	/**
	 * The name of your theme.
	 *
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
	/** Your Discord Tag or whatever you call yourself. */
	author: string;
	/** The version of your theme */
	version: string;
	/** Discribe your theme in a short sentence. */
	description: string;
	/** The open-source location of your theme files. */
	source: string;
}

export interface OptionalMeta {
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
}

export interface BetterDiscord {
	/**
	 * The BetterDiscord theme folder location
	 *
	 * This will be an absolute path, so you must provide the full path.
	 */
	themeFolder?: string;
}

export interface Vencord {
	/**
	 * The Vencord theme folder location
	 *
	 * This will be an absolute path, so you must provide the full path.
	 */
	themeFolder?: string;
	/**
	 * Compile the dev file to the `vencord.themeFolder` when using the `dev` script
	 *
	 * @default false
	 */
	dev?: boolean;
}
