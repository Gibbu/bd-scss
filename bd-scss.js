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
	.action(() => {
		config.build.forEach(step => compile({
			target: step.target,
			output: [...step.output]
		}))
	});

// Dev script
prog
	.command('dev')
	.describe('Watch the SRC folder for changes and autocompile them to the BetterDiscord themes folder')
	.option('--bdFolder', 'Change the output directory of the watcher')
	.action(({bdFolder}) => {
		const dataFolder = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME + "/.local/share");
		let themesFolder = bdFolder || path.join(dataFolder, 'BetterDiscord', 'themes');

		chokidar
			.watch('src', {persistent: true})
			.on('ready', () => console.log('Watching for changes...'))
			.on('change', () => {
				config.dev.forEach(step => compile({
					target: step.target,
					output: [themesFolder, step.output]
				}))
			})
	})

prog.parse(process.argv);