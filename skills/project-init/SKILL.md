---
name: project-init
description: 用于新项目初始化或给已有项目建立轻量 AI 工作基线。触发于：新项目第一天、已有项目无 PROJECT.md、项目方向大改需重建基线。产出 PROJECT.md 含目标/非目标/MVP/技术边界/AI风险/验证方式/seed tasks。
---

# Project Init

## 用途

新项目初始化，或给已有项目建立轻量 AI 工作基线。

产出项目根目录的 `PROJECT.md`，作为整个项目的长期基线文档。后续 project-work 读取它判断方向，project-finish 必要时更新它，project-audit 校验它是否过期。

---

## 何时用

- 新项目第一天
- 已有项目但没有 `PROJECT.md`
- 项目方向大改，需要重建基线（原 PROJECT.md 已不反映真实目标）

---

## 何时不用

- 已有 `PROJECT.md` 且没大改 → 用 project-work
- 纯粹查问题或复盘 → 用 project-work 或 project-audit
- 只改一个 typo 或小 bug → 直接改，不触发 init

---

## 关键规则

### 必须产出 PROJECT.md

`PROJECT.md` 必须含 7 节：

1. **目标** — 这个项目要解决什么问题，1-3 句话。
2. **非目标** — 明确不做什么。防止 AI 过度设计。
3. **MVP** — 最小可用版本包含哪些功能。
4. **技术边界** — 语言、依赖、存储、平台限制。
5. **AI 风险** — AI 在这个项目里容易犯什么错（过度设计 / 引入依赖 / 偏离目标）。
6. **验证方式** — 怎么确认功能可用。个人项目可以只写"手动跑命令验证"。
7. **seed tasks** — 第一批启动任务，≤ 5 条。仅用于启动项目，不是长期任务列表。

### 不写代码，不建脚手架

project-init 只产出文档。代码交给 project-work 写。不要在 init 阶段创建 `src/`、`package.json`、`main.py` 等。

### seed tasks 是启动用，不是任务列表

seed tasks ≤ 5 条，用于第一轮 project-work 启动。后续的 Next 写在 commit message 里，不回写到 PROJECT.md。不要把 PROJECT.md 变成长期任务看板。

### 不替用户 git commit

project-init 可以生成 initial commit message 供用户确认，但不要执行 `git commit`。提交动作交给用户，或交给 project-finish 处理。这与 project-finish 的规则一致。

### 范例参考

完整的 PROJECT.md 范例见 `docs/examples.md`。

### 核心原则

详见 `docs/design-principles.md`。重点是：轻量优先、Git 是事实源、文档只保存长期基线。

---

## 完成后下一步

1. 把 PROJECT.md 交给用户确认。
2. 用户确认后：
   - 用户自行 `git add PROJECT.md && git commit`，或
   - 进入 project-finish 走提交流程（生成 commit message 供确认）。
3. 提交后进入 project-work，从 seed tasks 的第一条开始推进。
