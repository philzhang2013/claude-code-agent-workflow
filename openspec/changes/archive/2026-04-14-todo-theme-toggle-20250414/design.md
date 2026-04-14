# todo-theme-toggle-20250414 技术设计

## Context

当前 Todo 应用（`apps/todo-demo`）基于 Vue 3 + Vite 构建，采用 Neo-brutalism 视觉风格，CSS 变量集中在 `src/styles/tokens.css` 中管理。应用当前仅支持单一亮色主题，在低光环境下可用性受限，且未响应系统 `prefers-color-scheme` 偏好。

本次变更的目标是在不引入外部依赖的前提下，为应用增加亮/暗主题切换能力，包括：
- 暗色主题的 CSS 变量覆盖
- 客户端主题状态管理（localStorage 持久化 + 系统偏好检测）
- `TodoApp.vue` 中的手动切换 UI
- 对主题逻辑的单元测试覆盖

## Goals / Non-Goals

**Goals:**
- 在 `tokens.css` 中补充暗色变量覆盖，保持 Neo-brutalism 硬边框/硬阴影风格
- 实现 `useTheme` composable，管理主题状态、localStorage 持久化及系统偏好同步
- 在 `TodoApp.vue` 中添加主题切换按钮，支持无刷新即时切换
- 为 `useTheme` 编写单元测试，覆盖状态切换、持久化、系统偏好监听，覆盖率 >= 80%
- 暗色模式下背景与文字对比度 >= 4.5:1

**Non-Goals:**
- 不支持自动跟随系统主题实时切换（仅在首次无缓存时检测系统偏好）
- 不引入额外依赖（如 `vueuse`）
- 不修改现有 Todo 业务逻辑（`useTodos`、`storage.ts` 等保持不动）
- 不添加 E2E 测试（本次仅要求单元测试）

## Architecture

### 组件关系

```
+-------------------------------------+
|           TodoApp.vue               |
|  +-----------------------------+    |
|  |    Theme Toggle Button      |    |
|  +-----------------------------+    |
|  +-----------------------------+    |
|  |         TodoInput           |    |
|  +-----------------------------+    |
|  +-----------------------------+    |
|  |         TodoList            |    |
|  |   +---------------------+   |    |
|  |   |      TodoItem       |   |    |
|  |   +---------------------+   |    |
|  +-----------------------------+    |
+-------------------------------------+
                   |
                   v
+-------------------------------------+
|         useTheme.ts                 |
|  - theme: Ref<'light' | 'dark'>     |
|  - toggleTheme()                    |
|  - localStorage read/write          |
|  - prefers-color-scheme listener    |
+-------------------------------------+
                   |
                   v
+-------------------------------------+
|         tokens.css                  |
|  :root { light tokens }             |
|  [data-theme="dark"] { dark tokens }|
+-------------------------------------+
```

### 主题应用机制

在 `main.ts` 中，应用挂载前调用 `useTheme()` 的初始化逻辑，将 `data-theme` 属性设置到 `<html>` 元素上。CSS 变量通过属性选择器 `[data-theme="dark"]` 覆盖，确保全局样式即时生效。

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.css'
import { initTheme } from './composables/useTheme'

initTheme()
createApp(App).mount('#app')
```

## Decisions

### 1. 使用 `data-theme` 属性而非 CSS 类控制主题
**Rationale:**
- 属性选择器语义明确，避免与组件已有的 `class` 逻辑冲突
- 可在 `:root` 级别定义亮色变量，在 `[data-theme="dark"]` 中覆盖，保持 CSS 层级简单
- 便于在 `html` 元素上统一设置，确保所有后代组件继承

**Alternatives considered:**
- `.dark` class：与 Tailwind 等框架的命名习惯重叠，且类名更易被局部覆盖
- `media query` 纯自动模式：无法满足用户手动覆盖的需求

### 2. 首次访问时检测 `prefers-color-scheme`，之后以 localStorage 为准
**Rationale:**
- 符合用户预期：首次访问尊重系统偏好，手动切换后尊重用户选择
- 避免系统偏好的实时变化打断用户已明确设置的主题
- 实现简单，无需复杂的优先级仲裁逻辑

**Alternatives considered:**
- 持续监听系统偏好并自动切换：可能导致用户在手动选择后被系统突然切换，体验不佳

### 3. `useTheme` 同时暴露 `theme` 状态和 `toggleTheme` 方法
**Rationale:**
- Vue 3 composable 是项目现有的状态管理模式（参考 `useTodos`）
- 将持久化、系统偏好检测、DOM 操作封装在单一 composable 中，组件层无感知
- 便于单元测试：可 mock `localStorage` 和 `matchMedia`

**Interface:**
```typescript
export type Theme = 'light' | 'dark'

export interface UseThemeReturn {
  theme: Ref<Theme>
  toggleTheme: () => void
}

