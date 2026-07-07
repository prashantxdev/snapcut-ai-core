//#region node_modules/.nitro/vite/services/ssr/assets/bg-removal.server-DpMf-c-q.js
async function removeBackground(input) {
	const res = await fetch("https://prashantxdev.app.n8n.cloud/webhook/remove-background", {
		method: "POST",
		headers: { "Content-Type": input.contentType },
		body: new Blob([input.bytes])
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Webhook error ${res.status}: ${text.slice(0, 300)}`);
	}
	const data = await res.json();
	if (!data.url) throw new Error("Webhook response did not contain a result URL.");
	const imgRes = await fetch(data.url);
	if (!imgRes.ok) throw new Error(`Failed to fetch processed image from URL: ${data.url}`);
	return {
		bytes: new Uint8Array(await imgRes.arrayBuffer()),
		contentType: imgRes.headers.get("Content-Type") || "image/png"
	};
}
//#endregion
export { removeBackground };
