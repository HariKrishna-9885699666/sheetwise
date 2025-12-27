/**
 * IndexedDB utilities for caching transactions
 * 
 * This module provides caching functionality for transaction data to improve performance
 * and reduce API calls to Google Sheets. The cache is automatically invalidated when
 * transactions are added, updated, or deleted.
 * 
 * Cache Strategy:
 * - When global search is opened, all months' data is loaded from Google Sheets
 * - Data is cached in IndexedDB for subsequent searches
 * - Cache is invalidated on any transaction modification (add/update/delete)
 * - Next search will use cached data until invalidated
 */

const DB_NAME = 'sheetwise-db';
const DB_VERSION = 1;
const STORE_NAME = 'transactions';

interface CacheEntry {
  key: string;
  data: any;
  timestamp: number;
}

// Open or create the database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
}

// Save data to IndexedDB
export async function saveCacheData(key: string, data: any): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const cacheEntry: CacheEntry = {
      key,
      data,
      timestamp: Date.now(),
    };

    store.put(cacheEntry);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
      transaction.onerror = () => {
        db.close();
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error('Failed to save to IndexedDB:', error);
  }
}

// Get data from IndexedDB
export async function getCacheData(key: string): Promise<any | null> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        db.close();
        const result = request.result as CacheEntry | undefined;
        resolve(result ? result.data : null);
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to read from IndexedDB:', error);
    return null;
  }
}

// Clear all cached data
export async function clearCache(): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.clear();

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
      transaction.onerror = () => {
        db.close();
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error('Failed to clear IndexedDB:', error);
  }
}

// Delete specific cache entry
export async function deleteCacheEntry(key: string): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(key);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
      transaction.onerror = () => {
        db.close();
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error('Failed to delete from IndexedDB:', error);
  }
}

// Cache keys
export const CACHE_KEYS = {
  ALL_MONTHS: 'all-months-transactions',
};
