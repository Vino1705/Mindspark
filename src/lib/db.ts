'use client';

const DB_NAME = 'MindSparkDB';
const DB_VERSION = 1;
const DRAFTS_STORE = 'drafts';

export interface Draft {
  id: number;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('IndexedDB not available in this environment.'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(DRAFTS_STORE)) {
        db.createObjectStore(DRAFTS_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };
  });
}

export async function addDraft(
  draft: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'>
): Promise<IDBValidKey> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DRAFTS_STORE, 'readwrite');
    const store = transaction.objectStore(DRAFTS_STORE);
    const newDraft = {
      ...draft,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const request = store.add(newDraft);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getDrafts(): Promise<Draft[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DRAFTS_STORE, 'readonly');
    const store = transaction.objectStore(DRAFTS_STORE);
    const request = store.getAll();

    request.onsuccess = () =>
      resolve(request.result.sort((a, b) => b.updatedAt - a.updatedAt));
    request.onerror = () => reject(request.error);
  });
}

export async function getDraft(id: number): Promise<Draft | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DRAFTS_STORE, 'readonly');
    const store = transaction.objectStore(DRAFTS_STORE);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function updateDraft(draft: Draft): Promise<IDBValidKey> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DRAFTS_STORE, 'readwrite');
    const store = transaction.objectStore(DRAFTS_STORE);
    const updatedDraft = {...draft, updatedAt: Date.now()};
    const request = store.put(updatedDraft);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteDraft(id: number): Promise<void> {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(DRAFTS_STORE, 'readwrite');
    const store = transaction.objectStore(DRAFTS_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteAllDrafts(): Promise<void> {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(DRAFTS_STORE, 'readwrite');
    const store = transaction.objectStore(DRAFTS_STORE);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
