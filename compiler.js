import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import {config, constructMeta} from './utils.js';

import sass from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

if (!config) {
	console.log(`\n${chalk.redBright.bold('[ERROR]')} Cannot find ${chalk.yellow('`bd-scss.config.json`')} in the root of your directory.\n`);
	process.exit(1);
}

const {compiler, dist, dev, base, meta} = config;

if (!compiler || !dev || !dist || !base || !meta) {
	console.log(
		`\n${chalk.redBright.bold('[ERROR]')} Your ${chalk.yellow('`bd-scss.config.json`')} file is missing one of the following:\n`
		+ ` - ${chalk.yellow('"meta"')}\n`
		+ ` - ${chalk.yellow('"compiler"')}\n`
		+ ` - ${chalk.yellow('"dev"')}\n`
		+ ` - ${chalk.yellow('"build"')}\n\n`
		+ ` - ${chalk.yellow('"base"')}\n\n`
		+ `Make sure they are included.\n`
	);
	process.exit(1);
}

/**
 * Compile, autoprefix and save SCSS.
 * @param {Object} options
 * @param {string[]} options.target The path of the file to be compiled. Uses `path.join()`.
 * @param {string[]} options.output The destination and name of the file. Uses `path.join()`.
 * @param {boolean} meta Tells the compiler to include the META at the top of the file.
 * @return {Promise<void>}
 */
export default async(options, meta = false) => {
	console.log(`\n${chalk.blueBright.bold('[BUILDING]')} ${chalk.yellow(`\`${options.target.join('/')}\``)} file...`);

	// Check if path exists, if not make it.
	const dirPath = options.output.filter(el => !el.endsWith('.css')).join('/');
	if (!fs.existsSync(!dirPath) && dirPath.length) fs.mkdirSync(dirPath, {recursive: true});

	// Compile SCSS.
	let CSS = sass.compile(path.join(...options.target)).css.replace('@charset "UTF-8";\n', '');

	// PostCSS Autoprefixer.
	if (compiler.prefix) {
		const res = await postcss([autoprefixer]).process(CSS, {from: undefined});
		CSS = res.css;
	}

	let generatedFile = meta ? constructMeta() + CSS : CSS;

	// Write file to disk.
	try {
		fs.writeFileSync(typeof options.output === 'string' ? options.output : path.join(...options.output), generatedFile);
		console.log(`${chalk.greenBright.bold('[SUCCESS]')} Successfully built ${chalk.yellow(`\`${options.target.join('/')}\``)} to ${chalk.yellow(`\`${options.output.join('\\')}\``)}`);
	} catch (error) {
		console.log(chalk.redBright.bold('[ERROR]'),	error);
	}
}