<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { Todo } from '../types/todo'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  toggle: []
  update: [title: string]
  remove: []
}>()

const isEditing = ref(false)
const editValue = ref('')
const editInputRef = ref<HTMLInputElement | null>(null)

function startEdit() {
  isEditing.value = true
  editValue.value = props.todo.title
  nextTick(() => {
    editInputRef.value?.focus()
  })
}

function cancelEdit() {
  if (!isEditing.value) return
  isEditing.value = false
  editValue.value = props.todo.title
}

function finishEdit() {
  if (!isEditing.value) return
  isEditing.value = false
  const trimmed = editValue.value.trim()
  if (!trimmed) {
    editValue.value = props.todo.title
    return
  }
  emit('update', trimmed)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    finishEdit()
  } else if (event.key === 'Escape') {
    cancelEdit()
  }
}

watch(
  () => props.todo.title,
  (newTitle) => {
    if (!isEditing.value) {
      editValue.value = newTitle
    }
  }
)
</script>

<template>
  <li class="todo-item" :class="{ completed: todo.completed }">
    <input
      type="checkbox"
      :checked="todo.completed"
      @change="emit('toggle')"
    />

    <span
      v-if="!isEditing"
      class="todo-title"
      @dblclick="startEdit"
    >
      {{ todo.title }}
    </span>

    <input
      v-else
      ref="editInputRef"
      v-model="editValue"
      type="text"
      class="edit-input"
      @blur="finishEdit"
      @keydown="handleKeydown"
    />

    <div class="actions">
      <button type="button" aria-label="删除" @click="emit('remove')">
        ×
      </button>
    </div>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.todo-item.completed .todo-title {
  text-decoration: line-through;
  opacity: 0.6;
}

.todo-title {
  flex: 1;
  cursor: pointer;
}

.edit-input {
  flex: 1;
  padding: var(--space-xs) var(--space-sm);
  border: var(--border-width) solid var(--color-border);
  outline: none;
}

.actions button {
  width: 2rem;
  height: 2rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-text);
  background-color: transparent;
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration-fast), box-shadow var(--duration-fast);
}

.actions button:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}
</style>
