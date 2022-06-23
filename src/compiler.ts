import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

// @ts-ignore
import sass from 'sass'; // Types are outdated :(
import { Processor } from 'postcss';
import autoprefixer from 'autoprefixer';

import { getConfig, generateMeta, getOs, getMissingMeta } from './utils.js';
import { DEFAULTS } from './defaults.js';

interface Options {
	target?: string[];
	output?: string[];
	dist?: boolean;
	dev?: boolean;
	addon?: boolean;
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

export default async (options: Options = { target: [], output: [], dist: false, dev: false, addon: false }) => {
	const startTime = performance.now();
	const osSlash = getOs() === 'WIN' ? '\\' : '/';
	const isTheme = options.dist || options.dev || false;
	const fileName = !options.addon ? `${config.fileName || config.meta.name}${isTheme ? '.theme' : ''}.css` : options.output?.pop()!;

	// Check if target file exists.
	if (!fs.existsSync(path.join(...options.target!))) {
		console.log(`${chalk.redBright('[ERROR]')} Cannot find the target file: ${chalk.yellow('`' + options.target!.join(osSlash) + '`')}`);
		process.exit(1);
	}

	console.log(`${chalk.blueBright('[BUILDING]')} ${chalk.yellow(`\`${options.target!.join(osSlash)}\``)} file...`);

	// Check if path exists, if not make it.
	const dirPath = path.join(...options.output!.filter((el) => !el.endsWith('.css')));
	if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

	// Compile and parse css.
	const css = sass.compile(path.join(...options.target!)).css.replace('@charset "UTF-8";\n', '');

	const postcss = new Processor([autoprefixer]).process(css);
	const parsedcss = postcss.css;

	let generatedFile: string = '';

	if (isTheme) {
		generatedFile = await generateMeta();
		if (options.dist) generatedFile += `@import url('${config.baseImport || DEFAULTS.importUrl}');\n\n`;
	}
	generatedFile += parsedcss;

	const endTime = performance.now();

	// Write file to disk.
	try {
		fs.writeFileSync(path.join(...options.output!, fileName), generatedFile);
		console.log(
			chalk.greenBright.bold('[SUCCESS]') +
				' Successfully built ' +
				chalk.yellow(`\`${options.target!.join(osSlash)}\``) +
				' to ' +
				chalk.yellow(`\`${options.output!.join(osSlash)}${osSlash}${fileName}\``) +
				' in ' +
				chalk.cyanBright((endTime - startTime).toFixed() + 'ms')
		);
	} catch (error) {
		console.log(chalk.redBright.bold('[ERROR]'), error);
	}
};
