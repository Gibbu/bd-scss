#!/usr/bin/env node

import sade from 'sade';
import chokidar from 'chokidar';

import { checkConfig, checkMeta } from './checker.js';
import { getConfig } from './utils.js';
import { log } from './log.js';
import { compileDev, compileDist } from './compile.js';
import { reroll } from './reroll.js';

const cli = sade('bd-scss');

cli
	.command('build')
	.describe('Compiles theme to the necessary files.')
	.action(async () => {
		checkConfig();
		const config = await getConfig();
		checkMeta(config.meta);

		console.log(config.github);

		await compileDist();
	});

cli
	.command('dev')
	.describe('Watch the SRC folder for changes and auto compile.')
	.action(async () => {
		checkConfig();
		let config = await getConfig();
		checkMeta(config.meta);

		chokidar
			.watch(['src', 'bd-scss.config.js'])
			.on('ready', () => {
				log.info([
					`\nWatching: ${log.code('src')} folder...`,
					`BetterDiscord: ${config.betterdiscord.themeFolder}`,
					config.vencord.dev ? `Vencord: ${config.vencord.themeFolder}` : ''
				]);
			})
			.on('change', async (filePath) => {
				if (filePath === 'bd-scss.config.js') {
					config = await getConfig();
				}
				await compileDev();
			});
	});

cli
	.command('reroll')
	.describe('Automatically update classes via SyndiShanX/Update-Classes.')
	.action(async () => {
		log.info(['Replacing classes...']);
		const startTime = performance.now();
		const { classesChanged, filesChanged } = await reroll();
		const endTime = performance.now();

		if (filesChanged.length > 0)
			log.success([
				`Classes rerolled.`,
				`Duration: ${(endTime - startTime).toFixed()}ms.`,
				`Files Changed:`,
				filesChanged.map((el) => '  - ' + el).join('\n')
			]);
		else log.info(['No files were changed.']);
	});

cli.parse(process.argv);
