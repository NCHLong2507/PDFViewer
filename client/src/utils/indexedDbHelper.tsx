import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "WebViewerCache";
const STORE_NAME = "Documents";

interface CachedDocument {
  id: string;
  fileBlob: Blob;
  timestamp: number;
}

type DBType = {
  [STORE_NAME]: CachedDocument;
};

export async function getDB(): Promise<IDBPDatabase<DBType>> {
  return openDB<DBType>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("timestamp", "timestamp");
      }
    },
  });
}

export async function saveToCache(id: string, fileBlob: Blob): Promise<void> {
  const db = await getDB();

  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  const count = await store.count();
  if (count >= 5) {
    const index = store.index("timestamp");
    const oldest = await index.openCursor();
    if (oldest) {
      await store.delete(oldest.primaryKey);
    }
  }
  await store.put({ id, fileBlob, timestamp: Date.now() });
  await tx.done;
}

export async function loadFromCache(id: string): Promise<Blob | null> {
  const db = await getDB();
  const entry = await db.get(STORE_NAME, id);
  if (entry) {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    await store.put({ ...entry, timestamp: Date.now() });
    await tx.done;

    return entry.fileBlob;
  }

  return null;
}

export async function clearCache(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}
