import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

import type { Config } from './config.js';

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
 * Get the BetterDiscord directory.
 */
export const getDataFolder = () => {
	let devPath: string | undefined;
	let folder: string;

	if (getOs() === 'WIN') folder = devPath || path.resolve(process.env.APPDATA!, 'BetterDiscord', 'themes');
	else if (getOs() === 'MACOS') folder = devPath || path.resolve(process.env.HOME!, 'Library', 'Application Support', 'BetterDiscord', 'themes');
	else if (getOs() === 'LINUX') folder = devPath || path.resolve(process.env.HOME!, '.local', 'share', 'BetterDiscord', 'themes');
	else {
		throw new Error('Cannot determine your OS.');
	}

	if (!fs.existsSync(getPath(folder))) {
		console.log(chalk.redBright.bold('[ERROR]') + ' Directory does not exist: ' + chalk.yellow('`' + folder + '`'));
		process.exit(1);
	}

	if (folder[0] === '~') folder = process.env.HOME! + folder.substring(1);

	return folder;
};

/**
 * Transforms the given value to an absolute path.
 */
export const getPath = (val: string | string[]) => {
	if (typeof val === 'string') return path.resolve(...val.split('/'));
	return path.resolve(...val);
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
