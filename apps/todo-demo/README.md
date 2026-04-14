# Todo MVP (Vue + Vite)

一个基于 Vue 3 + Vite 的 Todo 应用，采用 Neo-brutalism 视觉风格。

## 环境要求

- Node.js 18+
- npm 9+
- Google Chrome（用于 E2E 测试）

## 安装依赖

```bash
npm install
```

## 开发运行

启动本地开发服务器：

```bash
npm run dev
```

默认服务地址为 `http://localhost:5173/`。

## 生产构建

编译并生成生产产物到 `dist/` 目录：

```bash
npm run build
```

## 预览生产构建

在本地预览已构建的生产版本：

```bash
npm run preview
```

默认服务地址为 `http://localhost:4173/`。

## 测试

### 单元测试

```bash
npm run test
```

带覆盖率报告：

```bash
npx vitest run --coverage
```

### E2E 测试（Playwright）

```bash
npx playwright test
```

E2E 配置使用本地已安装的 Chrome 浏览器（`channel: 'chrome'`），无需额外下载 Chromium。

## 技术栈

- Vue 3 (Composition API + `<script setup>`)
- TypeScript
- Vite
- Vitest + @vue/test-utils
- Playwright
