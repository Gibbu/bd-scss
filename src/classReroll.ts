//
// Shamelessly yoinked from: https://github.com/DiscordStyles/SoftX/pull/163
// Massive thanks to https://github.com/Eir-nya for the amazing PR! <3
//

import fs from 'fs';
import path from 'path';
import { log } from './log.js';
import { getSlash } from './utils.js';

const SRC = path.join(process.cwd(), 'src');
const CLASSLIST_URL = 'https://raw.githubusercontent.com/SyndiShanX/Update-Classes/main/Changes.txt';

export const classReroll = async (): Promise<{ classesChanged: number; filesChanged: string[] }> => {
	try {
		const request = await fetch(CLASSLIST_URL);
		const classList = await request.text();
		const listLength = classList.split('\n').length - 1;
		const changesSplit = classList.split('\n');
		let classesChanged = 0;
		let filesChanged: string[] = [];

		function updateFile(file: string) {
			let i = 0;
			while (i < listLength) {
				const oldClass = changesSplit[i].split('\r')[0];
				const newClass = changesSplit[i + 1].split('\r')[0];
				if (file.includes(oldClass)) {
					file = file.replaceAll(oldClass, newClass);
					classesChanged++;
				}
				i = i + 2;
			}
			return file;
		}

		const allFiles = fs.readdirSync(SRC, { withFileTypes: true, recursive: true }).filter((d) => !d.isDirectory());

		allFiles.forEach((file) => {
			if (!file.name.startsWith('_')) return;

			const filePath = path.join(file.parentPath, file.name);
			const oldFile = fs.readFileSync(filePath).toString();
			const newFile = updateFile(oldFile);

			if (oldFile !== newFile) filesChanged.push(`${file.parentPath.split(getSlash).at(-1)}/${file.name}`);

			fs.writeFileSync(filePath, newFile);
		});

		return {
			classesChanged,
			filesChanged
		};
	} catch (err) {
		log.error(['Something went wrong.', err]);
		return {
			classesChanged: 0,
			filesChanged: []
		};
	}
};