export function useTheme(): UseThemeReturn
export function initTheme(): void
```

### 4. 暗色变量设计保持 Neo-brutalism 风格
**Rationale:**
- 暗色模式不是简单的反色，而是将背景与表面色反转，同时保留高对比度边框和硬阴影
- `--color-border` 在暗色模式下调整为浅色，确保硬边框在暗色背景下依然锐利
- 阴影颜色使用 `var(--color-border)`，因此会自动适配暗色/亮色

**暗色变量草案：**
```css
[data-theme="dark"] {
  --color-bg: #0a0a0a;
  --color-surface: #1a1a1a;
  --color-text: #f3f3f3;
  --color-accent: #ff6b6b;
  --color-accent-hover: #ff5252;
  --color-success: #51cf66;
  --color-border: #f3f3f3;
}
```

> 注：`--color-border` 在暗色模式下调整为浅色，保证组件边框可见；阴影使用 `var(--color-border)` 作为颜色，因此会自动适配。

### 5. 不引入 `vueuse` 等第三方库
**Rationale:**
- 项目当前仅依赖 `vue`，无其他运行时库
- 主题管理逻辑简单（约 60 行），手写成本低于引入依赖的维护成本
- 符合 proposal 中"无新增外部依赖"的约束

## Data Model

### 持久化数据

| Key | Type | Storage | Description |
|-----|------|---------|-------------|
| `theme` | `'light' \| 'dark'` | `localStorage` | 用户手动选择的主题偏好 |

### 运行时状态

| Name | Type | Scope | Description |
|------|------|-------|-------------|
| `theme` | `Ref<'light' \| 'dark'>` | `useTheme` composable | 当前生效的主题 |

### 无数据迁移要求

本次变更仅新增 `localStorage` 键 `theme`，不影响现有 `todos` 数据存储。

## Error Handling & Edge Cases

| 场景 | 处理策略 |
|------|---------|
| `localStorage` 不可用（隐私模式/禁用）| 静默降级为内存状态，主题在页面刷新后丢失 |
| `localStorage` 中 `theme` 值为非法字符串 | 回退到 `light` 主题，并覆盖写入正确值 |
| `matchMedia` 不可用 | 回退到 `light` 主题 |
| 用户快速连续点击切换按钮 | 使用 `ref` 的同步更新，无竞态条件 |
| SSR 环境（如 Vitest 的 jsdom）| `initTheme` 和 `useTheme` 需安全访问 `window`/`localStorage`，通过 `typeof` 检查或 try-catch 防护 |

## Testing Strategy

### 单元测试：`useTheme.spec.ts`

使用 **Vitest** + **@vue/test-utils** 进行测试，重点覆盖以下行为：

1. **主题切换**
   - 初始状态为 `light`
   - 调用 `toggleTheme()` 后变为 `dark`
   - 再次调用后回到 `light`

2. **localStorage 持久化**
   - 切换后 `localStorage.getItem('theme')` 在 100ms 内更新
   - 初始化时读取 `localStorage` 中已保存的值
   - 非法值时回退并覆盖

3. **系统偏好监听**
   - 无 localStorage 缓存时，根据 `matchMedia('(prefers-color-scheme: dark)')` 的初始值设置主题
   - 模拟 `matchMedia` 返回 `true` 和 `false` 两种场景

### 测试辅助

- 每个测试用例前清理 `localStorage` 和 `document.documentElement` 的 `data-theme` 属性
- 使用 `vi.stubGlobal('matchMedia', ...)` 模拟媒体查询

### 覆盖率要求

- `useTheme.ts` 行覆盖率 >= 80%

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| 暗色变量覆盖不完整，导致某些组件在暗色模式下出现不可见文字或背景 | 在 `tokens.css` 中确保所有颜色变量都有暗色覆盖；验收时手动检查所有组件 |
| `localStorage` 读写与 DOM 操作在测试环境中报错 | 使用 `jsdom` 并添加 `typeof window` / `try-catch` 防护；测试前清理全局状态 |
| 主题切换按钮破坏现有布局 | 将按钮放置在 `TodoApp.vue` 的标题右侧，使用 `flex` 布局，避免影响下方组件 |
| 暗色模式下对比度不足 | 选择 `#0a0a0a` 背景 + `#f3f3f3` 文字，对比度约 18.5:1，远超 4.5:1 要求 |

## Migration Plan

### 部署步骤
1. 在 `tokens.css` 中追加 `[data-theme="dark"]` 变量覆盖
2. 创建 `src/composables/useTheme.ts` 和 `useTheme.spec.ts`
3. 更新 `TodoApp.vue` 添加主题切换按钮
4. 更新 `main.ts` 在应用挂载前调用 `initTheme()`
5. 运行 `pnpm test` 确认所有测试通过

### Rollback Plan
1. 删除 `src/composables/useTheme.ts` 和 `src/composables/useTheme.spec.ts`
2. 从 `TodoApp.vue` 中移除主题切换按钮及相关导入
3. 将 `src/styles/tokens.css` 恢复为仅保留 `:root` 亮色变量
4. 恢复 `main.ts` 到变更前状态
5. 重新运行 `pnpm test` 确认无回归

## Open Questions

- 是否需要为暗色模式提供独立的 `box-shadow` 颜色调整，还是继续使用 `--color-border` 作为阴影色？（建议：继续使用 `--color-border`，保持实现简单）
- 主题切换按钮是否需要图标（如太阳/月亮）还是纯文本？（建议：使用简洁的文本按钮 `"暗" / "亮"` 或 Unicode 符号 `☀ / ☾`，避免引入图标库）
