import { ref, type Ref } from 'vue'
import type { Todo } from '../types/todo'

export interface UseTodosReturn {
  todos: Ref<Readonly<Todo>[]>
  addTodo: (title: string) => void
  toggleTodo: (id: string) => void
  updateTodo: (id: string, title: string) => void
  removeTodo: (id: string) => void
}

export function useTodos(): UseTodosReturn {
  const todos = ref<Readonly<Todo>[]>([])

  function addTodo(title: string): void {
    const trimmed = title.trim()
    if (!trimmed) return

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    }

    todos.value = [...todos.value, newTodo]
  }

  function toggleTodo(id: string): void {
    todos.value = todos.value.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  }

  function updateTodo(id: string, title: string): void {
    const trimmed = title.trim()
    if (!trimmed) return

    todos.value = todos.value.map((todo) =>
      todo.id === id ? { ...todo, title: trimmed } : todo
    )
  }

  function removeTodo(id: string): void {
    todos.value = todos.value.filter((todo) => todo.id !== id)
  }

  return {
    todos,
    addTodo,
    toggleTodo,
    updateTodo,
    removeTodo,
  }
}
