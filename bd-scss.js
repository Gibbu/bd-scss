#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import sade from 'sade';
import chokidar from 'chokidar';
import chalk from 'chalk';
import compile from './compiler.js';
import {config} from './utils.js'; 

const prog = sade('bd-scss');

// Build script
prog
	.command('build')
	.describe('Compiles SCSS to CSS, with optional autoprefixer')
	.action(async() => {
		// Builds the .theme.css file for end users to download and install.
		await compile({
			target: config.dist.target,
			output: config.dist.output
		}, true);

		// Builds the "base" .css file to be @import'd.
		await compile({
			target: config.base.target,
			output: config.base.output
		})

		// Builds any addons
		if (config.addons && Array.isArray(config.addons) && config.addons.length > 0) {
			config.addons.forEach(async(step) => {
				await compile({
					target: step.target,
					output: step.output
				})
			})
		}
	});

// Dev script
prog
	.command('dev')
	.describe('Watch the SRC folder for changes and autocompile them to the BetterDiscord themes folder')
	.option('--bdFolder', 'Change the output directory.')
	.action(({bdFolder}) => {
		let dataFolder;

		if (process.platform === 'win32') dataFolder = process.env.APPDATA;
		else if (process.platform === 'darwin') dataFolder = path.join('Library', 'Application Support');
		else if (process.platform === 'linux') dataFolder = path.join('.local', 'share');
		else {
			console.log(chalk.redBright.bold('[ERROR]') + ' Cannot determine your OS.');
			process.exit(1);
		}

		let themesFolder = bdFolder || path.join(dataFolder, "BetterDiscord");
		// Makes sure that all folders go to the /themes folder
        	themesFolder = path.join(themesFolder, "themes");
		// If a user puts ~ it will change to the actual home folder
        	if (themesFolder[0] == "~") {
            		themesFolder = process.env.HOME + themesFolder.substring(1);
        	}

		if (!fs.existsSync(themesFolder)) {
			console.log(chalk.redBright.bold('[ERROR]') + ' Directory does not exist: ' + chalk.yellow('`' + themesFolder + '`'));
			process.exit(1);
		}

		chokidar
			.watch('src', {persistent: true})
			.on('ready', () => console.log('Watching for changes...'))
			.on('change', async() => {
				await compile({
					target: config.dev.target,
					output: [themesFolder, ...config.dev.output]
				}, true)
			})
	})

prog.parse(process.argv);
