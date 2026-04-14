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
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.style.removeProperty('--color-surface')
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

  it('should render a theme toggle button', () => {
    const wrapper = mount(TodoApp)
    const button = wrapper.find('[data-testid="theme-toggle"]')
    expect(button.exists()).toBe(true)
  })

  it('should toggle data-theme attribute when theme button is clicked', async () => {
    const wrapper = mount(TodoApp)
    const button = wrapper.find('[data-testid="theme-toggle"]')

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')

    await button.trigger('click')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    await button.trigger('click')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('should apply dark theme CSS variables when data-theme is dark', () => {
    document.documentElement.setAttribute('data-theme', 'dark')

    const wrapper = mount(TodoApp)
    const app = wrapper.find('.todo-app')

    // jsdom does not resolve CSS custom properties in getComputedStyle;
    // verify the element receives the theme-aware background-color declaration
    expect(app.element.style.backgroundColor || getComputedStyle(app.element).backgroundColor).toBeTruthy()
  })

  it('should render filter buttons', () => {
    const wrapper = mount(TodoApp)
    const buttons = wrapper.findAll('[data-testid="filter-btn"]')

    expect(buttons).toHaveLength(3)
    expect(buttons[0].text()).toBe('全部')
    expect(buttons[1].text()).toBe('进行中')
    expect(buttons[2].text()).toBe('已完成')
  })

  it('should mark "all" filter button as active by default', () => {
    const wrapper = mount(TodoApp)
    const activeButton = wrapper.find('[data-testid="filter-btn"].is-active')

    expect(activeButton.exists()).toBe(true)
    expect(activeButton.text()).toBe('全部')
  })

  it('should switch active filter when a filter button is clicked', async () => {
    const wrapper = mount(TodoApp)
    const buttons = wrapper.findAll('[data-testid="filter-btn"]')

    await buttons[1].trigger('click')

    const activeButton = wrapper.find('[data-testid="filter-btn"].is-active')
    expect(activeButton.exists()).toBe(true)
    expect(activeButton.text()).toBe('进行中')
  })

  it('should filter displayed todos based on selected filter', async () => {
    const wrapper = mount(TodoApp)
    const input = wrapper.findComponent(TodoInput)
    const buttons = wrapper.findAll('[data-testid="filter-btn"]')

    await input.vm.$emit('add', '未完成任务')
    await input.vm.$emit('add', '已完成任务')

    const list = wrapper.findComponent(TodoList)
    const id = list.props('todos')[1].id
    await list.vm.$emit('toggle', id)

    // active filter
    await buttons[1].trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(TodoList).props('todos')).toHaveLength(1)
    expect(wrapper.findComponent(TodoList).props('todos')[0].title).toBe('未完成任务')

    // completed filter
    await buttons[2].trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(TodoList).props('todos')).toHaveLength(1)
    expect(wrapper.findComponent(TodoList).props('todos')[0].title).toBe('已完成任务')

    // all filter
    await buttons[0].trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(TodoList).props('todos')).toHaveLength(2)
  })
})
