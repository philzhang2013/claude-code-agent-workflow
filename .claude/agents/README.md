# AI Pilot Subagent 库 v1.0（分阶段生成 + 双重 review 架构）

## 概述

本目录存放 AI Pilot 工作流中的子代理（Subagent）。

核心设计：**Step 2 的每个 artifact（proposal / design / spec / tasks）都必须先经过 AI review 再经过人工 review**，双重确认后才进入 TDD 实施阶段。

---

## 架构分层

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Layer 1: OpenSpec 原生能力（CLI / Skill）                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  • openspec-explore          → Step 1 需求澄清                                │
│  • openspec instructions     → 为每个 artifact 提供模板、规则和上下文          │
│  • openspec-apply-change     → 基础实现能力（被 GREEN 层包裹调用）             │
│  • openspec-archive-change   → 工作流末端归档                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Layer 2: AI Pilot Subagent 层                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  规范生成层（逐个 artifact 生成 + AI review + 人工 review）                    │
│    • proposal-writer  → 生成 proposal.md（调用 OpenSpec CLI 模板）           │
│    • design-writer    → 生成 design.md                                       │
│    • spec-writer      → 生成/更新 spec.md（Delta Spec）                       │
│    • task-writer      → 生成 tasks.md                                        │
│    • artifact-reviewer→ 通用 AI 审查员，覆盖上述 4 个 artifact               │
│                                                                              │
│  TDD 强化层（纪律执行与代码审查）                                             │
│    • openspec-tdd-orchestrator  → 总编排器                                   │
│    • task-splitter              → Step 3 TDD 校验                            │
│    • red-test-generator         → Step 4 RED                                 │
│    • red-verifier               → Step 4 验证门禁                            │
│    • green-implementer          → Step 5 GREEN                               │
│    • code-reviewer              → Step 6 通用代码审查                        │
│    • spec-compliance-reviewer   → Step 6 规范审查                            │
│    • quality-security-reviewer  → Step 6 质量安全审查                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 完整工作流

```
Step 1: openspec-explore (Skill)
    ↓ 输出：澄清后的需求范围、Change-ID、capability

Step 2-A: proposal-writer (Subagent)
    ↓ 输出：@openspec/changes/<change-id>/proposal.md
Step 2-A-R: artifact-reviewer (AI review)
    ════════════════════════ 门禁 ════════════════════════
    ↓ 通过
Step 2-A-H: 人工 review
    ════════════════════════ 门禁 ════════════════════════
    ↓ 通过

Step 2-B: design-writer (Subagent)
    ↓ 输出：@openspec/changes/<change-id>/design.md
Step 2-B-R: artifact-reviewer (AI review)
    ════════════════════════ 门禁 ════════════════════════
    ↓ 通过
Step 2-B-H: 人工 review
    ════════════════════════ 门禁 ════════════════════════
    ↓ 通过

Step 2-C: spec-writer (Subagent)
    ↓ 输出：@openspec/specs/<capability>/spec.md
Step 2-C-R: artifact-reviewer (AI review)
    ════════════════════════ 门禁 ════════════════════════
    ↓ 通过
Step 2-C-H: 人工 review
    ════════════════════════ 门禁 ════════════════════════
    ↓ 通过

Step 2-D: task-writer (Subagent)
    ↓ 输出：@openspec/changes/<change-id>/tasks.md
Step 2-D-R: artifact-reviewer (AI review)
    ════════════════════════ 门禁 ════════════════════════
    ↓ 通过
Step 2-D-H: 人工 review
    ════════════════════════ 门禁 ════════════════════════
    ↓ 通过

Step 3: task-splitter (Subagent)
    ↓ 输出：校验后 tasks.md
    ═══════════════════════════════════════════════════════════════
    【第一阶段门禁：规范冻结】
    ═══════════════════════════════════════════════════════════════
    ↓ 通过

Step 4: red-test-generator (Subagent)
    ↓ 输出：失败测试代码 + RED 报告

Step 4-V: red-verifier (Subagent)
    ↓ 输出：RED 验证报告
    ═══════════════════════════════════════════════════════════════
    【第二阶段门禁：RED/GREEN 隔离】
    关键动作：green-implementer 必须使用 isolation: "worktree"
    ═══════════════════════════════════════════════════════════════
    ↓ 通过

Step 5: green-implementer (Subagent)
    ↓ 输出：实现代码 + GREEN 报告

Step 6-A: code-reviewer (Subagent)
Step 6-B: spec-compliance-reviewer (Subagent)
Step 6-C: quality-security-reviewer (Subagent)
    ↓ 输出：三审查报告
    ═══════════════════════════════════════════════════════════════
    【第三阶段门禁：预合并验收】
    ═══════════════════════════════════════════════════════════════
    ↓ 通过

Step 7: openspec-archive-change (Skill)
    ↓ 输出：归档完成的 change
```

