#!/usr/bin/env node

import fs from 'fs';
import sade from 'sade';
import chokidar from 'chokidar';
import chalk from 'chalk';

import compile from './compiler.js';
import { getConfig, getDataFolder } from './utils.js';
import { DEFAULTS } from './defaults.js';

const config = await getConfig();

const prog = sade('bd-scss');

prog
	.command('build')
	.describe('Compiles the `dist` and `base` config objects.')
	.action(async () => {
		// Bullds the .theme.css file for end users to download and install.
		await compile({
			target: (config.dist?.target || DEFAULTS.dist.target).split('/'),
			output: (config.dist?.output || DEFAULTS.dist.output).split('/'),
			dist: true,
		});

		// Builds the "base" .css file to be @import'd
		await compile({
			target: (config.base?.target || DEFAULTS.base.target).split('/'),
			output: (config.base?.output || DEFAULTS.base.output).split('/'),
		});

		// Builds and addons
		if (config.addons && Array.isArray(config.addons) && config.addons.length > 0) {
			config.addons.forEach(async (addon) => {
				await compile({
					target: addon[0].split('/'),
					output: addon[1].split('/'),
				});
			});
		}
	});

prog
	.command('dev')
	.describe('Watch the SRC folder for changes and autocompile them to the BetterDiscord themes folder.')
	.action(async () => {
		let dataFolder = await getDataFolder();

		if (dataFolder[0] === '~') dataFolder = process.env.HOME! + dataFolder.substring(1);

		if (!fs.existsSync(dataFolder)) {
			console.log(chalk.redBright.bold('[ERROR]') + ' Directory does not exist: ' + chalk.yellow('`' + dataFolder + '`'));
			process.exit(1);
		}

		chokidar
			.watch('src', { usePolling: true })
			.on('ready', () => {
				console.log(`${chalk.magentaBright.bold('[WATCHING]')} Watching the ${chalk.yellow('`src`')} folder for any changes...`);
			})
			.on('change', async () => {
				await compile({
					target: (config.dev?.target || DEFAULTS.dev.target).split('/'),
					output: dataFolder.split('/'),
					dev: true,
				});
			});
	});

prog.parse(process.argv);
