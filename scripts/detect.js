import fs from 'fs';
import os from 'os';
import {getCurrentDateTimeStringPath, readDataFile, writeDataFile} from "./utils.js";

const main = async () => {
	const configs = readDataFile('config.json');
	let hasNewFile = false;
	const data = [];
	for (const {id, url, notifyCondition, format, headers} of configs) {
		const result = await monitorFile(id, url, format, headers);
		if (result) {
			hasNewFile = true;
			if (notifyCondition) {
				const condition = `result.${notifyCondition}`;
				if (eval(condition)) {
					const msg = `id: ${id} content changed, condition: ${condition} match`;
					console.log(msg);
					data.push(msg);
				}
			}
		}
	}

	if (hasNewFile) {
		setOutput('new_file', true);
	}
	setOutput('data', data);
}

const monitorFile = async (id, url, format = false, headers = null) => {
	const options = headers ? {
		headers: headers
	} : null;
	const response = await fetch(url, options);
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
