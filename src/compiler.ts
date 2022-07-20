import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

// @ts-ignore
import sass from 'sass'; // Types are outdated :(
import { Processor } from 'postcss';
import autoprefixer from 'autoprefixer';

import { getConfig, generateMeta, getMissingMeta, getPath } from './utils.js';
import { DEFAULTS } from './defaults.js';

interface Options {
	target: string;
	output: string;
	mode?: 'dist' | 'dev' | 'addon';
}

const config = await getConfig();

const { meta } = config;
const missingMeta = getMissingMeta(meta);

if (!meta) {
	console.log(`${chalk.redBright('[ERROR]')} Your ${chalk.yellow('`bd-scss.config.js`')} file is missing the ${chalk.yellow('`meta`')} object.`);
	process.exit(1);
}
if (missingMeta.length > 0) {
	console.log(`${chalk.redBright('[ERROR]')} Your ${chalk.yellow('`meta`')} object is missing the following required properties:\n` + missingMeta.map((key) => ` - ${key}\n`).join(''));
}

export default async (options: Options) => {
	const startTime = performance.now();
	const isTheme = options.mode === 'dist' || options.mode === 'dev' || false;
	const fileName = options.mode !== 'addon' ? `${config.fileName || config.meta.name}${isTheme ? '.theme' : ''}.css` : options.output.split('/').pop()!;

	// Check if target file exists.
	if (!fs.existsSync(getPath(options.target))) {
		console.log(`${chalk.redBright('[ERROR]')} Cannot find the target file: ${chalk.yellow('`' + getPath(options.target) + '`')}`);
		process.exit(1);
	}

	console.log(`🔨 - Building ${chalk.yellow('`' + options.target + '`')} file...`);

	// Check if path exists, if not make it.
	const dirPath = options.output
		.split('/')
		.filter((el) => !el.endsWith('.css'))
		.join('/');
	if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

	// Compile and parse css.
	const css = sass.compile(options.target).css.replace('@charset "UTF-8";\n', '');

	const postcss = new Processor([autoprefixer]).process(css);
	const parsedcss = postcss.css;

	let generatedFile: string = '';

	if (isTheme) {
		generatedFile = await generateMeta();
		if (options.mode === 'dist') generatedFile += `@import url('${config.baseImport || DEFAULTS.baseImport}');\n\n`;
	}
	generatedFile += parsedcss;

	const endTime = performance.now();

	// Write file to disk.
	try {
		fs.writeFileSync(path.join(options.output, fileName.replace(/ /g, '')), generatedFile);
		console.log(`✅ - Successfully built ${chalk.grey(`(${(endTime - startTime).toFixed()}ms)`)}`);
	} catch (error) {
		console.log(chalk.redBright.bold('[ERROR]'), error);
	}
};
