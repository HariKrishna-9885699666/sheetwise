import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { clearCache, deleteCacheEntry, getCacheData, saveCacheData, CACHE_KEYS } from '@/lib/indexeddb'

describe('indexeddb cache utils', () => {
  beforeEach(async () => {
    await clearCache()
  })

  afterEach(async () => {
    await clearCache()
  })

  it('saveCacheData then getCacheData returns stored data', async () => {
    const payload = { a: 1, b: ['x'] }
    await saveCacheData(CACHE_KEYS.ALL_MONTHS, payload)
    const loaded = await getCacheData(CACHE_KEYS.ALL_MONTHS)
    expect(loaded).toEqual(payload)
  })

  it('deleteCacheEntry removes entry', async () => {
    const payload = { a: 2 }
    await saveCacheData(CACHE_KEYS.ALL_MONTHS, payload)
    await deleteCacheEntry(CACHE_KEYS.ALL_MONTHS)
    const loaded = await getCacheData(CACHE_KEYS.ALL_MONTHS)
    expect(loaded).toBeNull()
  })
})

