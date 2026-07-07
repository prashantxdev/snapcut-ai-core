import { u as createServerFn } from "./esm-DTf75a_C.mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-CMkeCIdM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mock-client-DcELw6sg.js
var globalForMock = globalThis;
if (!globalForMock.mockStorage) globalForMock.mockStorage = /* @__PURE__ */ new Map();
if (!globalForMock.mockDb) globalForMock.mockDb = {
	credits: [],
	uploads: []
};
globalForMock.mockDb;
var mockStorage = {
	async set(key, value) {
		if (typeof window === "undefined") {
			const { writeMockFile } = await import("./mock-storage.server-C4uom9Jn.mjs");
			await writeMockFile(key, value.bytes, value.contentType);
		} else globalForMock.mockStorage.set(key, value);
	},
	async get(key) {
		if (typeof window === "undefined") {
			const { readMockFile } = await import("./mock-storage.server-C4uom9Jn.mjs");
			return await readMockFile(key);
		} else return globalForMock.mockStorage.get(key) || null;
	}
};
var UploadInput = objectType({
	path: stringType(),
	base64: stringType(),
	contentType: stringType()
});
var uploadMockFileServer_createServerFn_handler = createServerRpc({
	id: "ea35dad639a0aba6c887239632283226f615f0ce2202414097081bbada637ea6",
	name: "uploadMockFileServer",
	filename: "src/integrations/supabase/mock-client.ts"
}, (opts) => uploadMockFileServer.__executeServer(opts));
var uploadMockFileServer = createServerFn({ method: "POST" }).inputValidator((input) => UploadInput.parse(input)).handler(uploadMockFileServer_createServerFn_handler, async ({ data }) => {
	const binaryString = atob(data.base64);
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
	await mockStorage.set(data.path, {
		bytes,
		contentType: data.contentType
	});
	return { success: true };
});
//#endregion
export { uploadMockFileServer_createServerFn_handler };
