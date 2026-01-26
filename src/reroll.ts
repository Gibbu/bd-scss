//
// Shamelessly yoinked from: https://github.com/DiscordStyles/SoftX/pull/163
// Massive thanks to https://github.com/Eir-nya for the amazing PR! <3
//

import fs from 'fs';
import path from 'path';
import { log } from './log.js';
import { osSlash } from './utils.js';

const SRC_FOLDER = path.join(process.cwd(), 'src');
const CLASSLIST_URL = 'https://raw.githubusercontent.com/SyndiShanX/Update-Classes/main/Changes.txt';
const REGEX_CHANGES = 'https://syndishanx.github.io/Update-Classes/Regex_Changes.txt';

const fetchList = async (url: string) => {
	const req = await fetch(url);
	return await req.text();
};

export const reroll = async (): Promise<{ classesChanged: number; filesChanged: string[] }> => {
	try {
		const chanagesList = await fetchList(CLASSLIST_URL);
		const regexList = await fetchList(REGEX_CHANGES);

		const changesSplit = chanagesList.split('\n');
		const regexSplit = regexList.split('\n');

		const changesNum = changesSplit.length - 1;

		let classesChanged = 0;
		let filesChanged: string[] = [];

		function updateFile(file: string) {
			let regexReplaced = false;
			for (let x = 0; x < regexSplit.length; x++) {
				if (file.includes(regexSplit[x])) {
					file = file.replace(/\.([_0-9a-f]{6})[0-9a-f]{10,11}-([A-Za-z0-9_\-]+)/g, '.$2_$1');
					regexReplaced = true;
				}
			}

			if (!regexReplaced) {
				let i = 0;
				while (i < changesNum) {
					let class1 = changesSplit[i].split('\r')[0];
					let class2 = changesSplit[i + 1].split('\r')[0];

					file = file.replaceAll(class1, class2);

					i = i + 2;
				}
			}

			return file;
		}

		const allFiles = fs.readdirSync(SRC_FOLDER, { withFileTypes: true, recursive: true }).filter((d) => !d.isDirectory());

		allFiles.forEach((file) => {
			if (!file.name.startsWith('_')) return;

			const filePath = path.join(file.parentPath, file.name);
			const oldFile = fs.readFileSync(filePath).toString();
			const newFile = updateFile(oldFile);

			if (oldFile !== newFile) filesChanged.push(`${file.parentPath.split(osSlash).at(-1)}/${file.name}`);

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
