#!/usr/bin/env node

import sade from 'sade';
import chokidar from 'chokidar';

import compile from './compiler.js';
import { getConfig, getPath, getMissingMeta, requiredMeta } from './utils.js';
import { CONFIG } from './config.js';
import log from './log.js';

const config = await getConfig();
const cli = sade('bd-scss');

if (!config) log.error(`Unable to find your ${log.code('bd-scss.config.js')} file.`);
if (!config?.meta) {
	log.error([
		`Your ${log.code('bd-scss.config.js')} file must contain a ${log.code('meta')} object with the required props.`,
		log.comment(`Required props: ${requiredMeta.join(', ')}`)
	]);
	process.exit(1);
}

if ('fileName' in config || 'baseImport' in config)
	log.error([
		`Your ${log.code('bd-scss.config.js')} file has unsupported properties. The following have been removed:`,
		' - fileName',
		' - baseImport',
		'',
		`Use the new ${log.code('github')} and ${log.code('theme')} objects to determine your files.`
	]);

const { meta } = config;
const missingMeta = getMissingMeta(meta);

if (!meta) log.error(`Your ${log.code('bd-scss.config.js')} file is missing the ${log.code('meta')} object.`);
if (missingMeta.length > 0) log.error(`Your ${log.code('meta')} object is missing the following requires properties:\n` + missingMeta);

cli
	.command('build')
	.describe('Compiles the `dist` and `base` config objects.')
	.action(async () => {
		log.info(`Running ${log.code('build')} script...`);

		try {
			// Bullds the .theme.css file for end users to download and install.
			await compile(
				{
					target: getPath(CONFIG.dist.target),
					output: getPath(CONFIG.dist.output),
					mode: 'dist'
				},
				CONFIG.theme.file
			);

			// Builds the "base" .css file to be @import'd
			await compile(
				{
					target: getPath(CONFIG.base.target),
					output: getPath(CONFIG.base.output)
				},
				CONFIG.theme.base
			);
		} catch (err) {
			log.error(err as string);
		}

		// Builds any addons
		if (config?.addons && Array.isArray(config?.addons) && config?.addons.length > 0) {
			config?.addons.forEach(async (addon) => {
				try {
					await compile(
						{
							target: getPath(addon[0]),
							output: getPath(addon[1]),
							mode: 'addon'
						},
						addon[1].split('/').pop()!
					);
				} catch (err) {
					log.error(err as string);
				}
			});
		}

		log.success('Built all files.');
	});

cli
	.command('dev')
	.describe('Watch the SRC folder for changes and autocompile them to the BetterDiscord themes folder.')
	.action(async () => {
		chokidar
			.watch(['src'], { usePolling: true })
			.on('ready', () => {
				log.info(`\nWatching: ${log.code('src')} folder.` + `\nOutput: ${log.code(CONFIG.dev.output)}\n`, 'DEV');
			})
			.on('change', async () => {
				// TODO: somehow reload the dev server.

				try {
					await compile(
						{
							target: getPath(CONFIG.dev.target),
							output: getPath(CONFIG.dev.output),
							mode: 'dev'
						},
						CONFIG.theme.file
					);
				} catch (err) {
					log.error(err as string);
				}
			});
	});

cli.parse(process.argv);
