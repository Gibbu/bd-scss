import { getConfig, getDataFolder } from './utils.js';
import * as path from 'node:path';
import * as fs from 'node:fs';

const config = await getConfig();
//Check for a absolute path given to the dev folder to suppress missing folder messages
//because if we supplied a absolute path we are explicitly using a nonstandard setup so straight dir existence verification is preferred
const devOutput = config?.dev?.output;
const dataFolder = devOutput && path.isAbsolute(devOutput) && fs.existsSync(devOutput) ? devOutput : getDataFolder();

export const DEFAULTS = {
	dev: {
		target: 'src/dev.scss',
		output: dataFolder
	},
	dist: {
		target: 'src/dist.scss',
		output: 'dist'
	},
	base: {
		target: 'src/base.scss',
		output: 'dist'
	},
	baseImport: `https://${config?.meta.author.toLowerCase()}.github.io/${config?.meta.name}/${config?.meta.name}.css`
};
