import chalk from 'chalk';
import path from 'path';

import type { Config } from './config.js';

/**
 * Get the target and output paths of the given value.
 * @param val The path to be parsed.
 */
export const getPaths = (val: string | [string, string] | undefined) => {
	if (typeof val === 'undefined' || !val) return;

	let path: { target: string[]; output: string[] } = { target: [], output: [] };

	if (typeof val === 'string') path.target = val.split('/');
	else {
		path.target = val[0].split('/');
		path.output = val[1].split('/');
	}

	return path;
};

/**
 * Get the current OS.
 */
export const getOs = () => {
	if (process.platform === 'win32') return 'WIN';
	else if (process.platform === 'darwin') return 'MACOS';
	else if (process.platform === 'linux') return 'LINUX';
	return 'UNDEFINED';
};

/**
 * Find the `bd-scss.config.js` file of the current working directory.
 */
export const getConfig = async () => {
	const find = path.join(process.cwd(), 'bd-scss.config.js');

	try {
		let config = (await import((getOs() === 'WIN' ? 'file://' : '') + find)).default as Config;
		return config;
	} catch (err) {
		console.log(`\n${chalk.redBright.bold('[ERROR]')} Cannot find ${chalk.yellow('`bd-scss.config.js`')} in the root of your directory.\n`);
		console.log(`If you do have the config file, make sure you include ${chalk.yellow('"type": "module"')} in your ${chalk.yellow('`package.json`')} file.\n`);
		process.exit(1);
	}
};

/**
 * Construct the meta given by the `bd-scss.config.js` file.
 */
export const generateMeta = async () => {
	const config = await getConfig();

	return `/**\n${Object.entries(config.meta)
		.map(([key, value]) => ` * @${key} ${value}\n`)
		.join('')}*/\n\n`;
};

/**
 * Get the BetterDiscord data directory.
 */
export const getDataFolder = async () => {
	const config = await getConfig();

	let devPath: string | undefined;
	let folder: string;

	if (config.dev && Array.isArray(config.dev)) devPath = config.dev[1];

	if (getOs() === 'WIN') folder = devPath || path.join(process.env.APPDATA!, 'BetterDiscord');
	else if (getOs() === 'MACOS') folder = devPath || path.join(process.env.HOME!, 'Library', 'Application Support', 'BetterDiscord');
	else if (getOs() === 'LINUX') folder = devPath || path.join(process.env.HOME!, '.local', 'share', 'BetterDiscord');
	else {
		throw new Error('Cannot determine your OS.');
	}

	return path.join(folder, 'themes');
};

/**
 * Generates an array with missing meta to be used to tell the user if they're missing any.
 */
export const getMissingMeta = (meta: Record<string, any>) => {
	const keys = Object.keys(meta);

	const requiredMeta = ['name', 'author', 'description', 'version', 'source'];
	let missing: string[] = [];

	requiredMeta.forEach((requiredKey) => {
		if (!keys.includes(requiredKey)) missing = [...missing, requiredKey];
	});

	return missing;
};
