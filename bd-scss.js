#!/usr/bin/env node

import sade from 'sade';
import path from 'path';
import chokidar from 'chokidar';
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
	.option('--bdFolder', 'Change the output directory of the watcher')
	.action(({bdFolder}) => {
		const dataFolder = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME + '/.local/share');
		const themesFolder = bdFolder || path.join(dataFolder, 'BetterDiscord', 'themes');

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