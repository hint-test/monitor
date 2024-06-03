import fs from 'fs';

const main = async () => {
	const { GITHUB_OUTPUT } = process.env;
	const url = 'https://ottapp-appgw-client-a.proda.msn.tv3cloud.com/S1/discovery/v3/feeds/1ad86f5a-c5d4-41de-89c0-2819b56fa01e/items?$groups=4000000,4000001,1027&storeId=HubsAndFeeds-Main';
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}

	try {
		const jsonData = await response.json();
		fs.appendFileSync(GITHUB_OUTPUT, `data=${jsonData.length}`);
 	} catch (error) {
		console.error('There was a problem with your fetch operation:', error);
	}
}

main();
