import fs from 'fs';
import os from 'os';
import {getCurrentDateTimeStringPath, readDataFile, writeDataFile} from "./utils.js";

const main = async () => {
	const filenameV3 = 'v3/feeds/335e0ae8-1354-4062-90c5-3ecec351bda4/items';
	const filenameV4 = 'v4/feeds/335e0ae8-1354-4062-90c5-3ecec351bda4/items';
	const resultV3 = await monitorFile(filenameV3);
	const resultV4 = await monitorFile(filenameV4);

	if (resultV3 !== null || resultV4 !== null) {
		console.log('new files found');
		setOutput('new_file', 1);
	}
	const result = [];
	if (resultV3 !== null && resultV3.length > 1) {
		console.log(`resultV3 length=${resultV3.length}`);
		result.push(`resultV3 length=${resultV3.length}`);
	}
	if (resultV4 !== null && resultV4.Items.length > 1) {
		console.log(`resultV4 length=${resultV4.Items.length}`);
		result.push(`resultV4 length=${resultV4.Items.length}`);
	}
	setOutput('data', result);
}

const monitorFile = async (filename) => {
	const server = 'https://ottapp-appgw-client-a.proda.msn.tv3cloud.com/S1/discovery/';
	const url = `${server}${filename}?$groups=4000000,4000001,1027&storeId=HubsAndFeeds-Main`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}

	try {
		const newData = await response.json();
		const currentFile = `${filename.replace(/\//g, '_')}/current.json`;
		const previousData = readDataFile(currentFile, 'utf8');
		if (JSON.stringify(previousData) !== JSON.stringify(newData)) {
			const timestamp = getCurrentDateTimeStringPath();
			writeDataFile(currentFile, JSON.stringify(newData));
			writeDataFile(`${filename.replace(/\//g, '_')}/${timestamp}`, JSON.stringify(newData));
			return newData;
		}
	} catch (error) {
		console.error('There was a problem with your fetch operation:', error);
	}

	return null;
}

const setOutput = (key, value) => {
	const output = process.env['GITHUB_OUTPUT']
	fs.appendFileSync(output, `${key}=${value}${os.EOL}`)
}

main();
