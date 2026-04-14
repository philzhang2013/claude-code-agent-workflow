# Capability: todo-app

## Overview

纯前端待办任务管理应用的核心能力，包括任务的创建、展示、编辑、删除及本地持久化。

## Functional Requirements

### FR-1: 项目结构

**SHALL-1.1** 能力交付物应位于 `apps/todo-demo/` 目录下，为一个基于 Vite + Vue 3 + TypeScript 的可独立运行项目。

**SHALL-1.2** 项目应使用 Vite 官方 `vue-ts` 模板作为脚手架。

**Scenario: S1 — 项目可独立启动**
```
GIVEN 用户进入 apps/todo-demo/ 目录
WHEN 执行 npm install 然后 npm run dev
THEN 开发服务器应在默认端口成功启动且无构建错误
```

### FR-2: 任务 CRUD

**SHALL-2.1** 应用应支持创建 Todo 任务，每个任务包含 `title`（字符串，必填，非空）、`completed`（布尔值，默认 false）、`id`（字符串，全局唯一）、`createdAt`（数字，时间戳）。

**SHALL-2.2** 应用应支持将任务标记为已完成或未完成（toggle）。

**SHALL-2.3** 应用应支持编辑已有任务的标题。

**SHALL-2.4** 应用应支持删除单个任务。

**SHALL-2.5** 应用应展示当前所有任务的列表，列表状态应随操作实时更新。

**Scenario: S2 — 创建任务**
```
GIVEN 用户在输入框中输入"学习 Vue 3"
WHEN 用户按下回车或点击添加按钮
THEN 任务列表中应出现一条标题为"学习 Vue 3"、状态为未完成的任务
```

**Scenario: S3 — 切换完成状态**
```
GIVEN 列表中存在一条未完成任务
WHEN 用户点击该任务前的复选框
THEN 该任务应变为已完成状态，且 UI 应反映该变化
```

**Scenario: S4 — 编辑任务**
```
GIVEN 列表中存在一条标题为"旧标题"的任务
WHEN 用户触发编辑并将标题改为"新标题"后确认
THEN 该任务在列表中的标题应更新为"新标题"
```

**Scenario: S5 — 删除任务**
```
GIVEN 列表中存在一条任务
WHEN 用户点击删除按钮
THEN 该任务应从列表中移除
```

### FR-3: 本地状态管理

**SHALL-3.1** 应用应使用 Vue 3 Composition API（`ref`、`reactive`、`computed`）进行本地状态管理，不引入 Pinia 或 Vuex。

**SHALL-3.2** 业务逻辑应封装在 `src/composables/useTodos.ts` 中，对外暴露 `todos`、`addTodo`、`removeTodo`、`updateTodo`、`toggleTodo`。

**SHALL-3.3** 状态更新应采用不可变模式（返回新数组/对象替换），避免直接修改现有响应式引用。

**Scenario: S6 — composable 独立可用**
```
GIVEN 在测试环境中直接调用 useTodos
WHEN 依次调用 addTodo、toggleTodo、removeTodo
THEN 各操作后 todos 的值应符合预期，且 UI 无关
```

### FR-4: 数据持久化

**SHALL-4.1** 应用应在页面刷新后恢复任务列表，持久化介质为 `localStorage`。

**SHALL-4.2** `localStorage` 读写逻辑应封装在 `src/lib/storage.ts` 中，组件和 composables 不应直接访问 `window.localStorage`。

**SHALL-4.3** 当 `localStorage` 不可用时（包括但不限于隐私模式、QuotaExceeded、JSON 解析失败），存储模块应静默回退到内存存储，保证应用不崩溃。

**Scenario: S7 — 刷新后数据恢复**
```
GIVEN 用户已添加两条任务且页面未关闭
WHEN 用户刷新浏览器页面
THEN 刷新后列表中应仍显示这两条任务
```

**Scenario: S8 — 隐私模式降级容错**
```
GIVEN 浏览器处于隐私模式且 localStorage 被禁用
WHEN 用户添加、编辑、删除任务
THEN 应用应正常运行，当前会话内状态保持一致
```

### FR-5: UI 与视觉风格

**SHALL-5.1** 应用应使用原生 CSS 手写全部样式，不引入 Tailwind 或第三方 UI 组件库。

**SHALL-5.2** 视觉风格应为轻量 Neo-brutalism，包含鲜明边框、高对比色、有意的非均匀阴影，避免模板化布局。

**SHALL-5.3** 设计令牌应集中定义在 `src/styles/tokens.css` 中，组件样式禁止硬编码颜色、间距、阴影值。

**SHALL-5.4** 组件应按功能域组织：`TodoApp.vue`（容器）、`TodoInput.vue`（输入）、`TodoList.vue`（列表）、`TodoItem.vue`（单项）。

**Scenario: S9 — 视觉风格一致性**
```
GIVEN 用户打开应用
WHEN 查看输入框、任务项、按钮
THEN 所有元素应使用统一的边框宽度和阴影偏移，无默认浏览器模板感
```

### FR-6: 类型安全

**SHALL-6.1** 应用应显式定义 `Todo` TypeScript 接口，字段包括 `id: string`、`title: string`、`completed: boolean`、`createdAt: number`。

