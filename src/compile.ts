import { performance } from 'perf_hooks';
import * as sass from 'sass';
import { Processor } from 'postcss';
import autoprefixer from 'autoprefixer';
import fs from 'fs';
import { generateMeta, getConfig, osSlash, splitImports, parseAddon, generateImport } from './utils.js';
import { log } from './log.js';
import path from 'path';

class File {
	meta: string = '';
	base: string = '';
	imports: string[] = [];
	root: string = '';
	css: string = '';
}

const compileSCSS = (file: string, silent: boolean = false) => {
	if (!fs.existsSync(file)) {
		log.error(`Cannot find the file: ${log.code(file)}`);
	}

	if (!silent) log.info(`Building ${log.code(file)}...`);

	const css = sass.compile(file, {
		charset: false,
		loadPaths: ['node_modules']
	}).css;

	const postcss = new Processor([autoprefixer]).process(css);
	return postcss.css + '\n';
};

const writeToDisk = (name: string, file: string, dir: string) => {
	const dirPath = dir
		.split(osSlash)
		.filter((el) => !el.endsWith('.css'))
		.join(osSlash);

	// Check if path exists, if not make it.
	if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

	// Write file to disk.
	try {
		fs.writeFileSync(path.join(dirPath, name.replace(/ /g, '')), file);
	} catch (error) {
		log.error(error);
	}
};

const formatFile = (file: File) => {
	return file.meta + file.base + '\n\n' + file.imports.join('\n') + '\n\n' + file.root + '\n' + file.css;
};

export const compileDev = async () => {
	const date = new Date();
	const startTime = performance.now();
	const config = await getConfig();
	const name = config.meta.name + '.theme.css';
	let file = new File();

	file.meta = generateMeta(config.meta);
	file.root = compileSCSS(config.root, true);

	const mainFile = splitImports(compileSCSS(config.main, true));
	file.css += mainFile.css;
	file.imports.push(...mainFile.imports);

	if (config.imports.length > 0) {
		config.imports.forEach((imp) => {
			if (typeof imp === 'object' && imp.dev) {
				file.imports.push(`@import url('${imp.url.toLowerCase().replace(/ /g, '')}');`);
			}
		});
	}
	if (config.addons.length > 0) {
		config.addons.forEach((addon) => {
			const { target, dev } = parseAddon(addon);
			if (dev) {
				const addonFile = splitImports(compileSCSS(target, true));
				file.imports.push(...addonFile.imports);
				file.css += addonFile.css;
			}
		});
	}

	const result = formatFile(file);

	writeToDisk(name, result, config.betterdiscord.themeFolder);
	if (config.vencord.dev) writeToDisk(name, result, config.vencord.themeFolder);

	const endTime = performance.now();
	log.success(`${date.toLocaleTimeString()} / Built in ${(endTime - startTime).toFixed()}ms`);
};

export const compileDist = async () => {
	const startTime = performance.now();
	const config = await getConfig();

	// Theme.theme.css
	const distFile = new File();

	distFile.meta = generateMeta(config.meta);
	distFile.root = compileSCSS(config.root);
	distFile.base = generateImport(config, config.meta.name);

	if (config.imports.length > 0) {
		config.imports.forEach((imp) => {
			const url = typeof imp === 'string' ? imp : imp.url;
			distFile.imports.push(`@import url('${url}');`);
		});
	}
	if (config.addons.length > 0) {
		config.addons.forEach((addon) => {
			const { target, name, dist } = parseAddon(addon);
			const css = compileSCSS(target);
			if (dist) {
				const imp = generateImport(config, name);
				distFile.imports.push(imp);
			}
			writeToDisk(name + '.css', css, 'dist');
		});
	}

	writeToDisk(config.meta.name + '.theme.css', formatFile(distFile), 'dist');
	writeToDisk(config.meta.name + '.css', compileSCSS(config.main), 'dist');

	const endTime = performance.now();
	log.success(`Built in ${(endTime - startTime).toFixed()}ms`);
};
