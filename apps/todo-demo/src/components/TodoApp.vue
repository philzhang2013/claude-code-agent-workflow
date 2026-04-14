<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useTodos } from '../composables/useTodos'
import { useTheme } from '../composables/useTheme'
import { loadTodos, saveTodos } from '../lib/storage'
import TodoInput from './TodoInput.vue'
import TodoList from './TodoList.vue'

const { todos, addTodo, toggleTodo, updateTodo, removeTodo } = useTodos()
const { theme, toggleTheme } = useTheme()
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
    <div class="header">
      <h1 class="title">TODO</h1>
      <button
        type="button"
        class="theme-toggle"
        data-testid="theme-toggle"
        :aria-label="theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'"
        @click="toggleTheme"
      >
        <svg
          v-if="theme === 'light'"
          class="theme-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
        <svg
          v-else
          class="theme-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </button>
    </div>
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

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
}

.title {
  margin: 0;
  font-size: var(--text-2xl);
  font-weight: 800;
  text-align: center;
  flex: 1;
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  color: var(--color-text);
  background-color: var(--color-bg);
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.theme-toggle:hover {
  background-color: var(--color-accent);
  color: var(--color-surface);
}

.theme-toggle:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

.theme-toggle:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 0 var(--color-border);
}

.theme-icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
