import type { Addon, GitHub, Import, BetterDiscord, Vencord, RequiredMeta, OptionalMeta } from './types.js';

export interface Config {
	meta: RequiredMeta & OptionalMeta;

	/**
	 * The entry point to the theme.
	 *
	 * @default `src/main.scss`
	 */
	main?: string;

	/**
	 * The root file that contains all your public facing variables.
	 *
	 * @default `src/root.scss`
	 */
	root?: string;

	/**
	 * The GitHub profile to point to.
	 *
	 * If string is provided, use that string as the profile
	 * and grab the `meta.name` for the repo.
	 */
	github?: GitHub;

	/**
	 * Any external imports that should be imported with the theme.
	 *
	 * Providing a string will only place the addon in the dist file.
	 */
	imports?: Import[];

	/**
	 * Any "external" css files that should be compiled with your theme.
	 *
	 * Providing a string will build the addon 1-1 and will not be included any either the dist or dev files.
	 *
	 * @example
	 * 'src/addons/_vertical-user-area.scss' -> 'dist/vertical-user-area.css'
	 */
	addons?: Addon[];

	/** Options for BetterDiscord */
	betterdiscord?: BetterDiscord;

	/** Options for Vencord */
	vencord?: Vencord;
}
