export interface HistoryItem {
  id: string;
  filename: string;
  originalBase64: string;
  resultBase64: string;
  timestamp: number;
}

interface HistoryMetadata {
  id: string;
  filename: string;
  timestamp: number;
}

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

/**
 * Get the history metadata list from localStorage
 */
function getHistoryMetadata(): HistoryMetadata[] {
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
export async function getHistory(): Promise<HistoryItem[]> {
  const metadataList = getHistoryMetadata();
  const items: HistoryItem[] = [];
  for (const meta of metadataList) {
    try {
      const originalBase64 = await dbStore.get(`original_${meta.id}`);
      const resultBase64 = await dbStore.get(`result_${meta.id}`);
      if (originalBase64 && resultBase64) {
        items.push({
          id: meta.id,
          filename: meta.filename,
          timestamp: meta.timestamp,
          originalBase64,
          resultBase64,
        });
      }
    } catch (e) {
      console.error(`Failed to load images from IndexedDB for item ${meta.id}`, e);
    }
  }
  return items;
}

/**
 * Save a new item to history.
 */
export async function saveToHistory(item: Omit<HistoryItem, "timestamp">): Promise<HistoryItem[]> {
  const { id, filename, originalBase64, resultBase64 } = item;

  // 1. Save images to IndexedDB
  await dbStore.set(`original_${id}`, originalBase64);
  await dbStore.set(`result_${id}`, resultBase64);

  // 2. Save metadata to localStorage
  const timestamp = Date.now();
  const newMeta: HistoryMetadata = { id, filename, timestamp };
  let metadataList = getHistoryMetadata();
  metadataList = [newMeta, ...metadataList.filter((m) => m.id !== id)];

  localStorage.setItem("snapcut_history", JSON.stringify(metadataList));

  // 3. Return full history
  return getHistory();
}

/**
 * Delete a specific item from history by ID
 */
export async function deleteFromHistory(id: string): Promise<HistoryItem[]> {
  // 1. Delete from IndexedDB
  await dbStore.delete(`original_${id}`);
  await dbStore.delete(`result_${id}`);

  // 2. Delete metadata
  let metadataList = getHistoryMetadata();
  metadataList = metadataList.filter((m) => m.id !== id);
  localStorage.setItem("snapcut_history", JSON.stringify(metadataList));

  // 3. Return updated history
  return getHistory();
}

/**
 * Clear the entire history list
 */
export async function clearHistory(): Promise<void> {
  const metadataList = getHistoryMetadata();
  for (const meta of metadataList) {
    await dbStore.delete(`original_${meta.id}`);
    await dbStore.delete(`result_${meta.id}`);
  }
  localStorage.removeItem("snapcut_history");
}

export interface ActiveStateMetadata {
  filename: string | null;
  hasOriginal: boolean;
  hasResult: boolean;
}

/**
 * Save current active editor state
 */
export async function saveActiveState(state: ActiveState): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const metadata: ActiveStateMetadata = {
      filename: state.filename,
      hasOriginal: !!state.originalBase64,
      hasResult: !!state.result,
    };

    localStorage.setItem("snapcut_active_metadata", JSON.stringify(metadata));

    if (state.originalBase64) {
      await dbStore.set("active_original", state.originalBase64);
    } else {
      await dbStore.delete("active_original");
    }

    if (state.result?.resultUrl) {
      await dbStore.set("active_result_url", state.result.resultUrl);
    } else {
      await dbStore.delete("active_result_url");
    }
  } catch (e) {
    console.error("Failed to save active state.", e);
  }
}

/**
 * Retrieve active editor state
 */
export async function getActiveState(): Promise<ActiveState> {
  if (typeof window === "undefined") {
    return { filename: null, originalBase64: null, result: null };
  }

  const metaStr = localStorage.getItem("snapcut_active_metadata");
  if (!metaStr) {
    return { filename: null, originalBase64: null, result: null };
  }

  try {
    const metadata = JSON.parse(metaStr) as ActiveStateMetadata;
    const originalBase64 = metadata.hasOriginal ? await dbStore.get("active_original") : null;
    const resultUrl = metadata.hasResult ? await dbStore.get("active_result_url") : null;

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
 * Clear active editor state
 */
export async function clearActiveState(): Promise<void> {
  if (typeof window === "undefined") return;
  localStorage.removeItem("snapcut_active_metadata");
  await dbStore.delete("active_original");
  await dbStore.delete("active_result_url");
}
