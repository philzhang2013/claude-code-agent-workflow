import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoItem from './TodoItem.vue'
import type { Todo } from '../types/todo'

function makeTodo(partial: Partial<Todo> = {}): Todo {
  return {
    id: '1',
    title: '测试任务',
    completed: false,
    createdAt: 1000,
    ...partial,
  }
}

describe('TodoItem', () => {
  it('should render todo title', () => {
    const wrapper = mount(TodoItem, {
      props: { todo: makeTodo({ title: '学习 Vue' }) },
    })

    expect(wrapper.text()).toContain('学习 Vue')
  })

  it('should emit toggle event when clicking checkbox', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo: makeTodo() },
    })

    await wrapper.find('input[type="checkbox"]').trigger('change')

    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('should emit remove event when clicking delete button', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo: makeTodo() },
    })

    await wrapper.find('button[aria-label="删除"]').trigger('click')

    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('should switch to edit mode on double click', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo: makeTodo({ title: '可编辑任务' }) },
    })

    await wrapper.find('.todo-title').trigger('dblclick')

    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('should emit update event when finishing edit', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo: makeTodo({ title: '旧标题' }) },
    })

    await wrapper.find('.todo-title').trigger('dblclick')
    const editInput = wrapper.find('input[type="text"]')
    await editInput.setValue('新标题')
    await editInput.trigger('blur')

    expect(wrapper.emitted('update')).toHaveLength(1)
    expect(wrapper.emitted('update')![0]).toEqual(['新标题'])
  })

  it('should not emit update when trimmed title is empty', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo: makeTodo({ title: '旧标题' }) },
    })

    await wrapper.find('.todo-title').trigger('dblclick')
    const editInput = wrapper.find('input[type="text"]')
    await editInput.setValue('   ')
    await editInput.trigger('blur')

    expect(wrapper.emitted('update')).toBeUndefined()
  })
})
