#!/usr/bin/env node

import sade from 'sade';
import chokidar from 'chokidar';

import { compile } from './compiler.js';
import { getConfig, getPath } from './utils.js';
import { DEFAULTS } from './defaults.js';
import { log } from './log.js';
import { classReroll } from './classReroll.js';

const config = await getConfig();

const prog = sade('bd-scss');

prog
	.command('build')
	.describe('Compiles the `dist` and `base` config objects.')
	.action(async () => {
		log.info([`Running ${log.code('build')} script...`]);

		try {
			// Bullds the .theme.css file for end users to download and install.
			await compile({
				target: getPath(config?.dist?.target || DEFAULTS.dist.target),
				output: getPath(config?.dist?.output || DEFAULTS.dist.output),
				mode: 'dist'
			});

			// Builds the "base" .css file to be @import'd
			await compile({
				target: getPath(config?.base?.target || DEFAULTS.base.target),
				output: getPath(config?.base?.output || DEFAULTS.base.output)
			});
		} catch (err) {
			log.error([err]);
		}

		// Builds any addons
		if (config?.addons && Array.isArray(config?.addons) && config?.addons.length > 0) {
			config?.addons.forEach(async (addon) => {
				try {
					await compile({
						target: getPath(addon[0]),
						output: getPath(addon[1]),
						mode: 'addon'
					});
				} catch (err) {
					log.error([err]);
				}
			});
		}

		log.success(['Built all files.']);
	});

prog
	.command('dev')
	.describe('Watch the SRC folder for changes and autocompile them to the BetterDiscord themes folder.')
	.action(async () => {
		chokidar
			.watch('src', { usePolling: true })
			.on('ready', () => {
				log.info([`\nWatching: ${log.code('src')} folder`, `Output: ${log.code(config?.dev?.output || DEFAULTS.dev.output)}`], 'DEv');
			})
			.on('change', async () => {
				try {
					await compile({
						target: getPath(config?.dev?.target || DEFAULTS.dev.target),
						output: getPath(config?.dev?.output || DEFAULTS.dev.output),
						mode: 'dev'
					});
				} catch (err) {
					log.error([err]);
				}
			});
	});

prog
	.command('classReroll')
	.describe('Automatically update classes via SyndiShanX/Update-Classes.')
	.action(async () => {
		log.info(['Replacing classes...']);
		const startTime = performance.now();
		const { classesChanged, filesChanged } = await classReroll();
		const endTime = performance.now();

		if (filesChanged.length > 0)
			log.success([
				`Classes rerolled.`,
				`Duration: ${(endTime - startTime).toFixed()}ms.`,
				`Files Changed:`,
				filesChanged.map((el) => '\t - ' + el).join('\n')
			]);
		else log.info(['No files were changed.']);
	});

prog.parse(process.argv);
