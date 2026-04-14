# 任务清单：todo-mvp-vue-20250414

## 1. 项目初始化

- [ ] 1.1 使用 Vite 官方 vue-ts 模板初始化 `apps/todo-demo/` 项目（0.5d）
- [ ] 1.2 安装并配置 Vitest + @vue/test-utils 测试环境（0.5d）
- [ ] 1.3 创建目录结构：`components/`、`composables/`、`lib/`、`styles/`、`types/`（0.25d）

## 2. 类型与接口定义

- [ ] 2.1 定义 `Todo` TypeScript 接口（`id`, `title`, `completed`, `createdAt`）（0.25d）
- [ ] 2.2 定义 `storage.ts` 的 TypeScript 接口和函数签名（空实现/存根），不写入具体逻辑（0.25d）

## 3. Composable：useTodos（RED）

- [ ] 3.1 **RED**：为 `useTodos.ts` 生成失败测试（覆盖 `addTodo`、`removeTodo`、`updateTodo`、`toggleTodo`、不可变更新模式）（0.5d）

## 4. Composable：useTodos（GREEN）

- [ ] 4.1 **GREEN**：实现 `useTodos.ts`，使 3.1 的所有测试通过（0.5d）

## 5. Composable：useTodos（IMPROVE）

- [ ] 5.1 **IMPROVE**：重构 `useTodos.ts`，确保函数聚焦、类型安全、无 `any`（0.5d）

## 6. Storage 模块（RED / GREEN / IMPROVE）

- [ ] 6.1 **RED**：为 `storage.ts` 生成失败测试（覆盖正常读写、隐私模式降级、JSON 解析失败降级、QuotaExceeded 降级）（0.5d）
- [ ] 6.2 **GREEN**：填充 `storage.ts` 具体实现，使 6.1 的所有测试通过（0.5d）
- [ ] 6.3 **IMPROVE**：重构 `storage.ts`，确保错误处理显式、边界覆盖完整（0.5d）

## 7. 样式与容器骨架

- [ ] 7.1 创建 `src/styles/tokens.css`，定义 Neo-brutalism 设计令牌（0.5d）
- [ ] 7.2 创建 `src/styles/global.css`，添加全局重置与基础样式（0.25d）
- [ ] 7.3 搭建 `TodoApp.vue` 容器骨架（仅含插槽/占位，不含业务逻辑）（0.25d）

## 8. 组件（RED / GREEN / IMPROVE）

- [ ] 8.1 **RED**：为 `TodoInput.vue`、`TodoItem.vue`、`TodoList.vue` 生成失败测试（覆盖渲染、用户交互、事件触发）（0.5d）
- [ ] 8.2 **GREEN**：实现 `TodoInput.vue`、`TodoItem.vue`、`TodoList.vue`，使 8.1 的所有测试通过（1.0d）
- [ ] 8.3 **IMPROVE**：重构组件，确保样式与行为分离、Props 类型安全、无模板化风格（0.5d）

## 9. 集成与验收

- [ ] 9.1 在 `main.ts` 中挂载 `TodoApp.vue`，集成所有子组件与 useTodos（0.25d）
- [ ] 9.2 运行 `npm run test -- --coverage`，验证语句覆盖率 >= 80%（0.25d）
- [ ] 9.3 运行 `npm run build`，验证生产构建无 TypeScript 类型错误和构建警告（0.25d）
- [ ] 9.4 在浏览器中手动验证：CRUD 功能正常、localStorage 持久化有效、Neo-brutalism 视觉风格一致（0.25d）

## 验收标准映射

| 任务 | 映射 proposal.md / spec.md 条款 |
|---|---|
| 1.1 | proposal.md 项目结构 / SHALL-1.1, SHALL-1.2 |
| 1.2 | proposal.md 测试策略 / SHALL-N1.1 |
| 2.1 | design.md TypeScript 类型 / SHALL-6.1, SHALL-6.2 |
| 2.2, 6.x | proposal.md localStorage 持久化与降级 / SHALL-4.1~4.3, S7, S8 |
| 3.x ~ 5.x | proposal.md Composition API / SHALL-3.1~3.3, S6 |
| 7.x ~ 8.x | proposal.md 原生 CSS + Neo-brutalism / SHALL-2.1~2.5, SHALL-5.1~5.4, S2~S5, S9 |
| 9.2 | proposal.md 覆盖率目标 / SHALL-N1.2, SHALL-N1.3, SN1 |
| 9.3 | design.md 构建要求 / SHALL-N2.1, SHALL-N2.2 |
