import fs from 'fs';
import {getCurrentDateTimeStringPath, readDataFile, writeDataFile} from "./utils.js";

const main = async () => {
	const { GITHUB_OUTPUT } = process.env;
	const filenameV3 = 'v3/feeds/1ad86f5a-c5d4-41de-89c0-2819b56fa01e/items';
	const filenameV4 = 'v4/feeds/1ad86f5a-c5d4-41de-89c0-2819b56fa01e/items';
	const resultV3 = await monitorFile(filenameV3);
	const resultV4 = await monitorFile(filenameV4);
	if (resultV3 !== null || resultV4 !== null) {
		fs.appendFileSync(GITHUB_OUTPUT, `new_file=1`);
	}
	if (resultV3 > 1) {
		fs.appendFileSync(GITHUB_OUTPUT, `data=${resultV3.length}`);
	} else if (resultV4 > 1) {
		fs.appendFileSync(GITHUB_OUTPUT, `data=${resultV4.length}`);
	}
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
			return newData.length;
		}
	} catch (error) {
		console.error('There was a problem with your fetch operation:', error);
	}

	return null;
}

main();
