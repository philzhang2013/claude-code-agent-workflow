import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoApp from './TodoApp.vue'
import TodoInput from './TodoInput.vue'
import TodoList from './TodoList.vue'
import { saveTodos, loadTodos, __resetStorageFallback } from '../lib/storage'
import type { Todo } from '../types/todo'

describe('TodoApp', () => {
  beforeEach(() => {
    localStorage.clear()
    __resetStorageFallback()
  })

  it('should load existing todos from storage on mount', async () => {
    const todos: Todo[] = [
      { id: 's1', title: '存储任务', completed: false, createdAt: 1000 },
    ]
    saveTodos(todos)

    const wrapper = mount(TodoApp)
    await wrapper.vm.$nextTick()
    const list = wrapper.findComponent(TodoList)

    expect(list.props('todos')).toHaveLength(1)
    expect(list.props('todos')[0].title).toBe('存储任务')
  })

  it('should add a todo and persist to storage', async () => {
    const wrapper = mount(TodoApp)
    const input = wrapper.findComponent(TodoInput)

    await input.vm.$emit('add', '新任务')

    const persisted = loadTodos()
    expect(persisted).toHaveLength(1)
    expect(persisted[0].title).toBe('新任务')
  })

  it('should pass todos to TodoList', async () => {
    const wrapper = mount(TodoApp)
    const input = wrapper.findComponent(TodoInput)

    expect(wrapper.findComponent(TodoList).props('todos')).toEqual([])

    input.vm.$emit('add', '任务A')
    await wrapper.vm.$nextTick()

    const list = wrapper.findComponent(TodoList)
    expect(list.props('todos')).toHaveLength(1)
    expect(list.props('todos')[0].title).toBe('任务A')
  })

  it('should toggle todo persistence via TodoList', async () => {
    const wrapper = mount(TodoApp)
    const input = wrapper.findComponent(TodoInput)
    const list = wrapper.findComponent(TodoList)

    await input.vm.$emit('add', '切换任务')
    const id = list.props('todos')[0].id

    await list.vm.$emit('toggle', id)

    const persisted = loadTodos()
    expect(persisted[0].completed).toBe(true)
  })

  it('should update todo persistence via TodoList', async () => {
    const wrapper = mount(TodoApp)
    const input = wrapper.findComponent(TodoInput)
    const list = wrapper.findComponent(TodoList)

    await input.vm.$emit('add', '旧标题')
    const id = list.props('todos')[0].id

    await list.vm.$emit('update', id, '新标题')

    const persisted = loadTodos()
    expect(persisted[0].title).toBe('新标题')
  })

  it('should remove todo persistence via TodoList', async () => {
    const wrapper = mount(TodoApp)
    const input = wrapper.findComponent(TodoInput)
    const list = wrapper.findComponent(TodoList)

    await input.vm.$emit('add', '待删除')
    const id = list.props('todos')[0].id

    await list.vm.$emit('remove', id)

    const persisted = loadTodos()
    expect(persisted).toHaveLength(0)
  })
})
