# 任务清单：todo-theme-toggle-20250414

## 任务表

| 编号 | 阶段 | 任务 | 能力 | 工时 | 依赖 | 验收标准映射 |
|---|---|---|---|---|---|---|
| 1.1 | RED | 为 theme-toggle 生成失败测试 | theme-toggle | 0.5d | — | AC1, AC2, AC5 |
| 1.2 | GREEN | 实现 useTheme 使测试通过 | theme-toggle | 1.0d | 1.1 | AC1, AC2, AC5 |
| 1.3 | IMPROVE | 重构 useTheme | theme-toggle | 0.5d | 1.2 | AC1, AC2, AC5 |
| 2.1 | RED | 为 todo-app 暗色主题样式生成失败测试/验证 | todo-app | 0.5d | 1.2 | AC3, AC4 |
| 2.2 | GREEN | 在 tokens.css 中实现暗色变量覆盖并在 TodoApp.vue 中添加切换按钮 | todo-app | 1.0d | 2.1 | AC3, AC4 |
| 2.3 | IMPROVE | 重构主题相关 UI 和样式 | todo-app | 0.5d | 2.2 | AC3, AC4 |
| 3.1 | VERIFY | 更新 main.ts 调用 initTheme 并全量回归测试 | todo-app | 0.5d | 2.3 | AC1, AC2, AC3, AC4, AC5 |

> **自动修正：** 将验收标准映射从与 proposal.md 不一致的 SHALL 编号修正为 AC1~AC5。

---

## 1. theme-toggle 核心逻辑

- [x] 1.1 RED：为 useTheme 生成失败测试（主题切换、localStorage 持久化、系统偏好监听）
- [x] 1.2 GREEN：实现 useTheme.ts 使测试通过
- [x] 1.3 IMPROVE：重构 useTheme，提取辅助函数、优化错误处理边界

## 2. todo-app 主题感知与 UI

- [x] 2.1 RED：为 tokens.css 暗色覆盖和 TodoApp.vue 主题切换按钮生成失败测试/快照验证
- [x] 2.2 GREEN：在 tokens.css 中追加 `[data-theme="dark"]` 变量覆盖，在 TodoApp.vue 中添加可见的主题切换按钮并绑定 toggleTheme
- [x] 2.3 IMPROVE：重构主题按钮样式和 DOM 结构，确保 Neo-brutalism 风格一致且不影响现有布局

## 3. 集成与验证

- [x] 3.1 更新 main.ts 在应用挂载前调用 initTheme()
- [x] 3.2 运行全量测试（pnpm test）确认无回归且 useTheme 覆盖率 >= 80%
- [x] 3.3 手动验证亮/暗主题切换、系统偏好首次检测、localStorage 持久化、对比度 >= 4.5:1
