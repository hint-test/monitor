async function main() {
	if (process.env.msg && process.env.notify_server && process.env.notify_token) {
		const text = JSON.parse(process.env.msg);

		const data = {
			payload: JSON.stringify({
				text
			}),
			token: process.env.notify_token
		};

		const options = {
			method: 'POST',
			body: Object.entries(data).map(([key, value]) => `${key}=${value}`).join('&')
		};
		await fetch(`${process.env.notify_server}/webapi/entry.cgi?api=SYNO.Chat.External&method=incoming&version=2`, options);
	} else {
		if (!process.env.notify_server) console.log('notify_server required');
		if (!process.env.notify_token) console.log('notify_token required');
		if (!process.env.msg) console.log('msg required');
	}
}

main();
