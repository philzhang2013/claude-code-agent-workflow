## Why

为了验证 AI Pilot 工作流（OpenSpec + TDD）在纯前端 Vue 3 项目中的可行性与执行效率，需要一个功能完整但范围可控的待办任务（Todo）Demo 作为试点需求。该 Demo 将覆盖从需求分析到代码实现、测试、代码审查的完整闭环。

## What Changes

- 在 `apps/todo-demo/` 目录下新建基于 Vite + Vue 3 + TypeScript 的纯前端项目
- 实现待办任务的增、删、查、改（CRUD）核心功能
- 使用 Vue 3 Composition API（`ref`/`reactive`）进行本地状态管理
- 使用 `localStorage` 实现页面刷新后的数据持久化，并带降级容错（QuotaExceeded / 隐私模式 / JSON 解析失败时回退内存存储）
- 采用原生 CSS 手写 UI，视觉风格定为 **轻量 Neo-brutalism**（鲜明边框、高对比色、有意的阴影层次、非模板化布局）
- 测试策略：**Vitest** + **@vue/test-utils**，单元测试覆盖所有 composables 和核心组件，目标覆盖率 **≥ 80%**
- **范围外**：后端接口、用户认证、多设备同步、E2E 测试自动化

## Capabilities

### New Capabilities
- `todo-app`: 纯前端待办任务管理应用的核心能力，包括任务的创建、展示、编辑、删除及本地持久化。

### Modified Capabilities
- 无（本次为全新能力，不修改现有 spec）。

## Impact

- **新增目录**：`apps/todo-demo/` 及其内部的 Vite 标准目录结构
- **依赖新增**：`vue@^3`, `vite`, `typescript`, `@vitejs/plugin-vue`
- **构建影响**：无现有构建流程冲突（独立子项目）
- **规范影响**：需在 `openspec/specs/todo-app/spec.md` 中定义本能力的 Delta Spec
