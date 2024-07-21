import path from 'path';
import fs from 'fs';
import log from './log.js';

import type { Config } from './config.js';

/**
 * Get the current OS.
 */
export const getOs = () => {
	switch (String(process.platform)) {
	case 'win32':
		 return 'WIN';
	case 'darwin':
		 return 'MACOS';
	case 'linux':
		 return 'LINUX';
	default:
		return 'UNDEFINED';
	}
};

export const getSlash = getOs() === 'WIN' ? '\\' : '/';

/**
 * Find the `bd-scss.config.js` file of the current working directory.
 */
export const getConfig = async () => {
	const find = path.join(process.cwd(), 'bd-scss.config.js');

	try {
		let config = (await import((getOs() === 'WIN' ? 'file://' : '') + find)).default as Config;
		return config;
	} catch (err) {
		log.error(
			`Cannot find ${log.code('bd-scss.config.js')} in the root of your directory.\n\n` +
				`If you do have a config file, make sure you include ${log.code('type": "module', '"')} in your ${log.code('package.json')} file.`
		);
	}
};

/**
 * Construct the meta given by the `bd-scss.config.js` file.
 */
export const generateMeta = async () => {
	const config = await getConfig();

	if (!config) return;

	return `/**\n${Object.entries(config.meta)
		.map(([key, value]) => ` * @${key} ${value}\n`)
		.join('')}*/\n\n`;
};

/**
 * Get the BetterDiscord directory.
 */
export const getDataFolder = () => {
	// Fix GitHub trying to run and erroring out.
	if (process.argv[2] === 'build') return 'dist';

	let devPath: string | undefined;
	var folder = '';

	const checkDir = (dir: string, exitOnError: boolean) => {
		if (!fs.existsSync(getPath(dir))) {
			switch (exitOnError) {
				case true:
					log.error(`Directory does not exist: ${log.code('`' + getPath(dir) + '`')}`);
				case false:
					log.warning(`Directory does not exist: ${log.code('`' + getPath(dir) + '`')}`);
			}
		}
	}

	switch (String(getOs()))  {
		case 'WIN':
			folder = devPath || path.resolve(process.env.APPDATA!, 'BetterDiscord', 'themes');
			checkDir(folder, true);
			break;
		case 'MACOS':
			folder = devPath || path.resolve(process.env.HOME!, 'Library', 'Application Support', 'BetterDiscord', 'themes');
			checkDir(folder, true);
			break;
		case 'LINUX':
			let linux_paths: string[] = [
			path.resolve(process.env.HOME!, '.local', 'share', 'BetterDiscord', 'themes'),
			path.resolve(process.env.HOME!, '.config', 'BetterDiscord', 'themes') ]

			let path_count = linux_paths.length
			linux_paths.forEach( (linux_path) => {
				folder = devPath || linux_path
				log.info(`Trying ${log.code('`' + getPath(folder) + '`')} ...`);
				if (!--path_count) 
					checkDir(folder, true);
				else 
				checkDir(folder, false)	
			});
			break;

		case 'UNDEFINED':
				 log.error('Cannot determine your OS.');
		}

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
 * Generates an array with missing meta to be used to tell the user if they're missing any.
 */
export const getMissingMeta = (meta: Record<string, any>) => {
	const keys = Object.keys(meta);

	const requiredMeta = ['name', 'author', 'description', 'version', 'source'];
	let missing: string[] = [];

	requiredMeta.forEach((requiredKey) => {
		if (!keys.includes(requiredKey)) missing = [...missing, requiredKey];
	});

	return missing.map((key) => ` - ${key}\n`).join();
};
