<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  add: [title: string]
}>()

const inputValue = ref('')

function handleAdd() {
  const trimmed = inputValue.value.trim()
  if (!trimmed) return
  emit('add', trimmed)
  inputValue.value = ''
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleAdd()
  }
}
</script>

<template>
  <div class="todo-input">
    <input
      v-model="inputValue"
      type="text"
      placeholder="添加新任务..."
      @keydown="handleKeydown"
    />
    <button type="button" @click="handleAdd">添加</button>
  </div>
</template>

<style scoped>
.todo-input {
  display: flex;
  gap: var(--space-sm);
}

input {
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-sm);
  outline: none;
}

input:focus {
  box-shadow: var(--shadow-md);
}

button {
  padding: var(--space-sm) var(--space-md);
  font-weight: 600;
  color: var(--color-text);
  background-color: var(--color-accent);
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration-fast), box-shadow var(--duration-fast);
}

button:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}
</style>
