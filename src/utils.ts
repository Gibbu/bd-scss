import path from 'path';
import fs from 'fs';
import log from './log.js';

import type { Config, Var } from './config.js';

/**
 * Get the current OS.
 */
export const getOs = () => {
	if (process.platform === 'win32') return 'WIN';
	else if (process.platform === 'darwin') return 'MACOS';
	else if (process.platform === 'linux') return 'LINUX';
	return 'UNDEFINED';
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
 * Get the BetterDiscord directory.
 */
export const getDataFolder = () => {
	// Fix GitHub trying to run and erroring out.
	if (process.argv[2] === 'build') return 'dist';

	let devPath: string | undefined;
	let folder: string;

	if (getOs() === 'WIN') folder = devPath || path.resolve(process.env.APPDATA!, 'BetterDiscord', 'themes');
	else if (getOs() === 'MACOS')
		folder = devPath || path.resolve(process.env.HOME!, 'Library', 'Application Support', 'BetterDiscord', 'themes');
	else if (getOs() === 'LINUX') folder = devPath || path.resolve(process.env.HOME!, '.local', 'share', 'BetterDiscord', 'themes');
	else throw new Error('Cannot determine your OS.');

	if (!fs.existsSync(getPath(folder))) {
		log.error(`Directory does not exist: ${log.code('`' + getPath(folder) + '`')}`);
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

	let missing: string[] = [];

	requiredMeta.forEach((requiredKey) => {
		if (!keys.includes(requiredKey)) missing = [...missing, requiredKey];
	});

	return missing.map((key) => ` - ${key}\n`).join('');
};
/** Required BetterDiscord meta fields */
export const requiredMeta = ['name', 'author', 'description', 'version', 'source'];

/**
 * Construct the meta given by the `bd-scss.config.js` file.
 */
export const generateMeta = async (config: Config | undefined) => {
	if (!config) return;

	let meta: string = '';

	meta = `/**\n${Object.entries(config.meta)
		.map(([key, value]) => (key !== 'vars' ? ` * @${key} ${value}\n` : ''))
		.join('')}`;

	if (config.meta.vars) {
		meta += config.meta.vars.map((el) => ` * @var ${constructVars(el)}`).join('');
	}

	meta += '*/\n';

	return meta;
};

/**
 * Construct the vars for theme settings.
 */
export const constructVars = (obj: Var): string => {
	const getLabel = (obj: Var) => `"${obj.hint ? `${obj.label}:${obj.hint}` : obj.label}"`;

	if (obj.type === 'checkbox' || obj.type === 'color' || obj.type === 'text') {
		if (obj.type === 'color' && !/(^rgb\(|hsl\()|#/.test(obj.default)) {
			log.error([
				'Default color code must be a valid css color value.',
				` - Variable: ${obj.variable}`,
				` - Default: ${obj.default} ${log.comment('-> ' + (obj.default.includes('%') ? `hsl(${obj.default})` : `rgb(${obj.default})`))}`,
				'',
				log.comment("You'll have to switch to a `text` @var input instead.")
			]);
		}
		return `${obj.type} ${obj.variable} ${getLabel(obj)} ${obj.default}\n`;
	} else if (obj.type === 'number' || obj.type === 'range') {
		const { default: defVal, max, min, step, type, variable, units } = obj;
		return `${type} ${variable} ${getLabel(obj)} [${defVal}, ${min}, ${max}, ${step}${units ? `, "${units}"` : ''}]\n`;
	} else if (obj.type === 'select') {
		return (
			`select ${obj.variable} ${getLabel(obj)} {\n` +
			' ' +
			obj.options
				.map((el, i) => ` * "${el.label}${el.default ? '*' : ''}": "${el.value}"${i !== obj.options.length - 1 ? ',' : ''}\n`)
				.join('')
				.trim() +
			'\n * }\n'
		);
	}
	return '@error There was an error?';
};
