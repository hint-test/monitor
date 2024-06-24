import fs from 'fs';
import os from 'os';
import {areJsonEqual, getCurrentDateTimeStringPath, readDataFile, writeDataFile} from "./utils.js";

const main = async () => {
	const configs = readDataFile('config.json');
	let hasNewFile = false;
	const data = [];
	for (const {id, url, options, format, filters, condition, notify, notifyCondition} of configs) {
		const result = await monitorFile(id, url, options, format, filters, condition);
		if (result) {
			hasNewFile = true;
			if (notify || notifyCondition) {
				if (!notifyCondition || eval(`result.${notifyCondition}`)) {
					const msg = `id: ${id} content changed, condition: ${notifyCondition || true} match`;
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

/**
 * 比较新数据和老数据, 仅当条件满足且内容变化时, 才保存新数据.
 * @param id 需要存储的目录名
 * @param url 需要匹配的目标URL
 * @param options fetch options
 * @param format 是否对JSON格式化, 方便查看.
 * @param filters 字符串数组类型, 过滤特定字段. 比如设置`['referees']`, 过滤掉你不关心的`referees`字段.
 * @param condition 需满足的额外条件. 比如设置`length`, 则即便内容有变化, 也还需要length变化时, 才存储.
 * @returns {Promise<any|null>}
 */
const monitorFile = async (id, url, options = null, format = false, filters = null, condition = null) => {
	const response = options ? await fetch(url, options) : await fetch(url);
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}

	try {
		const newData = await response.json();
		const folderName = id.replace(/\//g, '_');
		const currentFile = `${folderName}/current.json`;
		const previousData = readDataFile(currentFile, 'utf8');
		if (!areJsonEqual(newData, previousData, filters) && (!condition || (eval(`newData.${condition}`) !== eval(`previousData.${condition}`)))) {
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
