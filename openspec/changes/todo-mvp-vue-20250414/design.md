## Context

本设计承接 `proposal.md`，目标是在 `apps/todo-demo/` 中构建一个基于 Vite + Vue 3 + TypeScript 的纯前端 Todo Demo。该 Demo 用于验证 AI Pilot 工作流（OpenSpec + TDD）在纯前端项目中的可行性与执行效率，覆盖需求分析、设计、实现、测试、代码审查的完整闭环。

当前状态为全新项目，无现有代码包袱。核心约束包括：
- 纯前端，无后端依赖
- 本地状态管理，数据持久化到 `localStorage`
- 视觉风格必须为轻量 Neo-brutalism，避免模板感
- 测试覆盖率目标 ≥ 80%

## Goals / Non-Goals

**Goals:**
1. 在 `apps/todo-demo/` 下搭建可独立运行的 Vite + Vue 3 + TypeScript 项目
2. 实现 Todo 的增、删、查、改（CRUD）核心功能
3. 使用 Vue 3 Composition API（`ref`/`reactive`/`computed`）进行本地状态管理
4. 使用 `localStorage` 实现数据持久化，并处理降级容错（QuotaExceeded / 隐私模式 / JSON 解析失败时回退内存存储）
5. 采用原生 CSS 手写 Neo-brutalism 风格 UI
6. 使用 Vitest + @vue/test-utils 编写单元测试，覆盖率 ≥ 80%
7. 输出 `openspec/specs/todo-app/spec.md` 作为本能力的 Delta Spec

**Non-Goals:**
- 后端接口、用户认证、多设备同步
- E2E 测试自动化（仅单元测试）
- PWA、SSR、国际化
- 复杂动画或第三方 UI 组件库

## Decisions

### 1. 项目脚手架：Vite 官方 Vue + TS 模板
**选择：** 使用 `npm create vite@latest todo-demo -- --template vue-ts` 作为起点。
**理由：**
- 启动快、配置少、与 Vue 3 + TS 原生集成最好
- 无需引入 Nuxt 等框架，避免过度工程

**替代方案：**
- Vue CLI：已被官方标记为 maintenance mode，不推荐新项目
- Nuxt：引入 SSR、路由、插件体系，超出纯前端 Demo 范围

### 2. 状态管理：自定义 Composable（`useTodos`）而非 Pinia/Vuex
**选择：** 将 Todo 状态封装在 `src/composables/useTodos.ts` 中，对外暴露 `todos`、`addTodo`、`removeTodo`、`updateTodo`、`toggleTodo` 等接口。
**理由：**
- 功能简单，自定义 composable 足够表达领域逻辑
- 减少依赖，降低构建体积和认知负担
- 便于单元测试：逻辑与 UI 解耦

**替代方案：**
- Pinia：功能强大但增加一个依赖，对单文件 CRUD 属于过度设计

### 3. 持久化：封装 `src/lib/storage.ts` 处理 localStorage 及降级
**选择：** 将 `localStorage` 读写逻辑抽象为独立模块，内部捕获所有异常并回退到内存 Map。
**理由：**
- 隔离副作用，便于测试时 mock
- 统一处理隐私模式（Safari 无痕模式下 `localStorage` 会抛异常）和存储配额超限
- 避免在组件或 composable 中直接访问 `window.localStorage`

### 4. 视觉风格：原生 CSS + Neo-brutalism 设计令牌
**选择：** 不使用 Tailwind 或任何 CSS 框架，全部使用原生 CSS。在 `src/styles/tokens.css` 中定义设计令牌（颜色、间距、阴影、边框），在组件级 CSS 中引用。
**理由：**
- Neo-brutalism 强调鲜明边框、高对比、有意的非均匀阴影，手写 CSS 更容易实现独特视觉
- 避免 Tailwind 的“默认模板感”
- 减少构建依赖

**设计令牌示例（规划中）：**
```css
:root {
  --color-bg: #f4f1ea;
  --color-surface: #ffffff;
  --color-text: #1a1a1a;
  --color-accent: #ff6b6b;
  --color-accent-2: #4ecdc4;
  --border-width: 3px;
  --shadow-offset: 4px;
}
```

### 5. 组件结构：按功能域组织
```
src/
├── components/
│   ├── TodoApp.vue       # 容器组件，组装子组件
│   ├── TodoInput.vue     # 新建任务输入
│   ├── TodoList.vue      # 列表渲染
│   └── TodoItem.vue      # 单个任务项（含编辑/删除）
├── composables/
│   └── useTodos.ts       # Todo 状态与操作
├── lib/
│   └── storage.ts        # localStorage 封装 + 降级
├── styles/
│   ├── tokens.css        # 设计令牌
│   └── global.css        # 全局重置与基础样式
└── types/
    └── todo.ts           # Todo 类型定义
```

**理由：**
- 符合 web/coding-style.md 中“按功能/领域组织，而非按文件类型”的要求
- 组件职责单一，便于测试和维护

### 6. 测试策略：Vitest + @vue/test-utils，优先覆盖 composables
**选择：**
- 使用 Vite 生态的 Vitest 作为测试运行器
- 使用 `@vue/test-utils` 挂载和交互组件
- 优先为 `useTodos.ts` 和 `storage.ts` 编写单元测试（逻辑密集、易断言）
- 为核心组件（`TodoInput`、`TodoItem`、`TodoList`）编写渲染和交互测试

**理由：**
- Vitest 与 Vite 原生集成，配置最少
- composables 是业务逻辑核心，覆盖它们能快速达到高覆盖率
- 组件测试聚焦用户交互（添加、删除、切换、编辑），避免过度测试渲染细节

### 7. TypeScript 类型：显式定义 `Todo` 接口
```ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}
```
**理由：**
- 明确领域模型，避免 `any`
- `id` 使用 `string`（`crypto.randomUUID()` 或自定义生成），避免数值精度问题

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| localStorage 在隐私模式下不可用，导致应用崩溃 | 在 `storage.ts` 中捕获异常并回退到内存存储 |
| 原生 CSS 手写 Neo-brutalism 可能导致样式不一致 | 在 `tokens.css` 中强制统一设计令牌，组件中禁止硬编码颜色/间距 |
| 测试覆盖率难以达到 80% | 优先测试 composables 和工具函数（逻辑权重高），组件测试聚焦核心交互 |
| 范围蔓延（例如想加过滤、排序、动画） | 严格对照 Non-Goals，任何新增功能需回到 proposal 层面审批 |
| Vue 3 响应式对初学者有陷阱（数组/对象深层响应） | 使用 `ref` 包裹整个数组，通过不可变更新（新数组替换）避免深层响应式问题 |

## Migration Plan

本变更属于全新项目，无现有数据或服务需要迁移。

**部署步骤：**
1. 在 `apps/todo-demo/` 下初始化 Vite 项目
2. 按本设计实现目录结构和核心代码
3. 编写单元测试并验证覆盖率 ≥ 80%
4. 运行 `npm run build` 验证生产构建无错误
5. 提交代码并创建 PR

**回滚策略：**
- 删除 `apps/todo-demo/` 目录及相关 spec 文件即可完全回滚，不影响现有系统

## Open Questions

1. **构建产物输出目录**：是否需要将 `dist` 输出到仓库根目录的特定位置供其他流程使用？（当前假设为默认 `dist/`）
2. **Node 版本约束**：项目是否需要指定 `.nvmrc` 或 `engines` 字段？（建议使用 Node 18+）
3. **spec 文件位置**：`openspec/specs/todo-app/spec.md` 是否需要与本次设计同步创建，还是由后续任务负责？
