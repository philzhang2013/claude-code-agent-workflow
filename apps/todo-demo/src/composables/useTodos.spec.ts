import { describe, it, expect } from 'vitest'
import { useTodos } from './useTodos'

describe('useTodos', () => {
  it('should expose an empty todos list initially', () => {
    const { todos } = useTodos()
    expect(todos.value).toEqual([])
  })

  it('should add a todo with title, completed=false, id, and createdAt', () => {
    const { todos, addTodo } = useTodos()
    addTodo('学习 Vue 3')

    expect(todos.value).toHaveLength(1)
    const todo = todos.value[0]
    expect(todo.title).toBe('学习 Vue 3')
    expect(todo.completed).toBe(false)
    expect(typeof todo.id).toBe('string')
    expect(todo.id).not.toBe('')
    expect(typeof todo.createdAt).toBe('number')
    expect(todo.createdAt).toBeGreaterThan(0)
  })

  it('should not add a todo when title is empty', () => {
    const { todos, addTodo } = useTodos()
    addTodo('')
    expect(todos.value).toHaveLength(0)
  })

  it('should not add a todo when title is whitespace only', () => {
    const { todos, addTodo } = useTodos()
    addTodo('   ')
    expect(todos.value).toHaveLength(0)
  })

  it('should toggle a todo by id', () => {
    const { todos, addTodo, toggleTodo } = useTodos()
    addTodo('切换状态测试')
    const id = todos.value[0].id

    toggleTodo(id)
    expect(todos.value[0].completed).toBe(true)

    toggleTodo(id)
    expect(todos.value[0].completed).toBe(false)
  })

  it('should not mutate original todo object when toggling (immutable update)', () => {
    const { todos, addTodo, toggleTodo } = useTodos()
    addTodo('不可变测试')
    const originalTodo = todos.value[0]
    const originalArray = todos.value

    toggleTodo(originalTodo.id)

    expect(todos.value).not.toBe(originalArray)
    expect(todos.value[0]).not.toBe(originalTodo)
    expect(originalTodo.completed).toBe(false)
  })

  it('should update a todo title by id', () => {
    const { todos, addTodo, updateTodo } = useTodos()
    addTodo('旧标题')
    const id = todos.value[0].id

    updateTodo(id, '新标题')
    expect(todos.value[0].title).toBe('新标题')
  })

  it('should not mutate original todo object when updating (immutable update)', () => {
    const { todos, addTodo, updateTodo } = useTodos()
    addTodo('旧标题')
    const originalTodo = todos.value[0]
    const originalArray = todos.value

    updateTodo(originalTodo.id, '新标题')

    expect(todos.value).not.toBe(originalArray)
    expect(todos.value[0]).not.toBe(originalTodo)
    expect(originalTodo.title).toBe('旧标题')
  })

  it('should remove a todo by id', () => {
    const { todos, addTodo, removeTodo } = useTodos()
    addTodo('待删除')
    const id = todos.value[0].id

    removeTodo(id)
    expect(todos.value).toHaveLength(0)
  })

  it('should not mutate original array when removing (immutable update)', () => {
    const { todos, addTodo, removeTodo } = useTodos()
    addTodo('待删除')
    const originalArray = todos.value

    removeTodo(originalArray[0].id)

    expect(todos.value).not.toBe(originalArray)
  })

  it('should handle multiple todos independently', () => {
    const { todos, addTodo, toggleTodo, updateTodo, removeTodo } = useTodos()
    addTodo('任务一')
    addTodo('任务二')
    addTodo('任务三')

    const id1 = todos.value[0].id
    const id2 = todos.value[1].id
    const id3 = todos.value[2].id

    toggleTodo(id2)
    updateTodo(id3, '任务三-已更新')
    removeTodo(id1)

    expect(todos.value).toHaveLength(2)
    expect(todos.value.some((t) => t.id === id1)).toBe(false)
    expect(todos.value.some((t) => t.id === id2 && t.completed)).toBe(true)
    expect(todos.value.some((t) => t.id === id3 && t.title === '任务三-已更新')).toBe(true)
  })

  it('should be usable independently of UI (composable isolation)', () => {
    const instanceA = useTodos()
    const instanceB = useTodos()

    instanceA.addTodo('A 的任务')
    instanceB.addTodo('B 的任务')

    expect(instanceA.todos.value).toHaveLength(1)
    expect(instanceB.todos.value).toHaveLength(1)
    expect(instanceA.todos.value[0].title).toBe('A 的任务')
    expect(instanceB.todos.value[0].title).toBe('B 的任务')
  })

  it('should default filter to "all"', () => {
    const { filter } = useTodos()
    expect(filter.value).toBe('all')
  })

  it('should expose filteredTodos matching all todos by default', () => {
    const { todos, addTodo, filteredTodos } = useTodos()
    addTodo('任务一')
    addTodo('任务二')

    expect(filteredTodos.value).toHaveLength(2)
    expect(filteredTodos.value).toEqual(todos.value)
  })

  it('should filter active (incomplete) todos', () => {
    const { addTodo, toggleTodo, setFilter, filteredTodos } = useTodos()
    addTodo('未完成任务')
    addTodo('已完成任务')
    const completedId = filteredTodos.value[1].id
    toggleTodo(completedId)

    setFilter('active')

    expect(filteredTodos.value).toHaveLength(1)
    expect(filteredTodos.value[0].title).toBe('未完成任务')
    expect(filteredTodos.value[0].completed).toBe(false)
  })

  it('should filter completed todos', () => {
    const { addTodo, toggleTodo, setFilter, filteredTodos } = useTodos()
    addTodo('未完成任务')
    addTodo('已完成任务')
    const completedId = filteredTodos.value[1].id
    toggleTodo(completedId)

    setFilter('completed')

    expect(filteredTodos.value).toHaveLength(1)
    expect(filteredTodos.value[0].title).toBe('已完成任务')
    expect(filteredTodos.value[0].completed).toBe(true)
  })

  it('should reactively update filteredTodos when todo status changes', () => {
    const { addTodo, toggleTodo, setFilter, filteredTodos } = useTodos()
    addTodo('任务')
    setFilter('active')

    expect(filteredTodos.value).toHaveLength(1)

    toggleTodo(filteredTodos.value[0].id)

    expect(filteredTodos.value).toHaveLength(0)
  })

  it('should handle multiple instances with independent filter states', () => {
    const instanceA = useTodos()
    const instanceB = useTodos()

    instanceA.addTodo('A')
    instanceA.addTodo('B')
    instanceA.toggleTodo(instanceA.todos.value[0].id)
    instanceA.setFilter('completed')

    instanceB.addTodo('C')
    instanceB.addTodo('D')
    instanceB.setFilter('active')

    expect(instanceA.filteredTodos.value).toHaveLength(1)
    expect(instanceA.filteredTodos.value[0].title).toBe('A')
    expect(instanceB.filteredTodos.value).toHaveLength(2)
    expect(instanceB.filteredTodos.value.every((t) => !t.completed)).toBe(true)
  })
})
