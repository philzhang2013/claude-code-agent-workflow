# AI Pilot 工作流设计文档

> 目标：在 1 个全栈业务团队中，用 6-8 周跑通"需求→编码→测试"的 AI 增强闭环，产出可复制的 SOP 和度量数据。

> **术语说明**：本文档中的 **OpenSpec** 是指由 [Fission AI](https://github.com/Fission-AI/OpenSpec) 开源的 Spec-Driven Development（SDD）CLI 框架，专注于为 AI 编程助手提供轻量级、可迭代的规范驱动工作流。
> - **官方地址**：[https://github.com/Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)  
> - **安装方式**：`npm install -g @fission-ai/openspec@latest`（要求 Node.js ≥ 20.19.0），然后在项目根目录执行 `openspec init`；
> - **核心理念**：fluid（灵活而非僵化）、iterative（迭代而非瀑布）、brownfield-first（优先适配存量系统）；
> - **目录结构**：
>   - `openspec/specs/<capability>/spec.md` — 以能力维度组织的**活文档（Living Specs）**，使用 Markdown 格式；
>   - `openspec/changes/<change-id>/` — 每个变更的临时工作区，包含 `proposal.md`（变更提案）、`design.md`（技术设计）、`tasks.md`（任务清单）、`specs/`（本次变更的 **Delta Spec**，以 `+`/`-` 形式表达需求的增删改）；
> - **规范格式**：Requirement 采用 `SHALL` 语句，Scenario 采用 `GIVEN/WHEN/THEN` 行为驱动（BDD）格式；
> - **与 AI 协同**：原生支持 Claude Code 等 20+ 工具，通过 `/opsx:propose`、`/opsx:apply`、`/opsx:archive` 等命令完成“提案→实现→归档”闭环；
> - **关于 TDD 的说明**：**TDD 不是 OpenSpec 框架自身的强制要求**，而是本试点为提升代码质量、降低返工率在 OpenSpec SDD 基础上**额外强化的工程纪律**。OpenSpec 的 `tasks.md` 默认只列出实现任务，本试点要求将 `"生成失败测试（RED）"` 和 `"让测试通过（GREEN）"` 作为 `tasks.md` 中的强制前置步骤；
> - **试点要求**：OpenSpec 文件须作为代码仓库的一部分提交，由 PR reviewers 和 CI 共同校验。

---

## 1. 背景与驱动力

- **组织规模**：整体研发团队 150+ 人
- **试点范围**：1 个全栈业务团队（前端 React/Vue + 后端 Java/Go/Node + 客户端 Flutter/RN）
- **工作模式**：Kanban 流式拉取，无严格 Sprint
- **核心驱动力**：提升人效（A）+ 提升质量（B）
- **设计原则**：先试点验证，再规模化复制

---

## 2. 目标与成功标准

### 2.1 目标
在 6-8 周内，在试点团队建立并跑通以 **OpenSpec SDD + AI 辅助 + TDD** 为核心的增强工作流，产出可直接供第 2 个团队复用的 SOP。

### 2.2 成功标准

| 指标 | 基线 | 目标 | 口径说明 |
|---|---|---|---|
| 单需求平均设计+编码+自测时长 | 试点前 4 周均值 | 下降 ≥ 20% | **需求粒度**：Kanban 卡片，估算工时 1-5 人日；**起止**：从 Step 1（AI 需求预分析）开始到 Step 7（人工 Code Review 通过）结束；**扣除**：等待 review、会议阻塞、环境故障时间；按工时估算分层统计（1-2 日 / 3-5 日） |
| 首次提测后 bug 数/需求 | 试点前 4 周均值 | 下降 ≥ 15% | **需求粒度**：同上；**首次提测**：代码合并到测试分支后 QA 进行的第一次系统测试；**统计范围**：严重 + 高优先级 bug；**控制变量**：每个需求在启动前由 TL 评定复杂度（简单/中等/复杂） |
| 需求返工率 | 试点前 4 周均值 | 下降 ≥ 20% | **定义**：已进入 Step 4（TDD/编码阶段）的卡片，因需求或设计变更退回 Step 1 或 Step 2 的比例；**统计方式**：看板状态流转数据客观计算 = 试点期内返工卡片数 / 试点期内总完成卡片数 |
| AI 生成测试首次通过率 | — | ≥ 70% | **定义**：AI 生成的测试代码在未经人工修改测试逻辑的前提下，首次本地/CI 运行的通过率；允许修改被测实现代码、import 路径、环境配置；**统计方式**：通过 / 失败（分需求记录） |
| 团队认同度（匿名问卷） | — | ≥ 7/10 | 第 4 周、第 8 周各发放一次匿名问卷，满分 10 分 |

### 2.3 Go/No-Go 退出标准

为避免沉没成本谬误，设置以下硬性退出条件。若第 4 周中期复盘时同时满足以下任意一条，则试点进入"优化模式"（暂停扩大，聚焦根因修复）；若第 8 周终期复盘时仍满足，则试点终止，不进入规模化阶段：

- 团队认同度 < 5/10，且已排除工具部署等外部干扰因素；
- 超过 3 个核心指标未达目标（核心指标指：时长、bug 数、返工率、AI 测试首次通过率）；
- 单需求平均设计+编码+自测时长**上升** ≥ 10%，且原因可归因为本工作流本身。

### 2.4 边界（明确不包含）
- 不碰运维发布、跨团队大需求协同、安全合规审计
- 不替换人的最终决策权和 Code Review 终审权
- 不测不可量化的"幸福感"指标

---

## 3. 工具链与角色

### 3.1 统一工具链

| 环节 | 工具 | 用途 |
|---|---|---|
| 需求/设计 | Claude Code (planner agent) + 飞书/Notion | 需求拆解、技术方案草稿、任务拆分 |
| 规范定义 | OpenSpec（`openspec init` + `/opsx:propose`） | Capability Spec、Delta Spec、变更提案（`proposal.md`）、任务清单（`tasks.md`） |
| 编码 | Claude Code | 代码生成、重构、bug 定位 |
| 测试 | Claude Code (tdd-guide agent) + 现有测试框架 | 测试生成、边界补强 |
| Review | code-reviewer / ts-reviewer / go-reviewer / flutter-reviewer agent | 自动代码审查、安全检查 |

**关键决定**：试点期统一使用 Claude Code，不接受混用 Cursor/Copilot，确保数据干净、可复制。
- **Week 0（启动前）**：2 周并行体验期，团队可在非试点需求上自由试用 Claude Code，熟悉操作和 prompt 写法；
- **Week 1 起**：所有被标记为"AI Pilot 需求"的卡片，必须在编码、测试、AI Review 环节中统一使用 Claude Code；非试点需求不做强制要求；
- **目的**：通过体验期降低切换阻力，通过"试点需求强制、其他需求自愿"的边界保证度量数据干净。

### 3.2 角色定义（不新增编制）

| 角色 | 职责 | 人选 |
|---|---|---|
| AI Pilot Lead | 推动工作流落地、调优 prompt、解决卡点、汇总反馈 | 技术负责人或 Senior Engineer |
| AI Tooling Owner | 维护 prompt 模板库、agent 配置、内部知识库 | 团队内技术热情高的工程师 |

---

## 4. AI + OpenSpec 增强工作流（8 步）

```
需求进入 Kanban Backlog
        ↓
Step 1: AI 需求预分析
        ↓
Step 2: OpenSpec 规范生成 ★强制检查点 1：规范冻结★
        ↓
Step 3: AI 任务拆分
        ↓
Step 4: TDD - AI 生成测试（RED）
        ↓
Step 5: AI 辅助编码（GREEN）
        ↓
Step 6: AI Code Review ★强制检查点 2：Review 门禁★
        ↓
Step 7: 人工 Code Review
        ↓
Step 8: OpenSpec 验收回归 ★强制检查点 3：合并前验收★
        ↓
合并发布
```

**关于 TDD 的执行原则**：
- **注意**：本试点的 TDD 纪律是在 OpenSpec SDD 之上的**额外约束**。OpenSpec 本身不强制 RED-GREEN 流程，但本试点要求将 TDD 作为 `tasks.md` 中的强制阶段，以保证 Spec 的可执行性；
- Step 4 生成的测试代码必须**先于实现**编写，且首次运行时应**有意使其失败**（RED），以验证测试确实能捕获未实现的行为；
- 禁止在同一 AI 上下文中先"偷看"实现再写测试；推荐使用**独立的 AI 会话**或**人工主导**完成 Step 4；
- Step 5 仅在测试失败后才启动，实现目标是让测试通过（GREEN），随后进入 Step 6-7 重构（IMPROVE）。

### 4.1 Step 1: AI 需求预分析
- **输入**：PRD / 用户故事 / 接口文档
- **AI 输出**：技术方案草稿、验收标准、风险点
- **人**：PM / TL 审阅、确认、修改
- **审核清单**：① 需求范围是否清晰 ② 验收标准是否可量化 ③ 技术风险是否被识别

### 4.2 Step 2: OpenSpec 规范生成 ★强制检查点 1：规范冻结★
- **输入**：确认后的技术方案
- **AI + OpenSpec 输出**（存放于 `openspec/changes/<change-id>/`）：
  - `proposal.md` — 变更原因、影响范围、验收标准（SMART 化条款）
  - `design.md` — 技术方案、接口约定、数据模型、前端交互设计
  - `tasks.md` — 可执行的任务清单与依赖关系
  - `specs/<capability>/spec.md` — **Delta Spec**，以 `+`/`-` 形式表达本次变更对相关能力规范的增删改；规范正文采用 `SHALL` 需求语句 + `GIVEN/WHEN/THEN` 场景
- **通过标准**（需同时满足）：
  1. Delta Spec 明确覆盖了本需求引入的所有新增/变更/移除行为，无歧义；
  2. 验收标准已 SMART 化（具体、可测、可分阶段验收）；
  3. 至少由 PM（业务侧）+ TL（技术侧）两人在方案评审会上确认通过；
  4. OpenSpec 变更文件已提交到仓库的 `openspec/` 目录，并在会议记录或 PR 中留痕。
- **规则**：规范未通过，不允许进入开发

### 4.3 Step 3: AI 任务拆分
- **输入**：已冻结的 OpenSpec 规范（`proposal.md`、`design.md`、Delta Spec）
- **AI 输出**：写入 OpenSpec `tasks.md` 的任务清单
- **规则**：
  1. 子任务必须与 Spec 中的验收标准一一映射；
  2. 子任务粒度应控制在 0.5-2 人日；
  3. **`tasks.md` 必须显式包含 TDD 阶段**：每个涉及代码变更的能力，任务清单中须拆出 `"生成失败测试（RED）"` 和 `"实现代码使测试通过（GREEN）"` 两个前置任务；OpenSpec 默认只列实现任务，本试点强制补上测试任务。

### 4.4 Step 4: TDD - AI 生成测试（RED）
- **输入**：OpenSpec 中的验收标准
- **AI 输出**：单元测试 / 集成测试 / 契约测试代码
- **关键约束**：
  - 测试必须验证 Spec，而不是验证"我认为应该怎么做"；
  - 测试首次运行应**失败**（RED），以证明测试对未实现行为敏感；
  - 若测试首次即通过，须检查测试是否写错或实现已提前泄露。
- **规则**：没有可运行的失败测试，不允许进入编码环节

### 4.5 Step 5: AI 辅助编码（GREEN）
- **输入**：失败的测试代码 + OpenSpec 规范
- **AI 输出**：实现代码
- **原则**：代码必须满足 OpenSpec，测试是 Spec 的可执行表达；AI 编码时以"让当前失败的测试变绿"为最小目标

### 4.6 Step 6: AI Code Review ★强制检查点 2：Review 门禁★
- **输入**：代码 diff
- **AI 输出**：质量 / 安全 / 性能问题清单
- **扩展检查（兜底机制）**：
  - 代码行为是否与 OpenSpec Capability Spec / Delta Spec 一致？
  - 是否偏离了 `design.md` 中的接口与数据模型约定？
  - *说明：此处是作为 Step 2 冻结后的最终兜底，若发现偏离，应直接打回 Step 2 或 Step 5，不允许带 Spec 偏差进入人工 review。*
- **通过标准**：
  1. AI 报告中的 HIGH/CRITICAL 问题已被修复或有人工 override；
  2. **人工 override 机制**：工程师如认为 AI 的 HIGH/CRITICAL 是误报，须在 PR 中 @Pilot Lead 并附理由，Pilot Lead  arbitrates 后关闭；
  3. Pilot Lead 每周对 AI 的 HIGH/CRITICAL 进行抽样校验，累计误报率 > 30% 时，须暂停门禁并优化 prompt/配置。
- **规则**：AI review 报告中未关闭的 HIGH/CRITICAL 问题，不允许进入人工 review

### 4.7 Step 7: 人工 Code Review
- **人**：同事 review
- **关注**：架构、业务语义、Spec 符合性
- **AI 不参与**

### 4.8 Step 8: OpenSpec 验收回归 ★强制检查点 3：合并前验收★
- **执行方式**：CI 自动运行由 OpenSpec 驱动的契约测试 / 验收测试；测试用例直接引用 `openspec/specs/` 中的 Capability Spec 和 Delta Spec 作为行为依据
- **失败处理**：
  - 若验收失败源于代码实现问题 → **打回 Step 5**；
  - 若验收失败源于 OpenSpec 本身错误（如 Capability Spec / Delta Spec 与实际约束冲突） → **打回 Step 2**，修正后重新冻结；
  - 若因 CI 环境问题导致假失败 → 由 Pilot Lead 确认后重跑。
- **规则**：验收失败，代码不允许合并

### 4.9 Kanban 状态映射（试点期建议新增）

**新增状态及流转关系**：

```
Backlog → AI Design → OpenSpec Review → In Progress → AI Review → Code Review → Done
              ↑            ↓ (打回)              ↑ (打回)                    ↓
              └────────────┘                    └─ (打回 Step 2 或 Step 5)
```

| 状态 | 含义 | 进入条件 | 退出条件 |
|---|---|---|---|
| Backlog | 待排期的需求 | 常规 | 团队决定进入试点 |
| AI Design | 需求已进入，正在用 AI 做技术方案 | 从 Backlog 拉取 | Step 1 审核清单通过 |
| OpenSpec Review | 正在评审/冻结 OpenSpec 规范 | AI Design 完成 | 强制检查点 1（规范冻结）通过 |
| In Progress | 进入 TDD + AI 编码 | OpenSpec Review 通过 | Step 5 编码完成 |
| AI Review | 代码已写完，正在过 AI code review | In Progress 完成 | 强制检查点 2（Review 门禁）通过 |
| Code Review | 人工代码审查 | AI Review 通过 | Step 7 人工 review 通过 |
| OpenSpec Regression | 合并前 OpenSpec 验收回归 | Code Review 通过 | 强制检查点 3（验收通过） |
| Done | 验收通过，允许合并发布 | 强制检查点 3 通过 | — |

**说明**：
- `OpenSpec Review` 不满足条件时，可退回 `AI Design` 重新分析；
- `AI Review` 不满足条件时，可退回 `In Progress` 重新编码，若发现 Spec 本身错误则退回 `OpenSpec Review`。

---

## 5. 度量与反馈体系

### 5.1 基线采集（第 1 周，试点启动前）

| 指标 | 采集方式 | 口径对齐 |
|---|---|---|
| 单需求平均设计+编码+自测时长 | 近 4 周 Kanban/工时均值，按 1-2 日 / 3-5 日分层 | 起止定义与 2.2 一致，扣除等待时间 |
| 首次提测后 bug 数/需求 | 近 4 周 bug 系统均值（严重+高优先级） | 按 TL 评定的复杂度（简单/中等/复杂）分层统计 |
| 需求返工率 | 近 4 周看板状态流转数据：返工卡片 / 总完成卡片 | 返工定义与 2.2 一致（退回 Step 1 或 2） |
| Code Review 往返轮次 | Git 平台统计 | 统计人工 review 的来回次数 |
| 测试覆盖率 | CI 报表 | 单元 + 集成测试覆盖率 |

### 5.2 试点期追踪指标

| 指标 | 目标 | 追踪方式 | 负责人 |
|---|---|---|---|
| 单需求平均设计+编码+自测时长 | 下降 ≥ 20% | 每个需求到达 Done 时由工程师记录起止时间，Pilot Lead 每周汇总 | Pilot Lead |
| 首次提测后 bug 数/需求 | 下降 ≥ 15% | QA 在首次提测后 3 个工作日内记录的 bug 数，与基线同口径对比 | AI Tooling Owner |
| 需求返工率 | 下降 ≥ 20% | 由看板状态自动统计，每周五出数 | Pilot Lead |
| AI 生成测试首次通过率 | ≥ 70% | 每个需求在 Step 4 记录：AI 生成的原始测试首次运行结果（通过/失败） | AI Tooling Owner |
| AI Code Review 有效问题数/PR | 记录趋势 | 统计每 PR 的 HIGH/CRITICAL 命中数，以及 override 次数 | AI Tooling Owner |
| 团队认同度 | ≥ 7/10 | 第 4 周、第 8 周匿名问卷 | Pilot Lead |

### 5.3 反馈机制与决策权

**每周 30 分钟 AI Pilot 站会（周五下午）**：
1. 本周哪些需求跑通了新工作流？
2. OpenSpec 卡点在哪里？
3. AI 生成的测试/代码质量如何？（举例分享）
4. 下周优化的 1-2 个动作是什么？

**第 4 周中期复盘**：
- **参会人**：AI Pilot Lead + TL + 研发总监（或授权代表）三方评议；
- **决策项**：继续按原方案推进 / 进入优化模式（见 2.3 Go/No-Go）/ 终止试点；
- **输出**：《第 4 周复盘纪要》，包含数据对比、主观反馈汇总、下阶段决议。

**第 8 周终期复盘**：
- **参会人**：同上；
- **输出**：《AI 工作流 SOP v1.0》、试点总结报告（含规模化建议）、反模式/避坑指南。

---

## 6. 风险与应对

### 6.1 筛选试点需求的标准

为降低"交付节奏被打乱"的风险，首批试点需求必须同时满足：
- 优先级为 P1/P2（非 P0 紧急需求）；
- 业务方预期排期剩余 >= 2 周（为工作流磨合留 buffer）；
- 估算工时 1-5 人日（过大需求拆分后再纳入）；
- 不依赖其他团队同步交付的接口（减少外部变量）。

**执行人**：Pilot Lead 与 TL 在每周排期会上共同筛选，并在看板卡片上打"AI Pilot"标签。

### 6.2 风险清单

| 风险 | 概率 | 影响 | 应对策略 | 触发条件 | 决策人 |
|---|---|---|---|---|---|
| 团队抵触统一换 Claude Code | 中 | 高 | Week 0 并行体验期 + Pilot Lead 陪跑前 3 个需求；若陪跑后仍有 2 人以上的硬性抵触，可允许其在非试点需求使用原工具 | 抵触人数 >= 2 人或认同度 < 5/10 | Pilot Lead |
| OpenSpec 写得太重，拖慢启动 | 高 | 中 | 第一周出 OpenSpec 最小模板，只含 Capability 的 Purpose + 核心 SHALL 需求 + 关键 GIVEN/WHEN/THEN 场景 + 验收标准，严禁过度设计；若单个 Spec 文档讨论超过 2 天未冻结，强制切分需求 | 单个 Spec 评审 > 2 天未通过 | TL |
| AI 生成测试质量差 | 中 | 高 | 前 2 周 Pilot Lead 审核每份 AI 测试，沉淀 prompt；若连续 3 个需求首次通过率 < 40%，暂停工作流 1 天集中优化 prompt | 连续 3 个需求首次通过率 < 40% | Pilot Lead |
| AI review 误报太多 | 中 | 中 | 只拦截 HIGH/CRITICAL，低级别仅建议；若周度 HIGH/CRITICAL 误报率 > 30%，暂停 Review 门禁并优化 prompt | 周度误报率 > 30% | Pilot Lead |
| 交付节奏被打乱，老板质疑 | 低 | 极高 | 严格按 6.1 筛选试点需求；若试点需求平均延期 > 20%，立即缩小试点范围（只保留 1-2 人） | 试点需求延期率 > 20% | Pilot Lead + TL |
| 数据不够显著，无法规模化 | 中 | 高 | 第 4 周中期复盘评估；若进入优化模式，延至 10-12 周；终期仍有 >= 3 项核心指标未达标，则终止试点（见 2.3 Go/No-Go） | 第 8 周 >= 3 项核心指标未达标 | Pilot Lead + TL + 研发总监 |

---

## 7. 产出物清单

| 产出物 | 负责人 | 交付时间 |
|---|---|---|
| OpenSpec 最小模板 | AI Tooling Owner | 第 1 周末 |
| Prompt 库 v1.0 | AI Tooling Owner | 第 2 周末 |
| 试点周度数据看板 | AI Pilot Lead | 从第 2 周起每周更新 |
| 《AI 工作流 SOP v1.0》 | AI Pilot Lead | 第 8 周末 |
| 试点总结报告（含规模化建议） | AI Pilot Lead | 第 8 周末 |
| 《AI Pilot 避坑指南 / 反模式案例集》 | AI Pilot Lead + AI Tooling Owner | 第 8 周末 |

**避坑指南内容要求**：整理试点期间至少 5 个真实踩坑案例，涵盖常见的 Prompt 失效模式、OpenSpec 过度设计陷阱、AI Review 误报场景，用于帮助第 2 个团队快速绕过已知问题。

---

## 8. 下一步

本文档确认后，由 **AI Pilot Lead** 在 **3 个工作日内**牵头完成以下动作：
1. 召开启动会，向试点团队宣讲本工作流、回答疑问、收集反馈；
2. 产出 **Implementation Plan**（任务清单、时间表、责任人、第 1 周 OpenSpec 模板草稿）；
3. 在看板系统中配置 4.9 节所述的新增状态和标签规则；
4. 建立试点数据记录模板（时长、首次测试通过、AI Review 结果），并发给团队。
