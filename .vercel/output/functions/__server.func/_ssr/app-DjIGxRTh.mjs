import { i as __toESM } from "../_runtime.mjs";
import { u as createServerFn } from "./esm-DTf75a_C.mjs";
import { i as stringType, n as numberType, r as objectType, t as enumType } from "../_libs/zod.mjs";
import { n as createSsrRpc } from "./mock-client-DsyBJBK7.mjs";
import { t as supabase } from "./client-C9IS7_c_.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as cn, t as Button } from "./button-sQyoalR3.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { _ as CloudUpload, a as Sparkles, g as Download, h as Eye, i as Trash2, s as RotateCcw, u as LoaderCircle, v as Clock } from "../_libs/lucide-react.mjs";
import { n as useServerFn, t as AppShell } from "./AppShell-Czi7mmsj.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Oflpx3X0.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-DjIGxRTh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function v4() {
	const bytes = new Uint8Array(16);
	crypto.getRandomValues(bytes);
	bytes[6] = bytes[6] & 15 | 64;
	bytes[8] = bytes[8] & 63 | 128;
	const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
	return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}
var ProcessInput = objectType({
	uploadPath: stringType().min(1).max(512),
	originalFilename: stringType().min(1).max(256),
	originalSize: numberType().int().positive().max(10 * 1024 * 1024),
	contentType: enumType([
		"image/jpeg",
		"image/png",
		"image/webp"
	])
});
var processUpload = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => ProcessInput.parse(input)).handler(createSsrRpc("53c2e2345ccae48836475fc6df9583838d94686b3014a94c8c8d329392eb39a2"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ uploadId: stringType().uuid() }).parse(input)).handler(createSsrRpc("9753e6b707369a2d7ea7a4d916419f59db89acbe52dd78f4d537c62f8ee3ad2f"));
var ALLOWED = [
	"image/jpeg",
	"image/png",
	"image/webp"
];
var MAX_BYTES = 10 * 1024 * 1024;
function UploadDropzone({ onFile, disabled, busy, busyLabel }) {
	const inputRef = (0, import_react.useRef)(null);
	const [hover, setHover] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	function validateAndEmit(file) {
		setError(null);
		if (!ALLOWED.includes(file.type)) {
			setError("Unsupported format. Use JPG, PNG, or WEBP.");
			return;
		}
		if (file.size > MAX_BYTES) {
			setError("File too large. Max 10 MB.");
			return;
		}
		onFile(file);
	}
	function handleDrop(e) {
		e.preventDefault();
		setHover(false);
		if (disabled || busy) return;
		const file = e.dataTransfer.files?.[0];
		if (file) validateAndEmit(file);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onDragOver: (e) => {
				e.preventDefault();
				if (!disabled && !busy) setHover(true);
			},
			onDragLeave: () => setHover(false),
			onDrop: handleDrop,
			onClick: () => !busy && !disabled && inputRef.current?.click(),
			className: cn("glass relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-10 text-center transition-all", hover && "border-primary shadow-glow", (busy || disabled) && "cursor-not-allowed opacity-70"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				accept: ALLOWED.join(","),
				className: "hidden",
				onChange: (e) => {
					const f = e.target.files?.[0];
					if (f) validateAndEmit(f);
					e.target.value = "";
				}
			}), busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mb-3 h-10 w-10 animate-spin text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: busyLabel ?? "Processing…"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "This usually takes under 5 seconds."
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-7 w-7" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-base font-semibold",
					children: "Drop your image here"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						"or ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "browse"
						}),
						" — JPG, PNG, WEBP up to 10 MB"
					]
				})
			] })]
		}), error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "alert",
			className: "text-sm text-destructive",
			children: error
		})]
	});
}
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
var IndexedDBStore = class {
	dbName = "SnapCutStore";
	storeName = "images";
	db = null;
	async init() {
		if (this.db) return this.db;
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, 1);
			request.onupgradeneeded = () => {
				const db = request.result;
				if (!db.objectStoreNames.contains(this.storeName)) db.createObjectStore(this.storeName);
			};
			request.onsuccess = () => {
				this.db = request.result;
				resolve(request.result);
			};
			request.onerror = () => reject(request.error);
		});
	}
	async get(key) {
		const db = await this.init();
		return new Promise((resolve, reject) => {
			const request = db.transaction(this.storeName, "readonly").objectStore(this.storeName).get(key);
			request.onsuccess = () => resolve(request.result || null);
			request.onerror = () => reject(request.error);
		});
	}
	async set(key, value) {
		const db = await this.init();
		return new Promise((resolve, reject) => {
			const request = db.transaction(this.storeName, "readwrite").objectStore(this.storeName).put(value, key);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}
	async delete(key) {
		const db = await this.init();
		return new Promise((resolve, reject) => {
			const request = db.transaction(this.storeName, "readwrite").objectStore(this.storeName).delete(key);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}
	async clear() {
		const db = await this.init();
		return new Promise((resolve, reject) => {
			const request = db.transaction(this.storeName, "readwrite").objectStore(this.storeName).clear();
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}
};
var dbStore = new IndexedDBStore();
/**
* Convert a File or Blob object to a Base64-encoded Data URL
*/
function fileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}
/**
* Fetch a URL and convert the resulting resource to a Base64-encoded Data URL
*/
async function urlToBase64(url) {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Failed to fetch image for base64 conversion: ${response.statusText}`);
	return fileToBase64(await response.blob());
}
/**
* Convert a Base64 Data URL back into a standard File object
*/
function dataURLtoFile(dataurl, filename) {
	const arr = dataurl.split(",");
	const mimeMatch = arr[0].match(/:(.*?);/);
	const mime = mimeMatch ? mimeMatch[1] : "image/png";
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) u8arr[n] = bstr.charCodeAt(n);
	return new File([u8arr], filename, { type: mime });
}
/**
* Get the history metadata list from localStorage
*/
function getHistoryMetadata() {
	if (typeof window === "undefined") return [];
	const stored = localStorage.getItem("snapcut_history");
	if (!stored) return [];
	try {
		return JSON.parse(stored);
	} catch (e) {
		console.error("Failed to parse history from localStorage", e);
		return [];
	}
}
/**
* Get all history items with their images loaded from IndexedDB
*/
async function getHistory() {
	const metadataList = getHistoryMetadata();
	const items = [];
	for (const meta of metadataList) try {
		const originalBase64 = await dbStore.get(`original_${meta.id}`);
		const resultBase64 = await dbStore.get(`result_${meta.id}`);
		if (originalBase64 && resultBase64) items.push({
			id: meta.id,
			filename: meta.filename,
			timestamp: meta.timestamp,
			originalBase64,
			resultBase64
		});
	} catch (e) {
		console.error(`Failed to load images from IndexedDB for item ${meta.id}`, e);
	}
	return items;
}
/**
* Save a new item to history.
*/
async function saveToHistory(item) {
	const { id, filename, originalBase64, resultBase64 } = item;
	await dbStore.set(`original_${id}`, originalBase64);
	await dbStore.set(`result_${id}`, resultBase64);
	const newMeta = {
		id,
		filename,
		timestamp: Date.now()
	};
	let metadataList = getHistoryMetadata();
	metadataList = [newMeta, ...metadataList.filter((m) => m.id !== id)];
	localStorage.setItem("snapcut_history", JSON.stringify(metadataList));
	return getHistory();
}
/**
* Delete a specific item from history by ID
*/
async function deleteFromHistory(id) {
	await dbStore.delete(`original_${id}`);
	await dbStore.delete(`result_${id}`);
	let metadataList = getHistoryMetadata();
	metadataList = metadataList.filter((m) => m.id !== id);
	localStorage.setItem("snapcut_history", JSON.stringify(metadataList));
	return getHistory();
}
/**
* Clear the entire history list
*/
async function clearHistory() {
	const metadataList = getHistoryMetadata();
	for (const meta of metadataList) {
		await dbStore.delete(`original_${meta.id}`);
		await dbStore.delete(`result_${meta.id}`);
	}
	localStorage.removeItem("snapcut_history");
}
/**
* Save current active editor state
*/
async function saveActiveState(state) {
	if (typeof window === "undefined") return;
	try {
		const metadata = {
			filename: state.filename,
			hasOriginal: !!state.originalBase64,
			hasResult: !!state.result
		};
		localStorage.setItem("snapcut_active_metadata", JSON.stringify(metadata));
		if (state.originalBase64) await dbStore.set("active_original", state.originalBase64);
		else await dbStore.delete("active_original");
		if (state.result?.resultUrl) await dbStore.set("active_result_url", state.result.resultUrl);
		else await dbStore.delete("active_result_url");
	} catch (e) {
		console.error("Failed to save active state.", e);
	}
}
/**
* Retrieve active editor state
*/
async function getActiveState() {
	if (typeof window === "undefined") return {
		filename: null,
		originalBase64: null,
		result: null
	};
	const metaStr = localStorage.getItem("snapcut_active_metadata");
	if (!metaStr) return {
		filename: null,
		originalBase64: null,
		result: null
	};
	try {
		const metadata = JSON.parse(metaStr);
		const originalBase64 = metadata.hasOriginal ? await dbStore.get("active_original") : null;
		const resultUrl = metadata.hasResult ? await dbStore.get("active_result_url") : null;
		let result = null;
		if (resultUrl && metadata.filename && originalBase64) result = {
			originalUrl: originalBase64,
			resultUrl,
			filename: metadata.filename
		};
		return {
			filename: metadata.filename,
			originalBase64,
			result
		};
	} catch (e) {
		console.error("Failed to parse active result state", e);
		return {
			filename: null,
			originalBase64: null,
			result: null
		};
	}
}
/**
* Clear active editor state
*/
async function clearActiveState() {
	if (typeof window === "undefined") return;
	localStorage.removeItem("snapcut_active_metadata");
	await dbStore.delete("active_original");
	await dbStore.delete("active_result_url");
}
function WorkspacePage() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("editor");
	const [history, setHistory] = (0, import_react.useState)([]);
	const [result, setResult] = (0, import_react.useState)(null);
	const [selectedPreviewUrl, setSelectedPreviewUrl] = (0, import_react.useState)(null);
	const [selectedFile, setSelectedFile] = (0, import_react.useState)(null);
	const [verifying, setVerifying] = (0, import_react.useState)(false);
	const [verifyError, setVerifyError] = (0, import_react.useState)(null);
	const [imageLoaded, setImageLoaded] = (0, import_react.useState)(false);
	const [downloading, setDownloading] = (0, import_react.useState)(false);
	const process = useServerFn(processUpload);
	const queryClient = useQueryClient();
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			const loadSavedData = async () => {
				try {
					setHistory(await getHistory());
					const active = await getActiveState();
					if (active.result) setResult(active.result);
					if (active.originalBase64) {
						setSelectedPreviewUrl(active.originalBase64);
						if (active.filename) try {
							setSelectedFile(dataURLtoFile(active.originalBase64, active.filename));
						} catch (e) {
							console.error("Failed to restore selected file from active state", e);
						}
					}
				} catch (e) {
					console.error("Failed to load local storage state on mount:", e);
				}
			};
			loadSavedData();
		}
	}, []);
	(0, import_react.useEffect)(() => {
		saveActiveState({
			filename: selectedFile?.name || null,
			originalBase64: selectedPreviewUrl,
			result
		});
	}, [
		selectedFile,
		selectedPreviewUrl,
		result
	]);
	const mutation = useMutation({
		mutationFn: async (file) => {
			const { data: userData } = await supabase.auth.getUser();
			const userId = userData.user?.id;
			if (!userId) throw new Error("Not signed in");
			const ext = file.name.split(".").pop() || "bin";
			const path = `${userId}/${v4()}.${ext}`;
			const { error: upErr } = await supabase.storage.from("uploads").upload(path, file, {
				contentType: file.type,
				upsert: false
			});
			if (upErr) throw new Error(upErr.message);
			return {
				...await process({ data: {
					uploadPath: path,
					originalFilename: file.name,
					originalSize: file.size,
					contentType: file.type
				} }),
				filename: file.name
			};
		},
		onSuccess: async (data, file) => {
			console.log("API response:", data);
			console.log("Result URL:", data.resultUrl);
			const rawUrl = data.resultUrl;
			if (!rawUrl) {
				toast.error("No image URL returned from backend");
				return;
			}
			let finalUrl = rawUrl;
			if (finalUrl.startsWith("/")) {
				finalUrl = window.location.origin + finalUrl;
				console.log("Converted relative URL to absolute URL:", finalUrl);
			}
			console.log("Final processed image URL to load:", finalUrl);
			try {
				const originalBase64 = selectedPreviewUrl || await fileToBase64(file);
				const resultBase64 = await urlToBase64(finalUrl);
				const newResult = {
					originalUrl: originalBase64,
					resultUrl: resultBase64,
					filename: file.name
				};
				setHistory(await saveToHistory({
					id: data.uploadId || v4(),
					filename: file.name,
					originalBase64,
					resultBase64
				}));
				setResult(newResult);
				queryClient.invalidateQueries({ queryKey: ["dashboard"] });
				toast.success("Background removed!");
			} catch (err) {
				console.error("Failed to convert result image to base64", err);
				setResult({
					originalUrl: selectedPreviewUrl || "",
					resultUrl: finalUrl,
					filename: file.name
				});
				queryClient.invalidateQueries({ queryKey: ["dashboard"] });
				toast.success("Background removed!");
			}
		},
		onError: (err) => {
			toast.error(err instanceof Error ? err.message : "Processing failed");
		}
	});
	(0, import_react.useEffect)(() => {
		if (!result?.resultUrl) {
			setVerifying(false);
			setVerifyError(null);
			setImageLoaded(false);
			return;
		}
		if (result.resultUrl.startsWith("data:")) {
			setVerifying(false);
			setVerifyError(null);
			setImageLoaded(true);
			return;
		}
		let active = true;
		const verifyUrl = async () => {
			setVerifying(true);
			setVerifyError(null);
			setImageLoaded(false);
			console.log("Verifying image URL accessibility via fetch:", result.resultUrl);
			try {
				const response = await fetch(result.resultUrl);
				if (!active) return;
				console.log("Image fetch response status:", response.status);
				if (!response.ok) {
					if ([
						403,
						404,
						500
					].includes(response.status)) console.error(`Image request returned HTTP status code ${response.status}`);
					throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
				}
				const contentType = response.headers.get("content-type");
				console.log("Fetched image Content-Type:", contentType);
				if (!contentType || !contentType.startsWith("image/")) throw new Error(`Invalid content type: expected an image but received "${contentType}"`);
				const supportedTypes = [
					"image/png",
					"image/jpeg",
					"image/webp",
					"image/jpg"
				];
				const cleanType = contentType.split(";")[0].trim();
				if (!supportedTypes.includes(cleanType)) throw new Error(`Unsupported image type "${cleanType}". Must be PNG, JPEG, or WebP.`);
				setVerifying(false);
			} catch (err) {
				if (!active) return;
				console.error("Verification failed for image URL:", result.resultUrl, err);
				setVerifyError(err instanceof Error ? err.message : "Failed to load image");
				setVerifying(false);
			}
		};
		verifyUrl();
		return () => {
			active = false;
		};
	}, [result?.resultUrl]);
	const handleFileSelect = async (file) => {
		try {
			setSelectedFile(file);
			setSelectedPreviewUrl(await fileToBase64(file));
		} catch (e) {
			console.error("Failed to convert selected file to base64", e);
			toast.error("Failed to load selected image");
		}
	};
	async function handleDownload() {
		if (!result?.resultUrl) return;
		if (result.resultUrl.startsWith("data:")) {
			handleDownloadHistoryItem(result.filename, result.resultUrl);
			return;
		}
		setDownloading(true);
		console.log("Downloading image from URL:", result.resultUrl);
		try {
			const res = await fetch(result.resultUrl);
			if (!res.ok) throw new Error(`Download failed with status ${res.status}`);
			const blob = await res.blob();
			const blobUrl = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = blobUrl;
			link.download = result.filename.replace(/\.[^.]+$/, "") + "-snapcut.png";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(blobUrl);
			toast.success("Image downloaded!");
		} catch (err) {
			console.error("Download failed:", err);
			toast.error("Download failed. Please try again.");
		} finally {
			setDownloading(false);
		}
	}
	async function reset() {
		if (selectedPreviewUrl && !selectedPreviewUrl.startsWith("data:")) URL.revokeObjectURL(selectedPreviewUrl);
		setSelectedFile(null);
		setSelectedPreviewUrl(null);
		setResult(null);
		setVerifyError(null);
		setVerifying(false);
		setImageLoaded(false);
		await clearActiveState();
	}
	const handleDeleteHistoryItem = async (id, e) => {
		e.stopPropagation();
		setHistory(await deleteFromHistory(id));
		toast.success("Item deleted from history");
	};
	const handleClearHistory = async () => {
		if (confirm("Are you sure you want to clear all history? This cannot be undone.")) {
			await clearHistory();
			setHistory([]);
			toast.success("History cleared");
		}
	};
	const handleOpenHistoryItem = (item) => {
		try {
			setSelectedFile(dataURLtoFile(item.originalBase64, item.filename));
			setSelectedPreviewUrl(item.originalBase64);
			setResult({
				originalUrl: item.originalBase64,
				resultUrl: item.resultBase64,
				filename: item.filename
			});
			setActiveTab("editor");
			toast.success(`Loaded ${item.filename} into workspace`);
		} catch (e) {
			console.error(e);
			toast.error("Failed to load image from history");
		}
	};
	const handleDownloadHistoryItem = (filename, resultBase64, e) => {
		if (e) e.stopPropagation();
		const link = document.createElement("a");
		link.href = resultBase64;
		link.download = filename.replace(/\.[^.]+$/, "") + "-snapcut.png";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Image downloaded!");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-4 py-10 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Workspace"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Drop an image to get a transparent PNG. Max 10 MB, 5000×5000."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			value: activeTab,
			onValueChange: setActiveTab,
			className: "w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "mb-8 grid w-full max-w-[400px] grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "editor",
						children: "Remove Background"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "history",
						children: [
							"History (",
							history.length,
							")"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "editor",
					children: !selectedFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadDropzone, {
						onFile: handleFileSelect,
						busy: mutation.isPending,
						busyLabel: "Removing background…"
					}) : !result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto max-w-md",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass relative rounded-2xl p-3 shadow-glow-violet transition-all duration-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-2 text-xs font-medium text-muted-foreground",
									children: "Uploaded Image"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "checker-bg relative flex aspect-square items-center justify-center overflow-hidden rounded-xl",
									children: [selectedPreviewUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: selectedPreviewUrl,
										alt: "uploaded preview",
										className: "max-h-full max-w-full object-contain transition-transform hover:scale-105 duration-300"
									}), mutation.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm rounded-xl animate-in fade-in duration-300",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-10 w-10 animate-spin text-primary mb-2" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium",
												children: "Removing background…"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground mt-1",
												children: "This usually takes under 5 seconds."
											})
										]
									})]
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => mutation.mutate(selectedFile),
								disabled: mutation.isPending,
								className: "bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90 min-w-[180px] transition-all",
								children: mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Processing..."] }) : "Remove Background"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: reset,
								disabled: mutation.isPending,
								children: "Cancel"
							})]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass rounded-2xl p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-2 text-xs font-medium text-muted-foreground",
									children: "Original"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "checker-bg flex aspect-square items-center justify-center overflow-hidden rounded-xl",
									children: selectedPreviewUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: selectedPreviewUrl,
										alt: "original",
										className: "max-h-full max-w-full object-contain"
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass rounded-2xl p-3 shadow-glow",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-2 text-xs font-medium text-muted-foreground",
									children: "Result"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "checker-bg relative flex aspect-square items-center justify-center overflow-hidden rounded-xl w-full h-full",
									children: [
										(verifying || !imageLoaded && !verifyError) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-medium text-muted-foreground",
												children: verifying ? "Verifying image..." : "Loading image..."
											})]
										}),
										verifyError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4 text-center rounded-xl animate-in fade-in duration-200",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500 font-semibold mb-1 text-sm",
												children: "Error Loading Image"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground max-w-xs",
												children: verifyError
											})]
										}),
										result.resultUrl && !verifyError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: result.resultUrl,
											alt: "result",
											className: `max-h-full max-w-full object-contain transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`,
											onLoad: () => {
												console.log("Image tag loaded successfully for URL:", result.resultUrl);
												setImageLoaded(true);
											},
											onError: (e) => {
												console.error("Image element failed to load for URL:", result.resultUrl);
												setVerifyError("Image element failed to render. Please verify backend state.");
											}
										})
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleDownload,
								disabled: downloading || verifying || !!verifyError,
								className: "bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90 min-w-[150px]",
								children: downloading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1 h-4 w-4 animate-spin" }), " Downloading..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), " Download PNG"] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: reset,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-1 h-4 w-4" }), " Process another"]
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "history",
					className: "space-y-6 animate-in fade-in duration-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: "Saved Images"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Saved locally in your browser. Cleared automatically if storage runs low."
						})] }), history.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: handleClearHistory,
							className: "text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1 h-4 w-4" }), " Clear History"]
						})]
					}), history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass flex flex-col items-center rounded-2xl p-12 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-lg",
								children: "No processed images"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground max-w-sm",
								children: "Upload and process images to see them saved in your local history tab."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => setActiveTab("editor"),
								className: "mt-6 bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-2 h-4 w-4" }), " Start Removing Backgrounds"]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
						children: history.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass group relative overflow-hidden rounded-2xl border border-border/50 shadow-sm transition-all duration-300 hover:shadow-glow-violet/20 hover:border-primary/20 flex flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "checker-bg relative aspect-square flex items-center justify-center overflow-hidden rounded-t-xl bg-muted/20 border-b border-border/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.resultBase64,
									alt: item.filename,
									className: "max-h-[90%] max-w-[90%] object-contain transition-transform duration-300 group-hover:scale-105",
									loading: "lazy"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-0 bg-background/70 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "secondary",
											onClick: () => handleOpenHistoryItem(item),
											title: "Open in Workspace",
											className: "h-10 w-10 rounded-full shadow-md cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "secondary",
											onClick: (e) => handleDownloadHistoryItem(item.filename, item.resultBase64, e),
											title: "Download PNG",
											className: "h-10 w-10 rounded-full shadow-md cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "secondary",
											onClick: (e) => handleDeleteHistoryItem(item.id, e),
											title: "Delete",
											className: "h-10 w-10 rounded-full shadow-md cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-all duration-200",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 flex-1 flex flex-col justify-between",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-medium text-sm text-foreground",
										title: item.filename,
										children: item.filename
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground mt-1 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), new Date(item.timestamp).toLocaleString(void 0, {
											month: "short",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit"
										})]
									})]
								})
							})]
						}, item.id))
					})]
				})
			]
		})]
	}) });
}
//#endregion
export { WorkspacePage as component };
