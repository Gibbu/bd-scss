import fs from 'fs';
import path from 'path';

import * as sass from 'sass';
import { Processor } from 'postcss';
import autoprefixer from 'autoprefixer';

import { getConfig, generateMeta, getSlash } from './utils.js';
import { CONFIG } from './config.js';
import log from './log.js';

interface Options {
	target: string;
	output: string;
	mode?: 'dist' | 'dev' | 'addon';
}

const config = await getConfig();

export default async (options: Options, fileName: string) => {
	const startTime = performance.now();

	const baseImport = `https://${CONFIG.github.profile}.github.io/${CONFIG.github.repo}/${CONFIG.theme.base}.css`;

	const isTheme = options.mode === 'dist' || options.mode === 'dev';
	const name = isTheme ? `${fileName}.theme.css` : options.mode !== 'addon' ? `${fileName}.css` : fileName;
	const dirPath = options.output
		.split(getSlash)
		.filter((el) => !el.endsWith('.css'))
		.join(getSlash);

	// // Check if target file exists.
	if (!fs.existsSync(options.target)) log.error(`Cannot find the target file ${log.code(options.target)}`);

	log.info(`${log.code(options.target)} file...`, 'BUILDING');

	// Check if path exists, if not make it.
	if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

	// Compile and parse css.
	const css = sass.compile(options.target, {
		charset: false,
		loadPaths: ['node_modules']
	}).css;

	const postcss = new Processor([autoprefixer]).process(css).css;

	let generatedFile: string | undefined = '';

	if (isTheme) {
		generatedFile = await generateMeta(config);
		if (options.mode === 'dist') generatedFile += `@import url('${baseImport}');\n\n`;
	}
	generatedFile += postcss;

	const endTime = performance.now();

	if (!generatedFile) {
		log.error('Could not generate file');
		return;
	}

	// Write file to disk.
	try {
		fs.writeFileSync(path.join(dirPath, name.replace(/ /g, '')), generatedFile);
		log.success(`Built in ${(endTime - startTime).toFixed()}ms`);
	} catch (error) {
		log.error(error as string);
	}
};
