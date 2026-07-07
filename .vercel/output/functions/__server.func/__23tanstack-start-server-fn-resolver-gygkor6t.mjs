//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-gygkor6t.js
var manifest = {
	"367b32358181f96a433e5e7716daa74b5dbcf69e0677716fe7be918df41797ef": {
		functionName: "getDashboard_createServerFn_handler",
		importer: () => import("./_ssr/dashboard.functions-uq30pLCY.mjs")
	},
	"53c2e2345ccae48836475fc6df9583838d94686b3014a94c8c8d329392eb39a2": {
		functionName: "processUpload_createServerFn_handler",
		importer: () => import("./_ssr/processing.functions-BVM3o6n0.mjs")
	},
	"9753e6b707369a2d7ea7a4d916419f59db89acbe52dd78f4d537c62f8ee3ad2f": {
		functionName: "getResultSignedUrl_createServerFn_handler",
		importer: () => import("./_ssr/processing.functions-BVM3o6n0.mjs")
	},
	"ea35dad639a0aba6c887239632283226f615f0ce2202414097081bbada637ea6": {
		functionName: "uploadMockFileServer_createServerFn_handler",
		importer: () => import("./_ssr/mock-client-DcELw6sg.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
