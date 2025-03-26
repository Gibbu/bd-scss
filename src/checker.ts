import fs from 'node:fs';
import path from 'node:path';
import { log } from './log.js';

import type { Config } from './config.js';

export const checker = () => {};

export const checkMeta = (meta: Config['meta']) => {
	if (!meta) {
		log.error(`Your ${log.code('bd-scss.config.js')} file is missing the ${log.code('meta')} object.`);
	}

	const keys = Object.keys(meta);

	const requiredMeta = ['name', 'author', 'description', 'version', 'source'];
	let missing: string[] = [];

	requiredMeta.forEach((requiredKey) => {
		if (!keys.includes(requiredKey)) missing = [...missing, requiredKey];
	});

	if (missing.length > 0) {
		log.error([
			`Your ${log.code('meta')} object is missing the following required properties:`,
			missing.map((key) => ` - ${key}\n`).join()
		]);
	}
};

export const checkConfig = () => {
	if (!fs.existsSync(path.join(process.cwd(), 'bd-scss.config.js'))) {
		log.error([
			`Cannot find ${log.code('bd-scss.config.js')} in the root of your directory.`,
			'',
			`If you do have a config file, make sure to include ${log.code('type": "module', '"')} in your ${log.code('package.json')} file.`
		]);
	}
};