**SHALL-6.2** 核心模块（composables、storage、组件 props）应使用 `Todo` 接口或基于它的类型，禁止在业务逻辑中使用 `any`。

## Non-Functional Requirements

### NFR-1: 测试覆盖率

**SHALL-N1.1** 项目应使用 Vitest 作为测试运行器，`@vue/test-utils` 进行组件测试。

**SHALL-N1.2** 单元测试应覆盖 `useTodos.ts`、`storage.ts` 以及核心组件（`TodoInput`、`TodoItem`、`TodoList`）。

**SHALL-N1.3** 测试覆盖率应达到或超过 80%（语句覆盖率）。

**Scenario: SN1 — 覆盖率达标**
```
GIVEN 所有测试用例已编写完成
WHEN 执行 npm run test -- --coverage
THEN 覆盖率报告中语句覆盖率应 >= 80%，且无测试失败
```

### NFR-2: 构建与部署

**SHALL-N2.1** 执行 `npm run build` 应成功生成生产构建产物，无 TypeScript 类型错误或构建警告。

**SHALL-N2.2** 项目应为独立子项目，不破坏仓库现有构建流程。

## Out of Scope

- 后端接口、用户认证、多设备同步
- E2E 测试自动化
- PWA、SSR、国际化
- 复杂动画或第三方 UI 组件库
- 任务过滤、排序、搜索

## ADDED Requirements

### + Requirement: Theme state management
+ The application SHALL provide a `useTheme` composable in `src/composables/useTheme.ts` that manages theme state (`'light'` | `'dark'`), persists the selected theme to `localStorage` under the key `theme`, detects the system's `prefers-color-scheme` preference on first visit, and applies the theme to the DOM via `data-theme` attribute on the `<html>` element.

+ #### Scenario: Theme persistence
```
GIVEN the application is running and the user has a visible theme toggle
WHEN user toggles between light and dark themes
THEN the `theme` key in `localStorage` SHALL be updated to `"light"` or `"dark"` within 100ms
```

+ #### Scenario: System preference detection
```
GIVEN the user visits for the first time with no `theme` record in `localStorage`
WHEN the application initializes
THEN the application SHALL automatically match the system's `prefers-color-scheme` preference
```

+ #### Scenario: Invalid theme fallback
```
GIVEN `localStorage` contains an invalid theme value
WHEN the application reads the stored theme on initialization
THEN the application SHALL fall back to `light` theme and overwrite the stored value with `"light"`
```

+ #### Scenario: Storage unavailable graceful degradation
```
GIVEN `localStorage` is unavailable (e.g., private mode or disabled)
WHEN the user toggles the theme
THEN the theme state SHALL silently fall back to in-memory storage without crashing
```

+ #### Scenario: MatchMedia unavailable fallback
```
GIVEN `matchMedia` is unavailable in the environment
WHEN the application attempts to detect system color scheme preference
THEN the application SHALL fall back to `light` theme
```

### + Requirement: Theme toggle UI
+ `TodoApp.vue` SHALL contain a visible theme toggle button that allows users to manually switch between light and dark themes instantly without page refresh.

+ #### Scenario: Instant theme switch
```
GIVEN the user is viewing the application
WHEN user clicks the theme toggle button
THEN the application SHALL instantly switch between light and dark themes without page refresh
```

### + Requirement: Dark theme visual consistency
+ In dark theme, all components (input, buttons, task items, container) SHALL maintain Neo-brutalism hard borders and hard shadows, with background-to-text contrast ratio >= 4.5:1.

+ #### Scenario: Dark mode contrast
```
GIVEN the application renders in dark theme
WHEN the user views input box, task items, and buttons
THEN all text and interactive elements SHALL remain visible with contrast ratio >= 4.5:1 against their backgrounds
```

## ~ MODIFIED Requirements

### ~ Requirement: UI and visual style
+ The application SHALL use hand-written native CSS without Tailwind or third-party UI libraries. The visual style SHALL be lightweight Neo-brutalism with bold borders, high-contrast colors, and intentional non-uniform shadows, avoiding template-like layouts. Design tokens SHALL be centralized in `src/styles/tokens.css`, supporting both light and dark theme variables with dark theme tokens applied via `[data-theme="dark"]` selector. Component styles SHALL NOT hardcode colors, spacing, or shadow values. Components SHALL be organized by feature domain: `TodoApp.vue` (container), `TodoInput.vue` (input), `TodoList.vue` (list), `TodoItem.vue` (item).

+ #### Scenario: Visual style consistency
```
GIVEN the user opens the application
WHEN the user views input box, task items, and buttons
THEN all elements SHALL use uniform border width and shadow offset without default browser template feel
AND the visual style SHALL remain consistent in both light and dark themes
```

### ~ Requirement: Test coverage
~ The project SHALL use Vitest as the test runner and `@vue/test-utils` for component testing. Unit tests SHALL cover `useTodos.ts`, `storage.ts`, `useTheme.ts`, and core components (`TodoInput`, `TodoItem`, `TodoList`). Test coverage SHALL reach or exceed 80% statement coverage.

+ #### Scenario: Coverage meets target
```
GIVEN all test cases are written
WHEN `npm run test -- --coverage` is executed
THEN the coverage report SHALL show statement coverage >= 80% with no test failures
```
