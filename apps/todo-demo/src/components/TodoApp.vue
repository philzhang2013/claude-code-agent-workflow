<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useTodos } from '../composables/useTodos'
import { loadTodos, saveTodos } from '../lib/storage'
import TodoInput from './TodoInput.vue'
import TodoList from './TodoList.vue'

const { todos, addTodo, toggleTodo, updateTodo, removeTodo } = useTodos()
const isLoaded = ref(false)

onMounted(() => {
  todos.value = loadTodos()
  isLoaded.value = true
})

watch(
  todos,
  () => {
    if (isLoaded.value) {
      saveTodos(todos.value)
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="todo-app">
    <h1 class="title">TODO</h1>
    <TodoInput @add="addTodo" />
    <TodoList
      :todos="todos"
      @toggle="toggleTodo"
      @update="updateTodo"
      @remove="removeTodo"
    />
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 640px;
  padding: var(--space-lg);
  margin: var(--space-2xl) auto;
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-lg);
}

.title {
  margin: 0 0 var(--space-md);
  font-size: var(--text-2xl);
  font-weight: 800;
  text-align: center;
}
</style>
