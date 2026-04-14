## Context

当前 `todo-demo` 使用 Vue 3 Composition API，`useTodos.ts` 管理任务状态，`TodoApp.vue` 作为容器组件组合 UI。任务列表通过 `todos` 直接传递给 `TodoList` 渲染。本次变更需要在不破坏现有功能的前提下，增加按完成状态筛选的能力。

## Goals / Non-Goals

**Goals:**
- 在 `useTodos.ts` 中新增 `filter` 响应式状态（`'all' | 'active' | 'completed'`）和 `filteredTodos` 计算属性
- `TodoApp.vue` 中展示筛选按钮组，当前激活项有明显视觉反馈
- 通过 TDD 开发：先写 `useTodos.spec.ts` RED 测试，再实现 GREEN 代码；然后写 `TodoApp.spec.ts` RED 测试，再实现 UI
- 保持不可变更新模式，不引入新依赖

**Non-Goals:**
- 排序、搜索、批量操作
- 持久化筛选状态到 localStorage
- 修改 `TodoList`、`TodoItem`、`TodoInput` 的核心行为

## Decisions

1. **筛选状态放在 `useTodos` 内部而非组件中**
   - Rationale: 筛选是任务领域逻辑，与 `todos` 同属一个关注点。放在 composable 中便于测试和复用。
   - Alternative: 在 `TodoApp.vue` 中用 `computed` 做筛选。Rejected：会增加组件复杂度，降低可测试性。

2. **`filteredTodos` 使用 `computed` 而非 `ref`**
   - Rationale: `filteredTodos` 完全由 `todos` 和 `filter` 推导，无需手动维护。`computed` 自动响应变化。

3. **筛选按钮组直接内嵌在 `TodoApp.vue` 中**
   - Rationale: 这是一个简单的容器级控件，无需拆分为独立组件。如果未来筛选逻辑复杂化，再提取不迟。

4. **视觉反馈复用 Neo-brutalism 的 `active` 状态样式**
   - Rationale: 与主题切换按钮的 `:active` 和 `:hover` 保持一致，使用背景色反转+阴影偏移来标识激活状态。

## Risks / Trade-offs

- [Risk] `filteredTodos` 作为 `computed` 返回的是过滤后的数组，如果下游组件直接修改索引可能产生混淆 → Mitigation: `TodoList` 只读渲染，不修改传入数组。
- [Risk] 新增测试可能导致覆盖率计算波动 → Mitigation: 确保新增测试覆盖所有分支（all/active/completed 三种状态及切换）。
