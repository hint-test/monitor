// ./scripts/utils.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Needed to get __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const writeDataFile = (relativeFilePath, data) => {
	try {
		// Resolve the file path relative to the ./data/ directory
		const dataDir = path.resolve(__dirname, '../data'); // Adjust as necessary to get the data directory
		const filePath = path.join(dataDir, relativeFilePath);

		// Ensure the directory exists
		const dir = path.dirname(filePath);
		fs.mkdirSync(dir, { recursive: true });

		// Write the file
		fs.writeFileSync(filePath, data, 'utf8');

		console.log('File created successfully');
	} catch (error) {
		console.error('Error writing file', error);
	}
};

export const readDataFile = (relativeFilePath) => {
	// Resolve the file path relative to the ./data/ directory
	const dataDir = path.resolve(__dirname, '../data'); // Adjust as necessary to get the data directory
	const filePath = path.join(dataDir, relativeFilePath);

	try {
		const data = fs.readFileSync(filePath, 'utf8');
		return JSON.parse(data);
	} catch (error) {
		// If the file doesn't exist or is empty, return an empty object
		return {};
	}
};

export const getCurrentDateTimeStringPath = () => {
	const now = new Date();

	const year = now.getFullYear().toString();
	const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');

	return `${year}/${month}/${day}/${hours}${minutes}.json`;
}

