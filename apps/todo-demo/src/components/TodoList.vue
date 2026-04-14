<script setup lang="ts">
import TodoItem from './TodoItem.vue'
import type { Todo } from '../types/todo'

defineProps<{
  todos: Todo[]
}>()

const emit = defineEmits<{
  toggle: [id: string]
  update: [id: string, title: string]
  remove: [id: string]
}>()
</script>

<template>
  <ul class="todo-list">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle="emit('toggle', todo.id)"
      @update="(title) => emit('update', todo.id, title)"
      @remove="emit('remove', todo.id)"
    />
  </ul>
</template>

<style scoped>
.todo-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
