import '@testing-library/jest-dom'

// Vitest runs in Node by default; when using jsdom we still need indexedDB APIs.
// indexedDB is used by src/lib/indexeddb.ts.
import 'fake-indexeddb/auto'


