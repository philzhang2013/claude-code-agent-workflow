import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoList from './TodoList.vue'
import TodoItem from './TodoItem.vue'
import type { Todo } from '../types/todo'

describe('TodoList', () => {
  it('should render a TodoItem for each todo', () => {
    const todos: Todo[] = [
      { id: '1', title: '任务一', completed: false, createdAt: 1000 },
      { id: '2', title: '任务二', completed: true, createdAt: 2000 },
    ]

    const wrapper = mount(TodoList, {
      props: { todos },
    })

    const items = wrapper.findAllComponents(TodoItem)
    expect(items).toHaveLength(2)
    expect(items[0].props('todo')).toEqual(todos[0])
    expect(items[1].props('todo')).toEqual(todos[1])
  })

  it('should emit toggle with id when a TodoItem toggles', () => {
    const todos: Todo[] = [
      { id: '1', title: '任务一', completed: false, createdAt: 1000 },
    ]

    const wrapper = mount(TodoList, {
      props: { todos },
    })

    const item = wrapper.findComponent(TodoItem)
    item.vm.$emit('toggle')

    expect(wrapper.emitted('toggle')).toHaveLength(1)
    expect(wrapper.emitted('toggle')![0]).toEqual(['1'])
  })

  it('should emit update with id and title when a TodoItem updates', () => {
    const todos: Todo[] = [
      { id: '2', title: '任务二', completed: false, createdAt: 2000 },
    ]

    const wrapper = mount(TodoList, {
      props: { todos },
    })

    const item = wrapper.findComponent(TodoItem)
    item.vm.$emit('update', '新标题')

    expect(wrapper.emitted('update')).toHaveLength(1)
    expect(wrapper.emitted('update')![0]).toEqual(['2', '新标题'])
  })

  it('should emit remove with id when a TodoItem removes', () => {
    const todos: Todo[] = [
      { id: '3', title: '任务三', completed: false, createdAt: 3000 },
    ]

    const wrapper = mount(TodoList, {
      props: { todos },
    })

    const item = wrapper.findComponent(TodoItem)
    item.vm.$emit('remove')

    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(wrapper.emitted('remove')![0]).toEqual(['3'])
  })
})
