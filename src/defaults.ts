import { getConfig } from './utils.js';

const config = await getConfig();

export const DEFAULTS = {
	dev: ['src/dev.scss', ''],
	dist: ['src/dist.scss', 'dist'],
	base: ['src/base.scss', 'dist'],
	importUrl: config.baseImport || `https://${config.meta.author}.github.io/${config.meta.name}/${config.meta.name}.css`,
};
