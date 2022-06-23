import { getConfig } from './utils.js';

const config = await getConfig();

export const DEFAULTS = {
	dev: {
		target: 'src/dev.scss',
		output: '',
	},
	dist: {
		target: 'src/dist.scss',
		output: 'dist',
	},
	base: {
		target: 'src/base.scss',
		output: 'dist',
	},
	importUrl: `https://${config.meta.author}.github.io/${config.meta.name}/${config.meta.name}.css`,
};
