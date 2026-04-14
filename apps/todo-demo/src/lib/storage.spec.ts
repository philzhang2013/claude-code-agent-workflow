import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadTodos, saveTodos, STORAGE_KEY, __resetStorageFallback } from './storage'
import type { Todo } from '../types/todo'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    __resetStorageFallback()
  })

  it('should return empty array when localStorage has no data', () => {
    const todos = loadTodos()
    expect(todos).toEqual([])
  })

  it('should save and load todos correctly', () => {
    const todos: Todo[] = [
      { id: '1', title: '任务一', completed: false, createdAt: 1000 },
    ]
    saveTodos(todos)
    const loaded = loadTodos()
    expect(loaded).toEqual(todos)
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
  })

  it('should fallback to memory when localStorage.setItem throws (e.g. private mode)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('localStorage is not available')
    })

    const todos: Todo[] = [{ id: '2', title: '隐私模式任务', completed: true, createdAt: 2000 }]
    saveTodos(todos)

    // localStorage is broken, so load should fallback to memory
    const loaded = loadTodos()
    expect(loaded).toEqual(todos)
  })

  it('should fallback to memory when localStorage.getItem throws', () => {
    const todos: Todo[] = [{ id: '3', title: '读取异常任务', completed: false, createdAt: 3000 }]
    saveTodos(todos)

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage is not available')
    })

    const loaded = loadTodos()
    expect(loaded).toEqual(todos)
  })

  it('should return empty array and not throw when JSON.parse fails', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json')
    const loaded = loadTodos()
    expect(loaded).toEqual([])
  })

  it('should fallback to memory when QuotaExceededError is thrown on save', () => {
    const error = new Error('QuotaExceeded')
    error.name = 'QuotaExceededError'
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw error
    })

    const todos: Todo[] = [{ id: '4', title: '配额超限任务', completed: false, createdAt: 4000 }]
    saveTodos(todos)

    const loaded = loadTodos()
    expect(loaded).toEqual(todos)
  })

  it('should isolate fallback across different keys if extended', () => {
    // This test ensures the internal Map fallback works correctly for the single key scenario.
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('unavailable')
    })

    const todosA: Todo[] = [{ id: 'a', title: 'A', completed: false, createdAt: 1 }]
    saveTodos(todosA)

    const loaded = loadTodos()
    expect(loaded).toEqual(todosA)
  })
})
