import path from 'path';
import fs from 'fs';

import type { Config } from './config.js';
import type { Addon, BetterDiscord, GitHub, Import, OptionalMeta, RequiredMeta, Vencord } from './types.js';

export const osSlash = process.platform === 'win32' ? '\\' : '/';

/**
 * Get the config with defaults if optional properties aren't passed.
 */
export const getConfig = async () => {
	const local = (await import(path.join(process.cwd(), `bd-scss.config.js`))).default as Config;

	const CONFIG = {
		meta: local.meta,
		root: local.root || 'src/root.scss',
		main: local.main || 'src/main.scss',
		betterdiscord: {
			themeFolder: getDataFolder('BetterDiscord'),
			...local.betterdiscord
		},
		vencord: { themeFolder: getDataFolder('Vencord'), dev: false, ...local.vencord },
		addons: local.addons || [],
		github: local.github || {
			profile: local.meta.author,
			repo: local.meta.name
		},
		imports: local.imports || []
	} satisfies {
		meta: RequiredMeta & OptionalMeta;
		root: string;
		main: string;
		betterdiscord: Required<BetterDiscord>;
		vencord: Required<Vencord>;
		addons: Addon[];
		github: Required<GitHub>;
		imports: Import[];
	};

	return CONFIG;
};

/**
 * Get the client mod datafolder.
 * @param mod The directory to search for.
 */
export const getDataFolder = (mod: 'BetterDiscord' | 'Vencord') => {
	// Fix GitHub from running this and simply return the relative `dist` folder.
	if (process.argv[2] === 'build') return 'dist';

	let folder: string = '';

	if (process.platform === 'win32') {
		folder = path.resolve(process.env.APPDATA!, mod, 'themes');
	} else if (process.platform === 'darwin') {
		folder = path.resolve(process.env.HOME!, 'Library', 'Application Support', mod, 'themes');
	} else if (process.platform === 'linux') {
		const linuxPaths = [
			path.resolve(process.env.HOME!, '.local', 'share', mod, 'themes'),
			path.resolve(process.env.HOME!, '.config', mod, 'themes')
		];
		for (let i = 0; i < linuxPaths.length; i++) {
			const el = linuxPaths[i];
			if (fs.existsSync(el)) {
				folder = el;
				break;
			}
		}
	} else throw new Error('Cannot determin your OS.');

	if (folder[0] === '~') folder = process.env.HOME! + folder.substring(1);

	return folder;
};

/**
 * Transforms the given value to an absolute path.
 */
export const getPath = (...val: string[]) => {
	return path.resolve(...[...val].flat(42));
};

/**
 * Construct the meta given by the `bd-scss.config.js` file.
 */
export const generateMeta = (meta: Config['meta']) => {
	return `/**\n${Object.entries(meta)
		.map(([key, value]) => ` * @${key} ${value}\n`)
		.join('')}*/\n\n`;
};

/**
 * Splits any `@imports` into their own array and remove from string.
 * @param css The css to parse
 */
export const splitImports = (css: string) => {
	let imports: string[] = [];

	const parsed = css
		.split('\n')
		.map((line) => {
			if (line.includes('@import')) {
				const imp = line.substring(line.indexOf('@') + 1, line.lastIndexOf(';'));
				imports.push(`@${imp};`);
				line = line.replaceAll(`@${imp};`, '');
			}
			return line.trim();
		})
		.join('\n');

	return { css: parsed, imports };
};

/**
 * Parse each addon.
 * @param addon The singular addon config object
 */
export const parseAddon = (addon: Addon) => {
	const target = typeof addon === 'string' ? addon : addon.target;
	const name = (typeof addon === 'string' ? pop(addon) : addon.name || pop(addon.target)).replace(/.scss|.css/, '');
	const dev = typeof addon === 'object' && addon.dev;
	const dist = typeof addon === 'object' && addon.dist;

	return { target, name, dev, dist };
};

/**
 * Get the last index of the string and remove the any starting underscore.
 * @param str The string to be popped
 */
export const pop = (str: string) => str.split('/').pop()!.replace(/^_/, '');

/**
 * Generate a CSS import based on the `bd-scss.config.js` file.
 * @param config The config object.
 * @param name The name of the file.
 */
export const generateImport = (config: Config, name: string) => {
	const repo = typeof config.github === 'object' ? config.github.repo : config.meta.name;
	const profile = config.github ? (typeof config.github === 'string' ? config.github : config.github.profile) : config.meta.author;

	return `@import url('https://${profile.replace(/ /g, '').toLowerCase()}.github.io/${repo.replace(/ /g, '')}/${name.replace(/ /g, '')}.css');`;
};
