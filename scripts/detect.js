import fs from 'fs';
import os from 'os';
import {getCurrentDateTimeStringPath, readDataFile, writeDataFile} from "./utils.js";

const main = async () => {
	const configs = readDataFile('config.json');
	let hasNewFile = false;
	const data = [];
	for (const {id, url, notifyCondition, format} of configs) {
		const result = await monitorFile(id, url, format);
		if (result) {
			hasNewFile = true;
			const condition = `result.${notifyCondition}`;
			if (eval(condition)) {
				console.log(`condition: ${condition} match`);
				data.push(`condition: ${condition} match`);
			}
		}
	}

	if (hasNewFile) {
		setOutput('new_file', true);
	}
	setOutput('data', data);
}

const monitorFile = async (id, url, format = false) => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}

	try {
		const newData = await response.json();
		const folderName = id.replace(/\//g, '_');
		const currentFile = `${folderName}/current.json`;
		const previousData = readDataFile(currentFile, 'utf8');
		if (JSON.stringify(previousData) !== JSON.stringify(newData)) {
			const timestampPath = getCurrentDateTimeStringPath();
			writeDataFile(currentFile, JSON.stringify(newData, null, format ? '\t' : null));
			writeDataFile(`${folderName}/${timestampPath}`, JSON.stringify(newData, null, format ? '\t' : null));
			return newData;
		}
	} catch (error) {
		console.error('There was a problem with your fetch operation:', error);
	}

	return null;
}

const setOutput = (key, value) => {
	const output = process.env['GITHUB_OUTPUT']
	fs.appendFileSync(output, `${key}=${JSON.stringify(value)}${os.EOL}`)
}

main();
