## Spec 合规审查报告

### 概要
- 审查能力数: 1
- 发现问题: 0 阻断, 0 高, 1 中, 0 低

### 中问题
| 序号 | 文件 | 行号 | 问题 | 建议 |
|---|---|---|---|---|
| 1 | `openspec/specs/todo-app/spec.md` | N/A | 主规范文档未按 `proposal.md` 和 `tasks.md` 要求更新：`Out of Scope` 中仍包含"任务过滤、排序、搜索"，且未将 Delta Spec 中的筛选需求合并到主 spec | 将 Delta Spec 的 ADDED/MODIFIED/REMOVED 内容归档到 `openspec/specs/todo-app/spec.md`，移除 Out of Scope 中的"任务过滤" |

### 详细审查记录

#### 1. SHALL 符合性（通过）
- **Filter todos by status**: 代码在 `useTodos.ts` 中实现了 `filter` 状态、`setFilter` 方法和 `filteredTodos` 计算属性，支持 `all`/`active`/`completed` 三种筛选。
- **Default filter**: `filter` 默认值为 `'all'`，初始化时显示全部任务。
- **Filter active todos**: `active` 筛选正确返回 `!todo.completed` 的任务。
- **Filter completed todos**: `completed` 筛选正确返回 `todo.completed` 的任务。
- **Reactive filter state**: `filteredTodos` 使用 `computed`，当任务状态变化时自动重新计算，满足"立即消失"的响应性要求。
- **Filter UI controls**: `TodoApp.vue` 中渲染了筛选按钮组，标签为"全部"/"进行中"/"已完成"。
- **Active filter visual feedback**: `.filter-btn.is-active` 使用背景色反转 (`background-color: var(--color-text); color: var(--color-surface)`) 和阴影偏移 (`transform: translate(2px, 2px)`)，符合 Neo-brutalism 激活态要求。

#### 2. 接口符合性（通过）
- `useTodos.ts` 暴露的接口与 `design.md` 约定完全一致：`filter: Ref<TodoFilter>`、`setFilter: (value: TodoFilter) => void`、`filteredTodos: ComputedRef<Readonly<Todo>[]>`。
- `TodoFilter` 类型为 `'all' | 'active' | 'completed'`，与规范一致。
- 筛选按钮组直接内嵌在 `TodoApp.vue` 中，符合设计决策。

#### 3. 数据模型符合性（通过）
- 状态更新采用不可变模式：`todos.value = [...]`、`todos.value = todos.value.map(...)`。
- 未引入 Pinia 或 Vuex，仅使用 Vue 3 Composition API。

#### 4. 场景覆盖（通过）
- `useTodos.spec.ts` 新增 6 个测试覆盖：默认 `all`、全部匹配、`active` 筛选、`completed` 筛选、响应性更新、多实例隔离。
- `TodoApp.spec.ts` 新增 4 个测试覆盖：按钮渲染、默认激活态、点击切换、列表过滤渲染。
- 全部 63 个测试通过，语句覆盖率 92.53%，满足 >= 80% 要求。

#### 5. 超出规范范围
- 无超出规范的实现。`TodoApp.vue` 中额外添加了 `role="group"` 和 `aria-label="任务筛选"`，属于可访问性增强，不视为超范围。

### 偏离处理建议
- 文档遗漏问题建议直接补充更新 `openspec/specs/todo-app/spec.md`，无需退回代码阶段。

### 审查结论
- [x] 无未关闭的阻断/高级问题（可进入人工审查）
- [ ] 存在阻断/高级问题（禁止进入人工审查）
