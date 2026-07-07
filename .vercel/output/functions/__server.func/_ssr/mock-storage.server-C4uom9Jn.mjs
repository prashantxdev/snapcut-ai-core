import * as fs from "fs/promises";
import * as path from "path";
//#region node_modules/.nitro/vite/services/ssr/assets/mock-storage.server-C4uom9Jn.js
var STORAGE_DIR = path.resolve(process.cwd(), ".tanstack/tmp/mock-storage");
async function ensureDir() {
	await fs.mkdir(STORAGE_DIR, { recursive: true });
}
async function writeMockFile(filePath, bytes, contentType) {
	await ensureDir();
	const safeName = filePath.replace(/[^a-zA-Z0-9.-]/g, "_");
	const diskPath = path.join(STORAGE_DIR, safeName);
	const metaPath = `${diskPath}.json`;
	await fs.writeFile(diskPath, bytes);
	await fs.writeFile(metaPath, JSON.stringify({ contentType }), "utf-8");
}
async function readMockFile(filePath) {
	try {
		const safeName = filePath.replace(/[^a-zA-Z0-9.-]/g, "_");
		const diskPath = path.join(STORAGE_DIR, safeName);
		const metaPath = `${diskPath}.json`;
		const bytes = await fs.readFile(diskPath);
		const metaStr = await fs.readFile(metaPath, "utf-8");
		const { contentType } = JSON.parse(metaStr);
		return {
			bytes: new Uint8Array(bytes),
			contentType
		};
	} catch (error) {
		return null;
	}
}
//#endregion
export { readMockFile, writeMockFile };