---

## 子代理清单

| 序号 | 文件 | 职责 | 上游 | 下游 | 核心铁律 |
|---|---|---|---|---|---|
| 1 | `openspec-tdd-orchestrator.md` | 总编排器 | 工程师指令 | Skill/Subagent | 未通过门禁严禁进入下一阶段 |
| 2 | `proposal-writer.md` | Step 2-A：生成 proposal.md | `openspec-explore` | `artifact-reviewer` | 必须调用 OpenSpec CLI 获取模板 |
| 3 | `design-writer.md` | Step 2-B：生成 design.md | `proposal-writer` + 人工 review | `artifact-reviewer` | 必须与 proposal 一致 |
| 4 | `spec-writer.md` | Step 2-C：生成/更新 spec.md | `design-writer` + 人工 review | `artifact-reviewer` | SHALL 可追溯、Delta 标记规范 |
| 5 | `task-writer.md` | Step 2-D：生成 tasks.md | `spec-writer` + 人工 review | `artifact-reviewer` | 必须包含 RED/GREEN/IMPROVE |
| 6 | `artifact-reviewer.md` | Step 2 通用 AI 审查员 | 各 writer | `openspec-tdd-orchestrator` | 阻断/HIGH 问题必须退回修正 |
| 7 | `task-splitter.md` | Step 3：校验 tasks.md | `task-writer` + 人工 review | `red-test-generator` | 任务粒度 0.5-2 人日 |
| 8 | `red-test-generator.md` | Step 4：生成失败测试 | `task-splitter` | `red-verifier` | **严禁读取任何实现文件** |
| 9 | `red-verifier.md` | Step 4 验证 | `red-test-generator` | `green-implementer` | 全部通过才能进 GREEN |
| 10 | `green-implementer.md` | Step 5：最小实现 | `red-verifier` | 三 reviewer | **严禁修改测试逻辑** |
| 11 | `code-reviewer.md` | Step 6：通用代码审查 | `green-implementer` | `orchestrator` | 架构一致、可读性、团队规则 |
| 12 | `spec-compliance-reviewer.md` | Step 6：规范审查 | `green-implementer` | `orchestrator` | 偏离标 HIGH/CRITICAL |
| 13 | `quality-security-reviewer.md` | Step 6：质量安全审查 | `green-implementer` | `orchestrator` | 安全问题必须 BLOCK |

---

## TDD 隔离机制

1. **red-test-generator** 严禁读取实现文件
2. **red-verifier** 验证测试编译且因实现缺失而失败
3. **green-implementer** 调用时**必须使用** `Agent` 工具的 `isolation: "worktree"`
4. **green-implementer** 严禁修改任何测试逻辑

---

## 回退通道

若 Step 5 实现揭示设计缺陷，允许经工程师确认后回退至 Step 2-B/2-C/2-D。  
同一 change 回退次数超过 **3 次**时，必须警告并建议人工复盘。
