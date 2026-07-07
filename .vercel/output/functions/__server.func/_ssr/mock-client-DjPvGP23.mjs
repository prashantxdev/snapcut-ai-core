import { n as __exportAll$1 } from "../_runtime.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-gygkor6t.mjs";
import { i as TSS_SERVER_FUNCTION, u as createServerFn } from "./esm-DTf75a_C.mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mock-client-DjPvGP23.js
var mock_client_DjPvGP23_exports = /* @__PURE__ */ __exportAll$1({
	i: () => createSsrRpc,
	n: () => mockStorage,
	r: () => mock_client_exports,
	t: () => createMockSupabaseClient
});
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var mock_client_exports = /* @__PURE__ */ __exportAll({
	createMockSupabaseClient: () => createMockSupabaseClient,
	initMockCredits: () => initMockCredits,
	mockDb: () => mockDb,
	mockStorage: () => mockStorage,
	uploadMockFileServer: () => uploadMockFileServer
});
var globalForMock = globalThis;
if (!globalForMock.mockStorage) globalForMock.mockStorage = /* @__PURE__ */ new Map();
if (!globalForMock.mockDb) globalForMock.mockDb = {
	credits: [],
	uploads: []
};
var mockDb = globalForMock.mockDb;
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
function initMockCredits(userId) {
	if (!mockDb.credits.find((c) => c.user_id === userId)) mockDb.credits.push({
		user_id: userId,
		plan: "free",
		daily_used: 0,
		daily_limit: 5,
		pack_credits: 0,
		daily_reset_at: new Date(Date.now() + 1440 * 60 * 1e3).toISOString(),
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	});
}
var UploadInput = objectType({
	path: stringType(),
	base64: stringType(),
	contentType: stringType()
});
var uploadMockFileServer = createServerFn({ method: "POST" }).inputValidator((input) => UploadInput.parse(input)).handler(createSsrRpc("ea35dad639a0aba6c887239632283226f615f0ce2202414097081bbada637ea6"));
var MOCK_USER = {
	id: "00000000-0000-0000-0000-000000000000",
	email: "user@example.com",
	user_metadata: {},
	app_metadata: {},
	aud: "authenticated",
	created_at: (/* @__PURE__ */ new Date()).toISOString()
};
var MOCK_SESSION = {
	access_token: "mock-access-token",
	token_type: "bearer",
	expires_in: 3600,
	expires_at: Math.floor(Date.now() / 1e3) + 3600,
	refresh_token: "mock-refresh-token",
	user: MOCK_USER
};
var MockQueryBuilder = class {
	table;
	filters = {};
	orderByField;
	orderByAscending;
	limitCount;
	insertData;
	updateData;
	constructor(table) {
		this.table = table;
	}
	select(columns) {
		return this;
	}
	eq(column, value) {
		this.filters[column] = value;
		return this;
	}
	order(column, options) {
		this.orderByField = column;
		this.orderByAscending = options?.ascending ?? true;
		return this;
	}
	limit(count) {
		this.limitCount = count;
		return this;
	}
	insert(values) {
		this.insertData = values;
		return this;
	}
	update(values) {
		this.updateData = values;
		return this;
	}
	execute() {
		let dataList = mockDb[this.table] || [];
		if (this.insertData) return (Array.isArray(this.insertData) ? this.insertData : [this.insertData]).map((item) => {
			const newItem = {
				id: item.id || crypto.randomUUID?.() || Math.random().toString(36).substring(2, 12),
				created_at: (/* @__PURE__ */ new Date()).toISOString(),
				expires_at: new Date(Date.now() + 1440 * 60 * 1e3).toISOString(),
				...item
			};
			dataList.push(newItem);
			return newItem;
		});
		if (this.updateData) {
			const matched = dataList.filter((item) => {
				for (const [k, v] of Object.entries(this.filters)) if (item[k] !== v) return false;
				return true;
			});
			matched.forEach((item) => {
				Object.assign(item, this.updateData, { updated_at: (/* @__PURE__ */ new Date()).toISOString() });
			});
			return matched;
		}
		let filtered = dataList.filter((item) => {
			for (const [k, v] of Object.entries(this.filters)) if (item[k] !== v) return false;
			return true;
		});
		if (this.orderByField) {
			const field = this.orderByField;
			const asc = this.orderByAscending ? 1 : -1;
			filtered.sort((a, b) => {
				if (a[field] < b[field]) return -1 * asc;
				if (a[field] > b[field]) return 1 * asc;
				return 0;
			});
		}
		if (this.limitCount !== void 0) filtered = filtered.slice(0, this.limitCount);
		return JSON.parse(JSON.stringify(filtered));
	}
	async then(onfulfilled) {
		const result = {
			data: this.execute(),
			error: null
		};
		return onfulfilled ? onfulfilled(result) : result;
	}
	async maybeSingle() {
		const data = this.execute();
		return {
			data: data.length > 0 ? data[0] : null,
			error: null
		};
	}
	async single() {
		const data = this.execute();
		if (data.length === 0) return {
			data: null,
			error: { message: "Row not found in mock DB" }
		};
		return {
			data: data[0],
			error: null
		};
	}
};
function createMockSupabaseClient() {
	const getSessionFromStorage = () => {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("mock_supabase_session");
			if (stored) try {
				const session = JSON.parse(stored);
				initMockCredits(session.user.id);
				return session;
			} catch (_) {}
		}
		return null;
	};
	const getSessionUser = () => {
		const s = getSessionFromStorage();
		return s ? s.user : null;
	};
	return {
		auth: {
			signUp: async ({ email, password }) => {
				const user = {
					...MOCK_USER,
					id: "mock-user-" + Math.random().toString(36).substring(2, 10),
					email
				};
				const token = `mock-token:${user.id}`;
				const session = {
					...MOCK_SESSION,
					access_token: token,
					user
				};
				if (typeof window !== "undefined") localStorage.setItem("mock_supabase_session", JSON.stringify(session));
				initMockCredits(user.id);
				return {
					data: {
						user,
						session
					},
					error: null
				};
			},
			signInWithPassword: async ({ email, password }) => {
				const user = {
					...MOCK_USER,
					id: "mock-user-" + Math.random().toString(36).substring(2, 10),
					email
				};
				const token = `mock-token:${user.id}`;
				const session = {
					...MOCK_SESSION,
					access_token: token,
					user
				};
				if (typeof window !== "undefined") localStorage.setItem("mock_supabase_session", JSON.stringify(session));
				initMockCredits(user.id);
				return {
					data: {
						user,
						session
					},
					error: null
				};
			},
			getSession: async () => {
				return {
					data: { session: getSessionFromStorage() },
					error: null
				};
			},
			getUser: async () => {
				return {
					data: { user: getSessionUser() },
					error: null
				};
			},
			onAuthStateChange: (callback) => {
				const session = getSessionFromStorage();
				setTimeout(() => {
					callback("SIGNED_IN", session);
				}, 0);
				return { data: { subscription: { unsubscribe: () => {} } } };
			},
			signOut: async () => {
				if (typeof window !== "undefined") localStorage.removeItem("mock_supabase_session");
				return { error: null };
			},
			resetPasswordForEmail: async (email) => {
				return { error: null };
			},
			updateUser: async ({ password }) => {
				return { error: null };
			},
			getClaims: async (token) => {
				let userId = "mock-user-id";
				if (token && token.startsWith("mock-token:")) userId = token.split(":")[1];
				return {
					data: { claims: {
						sub: userId,
						email: "user@example.com",
						role: "authenticated"
					} },
					error: null
				};
			}
		},
		storage: { from: (bucket) => ({
			upload: async (path, file, options) => {
				if (typeof window !== "undefined") {
					const reader = new FileReader();
					const base64Promise = new Promise((resolve) => {
						reader.onloadend = () => {
							const base64String = reader.result.split(",")[1];
							resolve(base64String);
						};
					});
					reader.readAsDataURL(file);
					await uploadMockFileServer({ data: {
						path,
						base64: await base64Promise,
						contentType: file.type
					} });
				} else {
					let bytes;
					if (file instanceof Blob) bytes = new Uint8Array(await file.arrayBuffer());
					else bytes = file;
					await mockStorage.set(path, {
						bytes,
						contentType: options?.contentType || "application/octet-stream"
					});
				}
				return {
					data: { path },
					error: null
				};
			},
			download: async (path) => {
				const file = await mockStorage.get(path);
				if (!file) return {
					data: null,
					error: /* @__PURE__ */ new Error(`File not found: ${path}`)
				};
				return {
					data: new Blob([file.bytes], { type: file.contentType }),
					error: null
				};
			},
			createSignedUrl: async (path, expiry) => {
				return {
					data: { signedUrl: `/api/mock-storage/download?path=${encodeURIComponent(path)}` },
					error: null
				};
			}
		}) },
		from: (table) => {
			return new MockQueryBuilder(table);
		}
	};
}
//#endregion
export { mock_client_DjPvGP23_exports as i, createSsrRpc as n, mockStorage as r, createMockSupabaseClient as t };
