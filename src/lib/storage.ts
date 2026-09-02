export {
  fetchUserHistory,
  deleteUserHistoryItem,
  clearUserHistory,
} from "./history.functions";
export type { HistoryItem } from "./history.functions";

export interface ActiveState {
  filename: string | null;
  originalBase64: string | null;
  result: {
    originalUrl: string;
    resultUrl: string;
    filename: string;
  } | null;
}

class IndexedDBStore {
  private dbName = "SnapCutStore";
  private storeName = "images";
  private db: IDBDatabase | null = null;

  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async get(key: string): Promise<string | null> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async set(key: string, value: string): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(key: string): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const dbStore = new IndexedDBStore();

/**
 * Helper to get a user-scoped storage key
 */
function getStorageKey(baseKey: string, userId?: string | null): string {
  const safeId = userId || "guest";
  return `${baseKey}_${safeId}`;
}

/**
 * Helper to get a user-scoped IndexedDB key prefix
 */
function getDbKey(prefix: string, id: string, userId?: string | null): string {
  const safeId = userId || "guest";
  return `${prefix}_${safeId}_${id}`;
}

/**
 * Convert a File or Blob object to a Base64-encoded Data URL
 */
export function fileToBase64(file: Blob | File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Fetch a URL and convert the resulting resource to a Base64-encoded Data URL
 */
export async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image for base64 conversion: ${response.statusText}`);
  }
  const blob = await response.blob();
  return fileToBase64(blob);
}

/**
 * Convert a Base64 Data URL back into a standard File object
 */
export function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export interface ActiveStateMetadata {
  filename: string | null;
  hasOriginal: boolean;
  hasResult: boolean;
}

/**
 * Save current active editor state strictly scoped to a specific user
 */
export async function saveActiveState(state: ActiveState, userId?: string | null): Promise<void> {
  if (typeof window === "undefined" || !userId) return;
  try {
    const metadata: ActiveStateMetadata = {
      filename: state.filename,
      hasOriginal: !!state.originalBase64,
      hasResult: !!state.result,
    };

    const metaKey = getStorageKey("snapcut_active_metadata", userId);
    localStorage.setItem(metaKey, JSON.stringify(metadata));

    const origKey = getDbKey("active", "original", userId);
    const resKey = getDbKey("active", "result_url", userId);

    if (state.originalBase64) {
      await dbStore.set(origKey, state.originalBase64);
    } else {
      await dbStore.delete(origKey);
    }

    if (state.result?.resultUrl) {
      await dbStore.set(resKey, state.result.resultUrl);
    } else {
      await dbStore.delete(resKey);
    }
  } catch (e) {
    console.error("Failed to save active state.", e);
  }
}

/**
 * Retrieve active editor state strictly scoped to a specific user
 */
export async function getActiveState(userId?: string | null): Promise<ActiveState> {
  if (typeof window === "undefined" || !userId) {
    return { filename: null, originalBase64: null, result: null };
  }

  const metaKey = getStorageKey("snapcut_active_metadata", userId);
  const metaStr = localStorage.getItem(metaKey);
  if (!metaStr) {
    return { filename: null, originalBase64: null, result: null };
  }

  try {
    const metadata = JSON.parse(metaStr) as ActiveStateMetadata;
    const origKey = getDbKey("active", "original", userId);
    const resKey = getDbKey("active", "result_url", userId);

    const originalBase64 = metadata.hasOriginal ? await dbStore.get(origKey) : null;
    const resultUrl = metadata.hasResult ? await dbStore.get(resKey) : null;

    let result = null;
    if (resultUrl && metadata.filename && originalBase64) {
      result = {
        originalUrl: originalBase64,
        resultUrl: resultUrl,
        filename: metadata.filename,
      };
    }

    return {
      filename: metadata.filename,
      originalBase64,
      result,
    };
  } catch (e) {
    console.error("Failed to parse active result state", e);
    return { filename: null, originalBase64: null, result: null };
  }
}

/**
 * Clear active editor state for a specific user
 */
export async function clearActiveState(userId?: string | null): Promise<void> {
  if (typeof window === "undefined" || !userId) return;
  const metaKey = getStorageKey("snapcut_active_metadata", userId);
  localStorage.removeItem(metaKey);
  await dbStore.delete(getDbKey("active", "original", userId));
  await dbStore.delete(getDbKey("active", "result_url", userId));
}
