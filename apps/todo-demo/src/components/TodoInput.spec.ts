import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoInput from './TodoInput.vue'

describe('TodoInput', () => {
  it('should emit add event with trimmed title when clicking add button', async () => {
    const wrapper = mount(TodoInput)
    const input = wrapper.find('input')

    await input.setValue('  新任务  ')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('add')).toHaveLength(1)
    expect(wrapper.emitted('add')![0]).toEqual(['新任务'])
  })

  it('should emit add event on Enter key', async () => {
    const wrapper = mount(TodoInput)
    const input = wrapper.find('input')

    await input.setValue('按回车添加')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('add')).toHaveLength(1)
    expect(wrapper.emitted('add')![0]).toEqual(['按回车添加'])
  })

  it('should not emit add event when input is empty', async () => {
    const wrapper = mount(TodoInput)
    const input = wrapper.find('input')

    await input.setValue('   ')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('add')).toBeUndefined()
  })

  it('should clear input after successful add', async () => {
    const wrapper = mount(TodoInput)
    const input = wrapper.find('input')

    await input.setValue('学习 Vue')
    await wrapper.find('button').trigger('click')

    expect((input.element as HTMLInputElement).value).toBe('')
  })
})
