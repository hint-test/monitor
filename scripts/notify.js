async function main() {
	const msg = process.env.msg;
	const notifyServer = process.env.notify_server;
	const notifyToken = process.env.notify_token;
	if (msg && notifyServer && notifyToken) {
		const text = JSON.parse(msg);

		const data = {
			payload: JSON.stringify({
				text
			}),
			token: notifyToken
		};

		const options = {
			method: 'POST',
			body: Object.entries(data).map(([key, value]) => `${key}=${value}`).join('&')
		};
		await fetch(`${notifyServer}/webapi/entry.cgi?api=SYNO.Chat.External&method=incoming&version=2`, options);
	} else {
		if (!notifyServer) console.log('notify_server required');
		if (!notifyToken) console.log('notify_token required');
		if (!msg) console.log('msg required');
	}
}

main();
