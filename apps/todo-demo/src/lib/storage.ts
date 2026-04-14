import type { Todo } from '../types/todo'

export const STORAGE_KEY = 'todos'

const memoryFallback = new Map<string, string>()

function isValidTodo(item: unknown): item is Todo {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    typeof (item as Record<string, unknown>).id === 'string' &&
    'title' in item &&
    typeof (item as Record<string, unknown>).title === 'string' &&
    'completed' in item &&
    typeof (item as Record<string, unknown>).completed === 'boolean' &&
    'createdAt' in item &&
    typeof (item as Record<string, unknown>).createdAt === 'number'
  )
}

function parseTodos(raw: string | undefined): Todo[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidTodo)
  } catch {
    return []
  }
}

export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw !== null) {
      return parseTodos(raw)
    }
  } catch {
    // localStorage unavailable or JSON parse failed — fall through to memory fallback
  }

  return parseTodos(memoryFallback.get(STORAGE_KEY))
}

export function saveTodos(todos: Todo[]): void {
  const raw = JSON.stringify(todos)
  memoryFallback.set(STORAGE_KEY, raw)
  try {
    localStorage.setItem(STORAGE_KEY, raw)
  } catch {
    // localStorage unavailable; data is already in memory fallback
  }
}

export function __resetStorageFallback(): void {
  memoryFallback.clear()
}
