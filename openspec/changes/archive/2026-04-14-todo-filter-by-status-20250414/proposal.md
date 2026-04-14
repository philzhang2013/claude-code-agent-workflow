## Why

当前 todo-demo 应用在任务数量增多时，用户无法快速聚焦到"进行中"或"已完成"的任务。添加按状态筛选功能可以显著提升任务管理的可用性，这是待办应用的核心交互能力之一。

## What Changes

- 在 `useTodos.ts` 中新增筛选状态管理和筛选后任务列表
- 在 `TodoApp.vue` 中添加筛选按钮组 UI，支持"全部 / 进行中 / 已完成"三种视图
- 筛选按钮需要有明显的激活状态视觉反馈
- 通过 TDD 方式开发：先写测试，再写实现
- 更新 `todo-app` spec，将"任务过滤"从 Out of Scope 移除并添加正式需求

## Capabilities

### New Capabilities
- *(无)*

### Modified Capabilities
- `todo-app`: 将"按状态筛选任务"从 Out of Scope 移入正式功能需求，新增 `useTodos` 筛选逻辑和 `TodoApp` 筛选 UI 的规范

## Impact

- `apps/todo-demo/src/composables/useTodos.ts` — 新增 `filter` 状态和 `filteredTodos`
- `apps/todo-demo/src/composables/useTodos.spec.ts` — 新增筛选逻辑测试
- `apps/todo-demo/src/components/TodoApp.vue` — 新增筛选按钮组
- `apps/todo-demo/src/components/TodoApp.spec.ts` — 新增筛选 UI 交互测试
- `openspec/specs/todo-app/spec.md` — 更新 Out of Scope 和功能需求
