# todo-theme-toggle-20250414

## Why

当前 Todo 应用仅支持 Neo-brutalism 亮色主题，在低光环境下可用性较差，且无法满足用户对暗色模式的偏好。添加亮/暗主题切换可提升可访问性与用户体验，并符合现代 Web 应用对 `prefers-color-scheme` 系统偏好支持的基本预期。

## What Changes

- 在 `tokens.css` 中补充暗色变量覆盖，保持 Neo-brutalism 视觉风格的一致性。
- 新增 `useTheme` composable，负责主题状态管理、localStorage 持久化以及系统偏好 `prefers-color-scheme` 检测与同步。
- 在 `TodoApp.vue` 中添加主题切换按钮，允许用户手动在亮/暗主题间切换。
- 为 `useTheme` 编写单元测试，覆盖状态切换、持久化读写、系统偏好监听逻辑。

## Capabilities

### New Capabilities
- `theme-toggle`: 主题切换能力，包含主题状态管理、localStorage 持久化、系统偏好检测与手动切换 UI。

### Modified Capabilities
- `todo-app`: 现有 Todo 应用规范需要更新以支持主题变量与主题感知渲染，明确主题切换对 UI 组件的影响范围。

## Impact

- **代码**: 影响 `src/styles/tokens.css`、`src/composables/useTheme.ts`、`src/components/TodoApp.vue` 及新增测试文件 `src/composables/useTheme.spec.ts`。
- **API/依赖**: 无新增外部依赖。
- **系统**: 无后端或部署变更；主题状态完全在客户端管理。

## Acceptance Criteria

1. **主题状态持久化**: 用户在亮/暗主题间切换后，`localStorage` 中的 `theme` 键值（`"light"` 或 `"dark"`）在 100ms 内正确更新。
2. **系统偏好检测**: 首次访问且 `localStorage` 中无主题记录时，应用自动匹配系统的 `prefers-color-scheme` 偏好。
3. **UI 切换功能**: `TodoApp.vue` 中存在可见的主题切换按钮，点击后在亮/暗主题间即时切换（无页面刷新）。
4. **暗色视觉一致性**: 暗色模式下所有组件（输入框、按钮、任务项、容器）保持 Neo-brutalism 硬边框和硬阴影风格，背景色与文字色对比度 ≥ 4.5:1。
5. **单元测试覆盖**: `useTheme.spec.ts` 测试通过，覆盖主题切换、localStorage 读写、系统偏好监听三个行为，覆盖率 ≥ 80%。

## Rollback Plan

1. 删除 `src/composables/useTheme.ts` 和 `src/composables/useTheme.spec.ts`。
2. 从 `src/components/TodoApp.vue` 中移除主题切换按钮及相关导入。
3. 将 `src/styles/tokens.css` 恢复为变更前版本（仅保留亮色变量）。
4. 重新运行 `pnpm test` 确认无回归。
