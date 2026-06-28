---
name: project-init
description: 用于新项目初始化或给已有项目建立轻量 AI 工作基线。触发于：新项目第一天、已有项目无 PROJECT.md、项目方向大改需重建基线。AI 主导需求澄清与基线生成，产出 PROJECT.md 9 节。AI 澄清需求、提候选方案，用户拍板关键决策。
---

# Project Init

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

### Decision Ownership：AI 澄清，用户拍板

project-init 是 AI 主导的需求澄清和基线生成，不是 AI 替用户拍板。

- AI 可以分析、整理、提出候选方案、比较取舍、给出推荐。
- AI 不能替用户决定 Goal / MVP / Non-goals / Tech Direction / Validation / Seed Tasks。
- AI 的推荐不是决定。AI 的假设不是基线事实。
- 不要询问"你希望 AI 帮你做哪部分"——默认 AI 在确认边界内推进。
- 不要根据项目标签直接选择技术栈。

### 流程：AI 主导，单次确认

4 阶段，内部顺序，不暴露为命令。**默认只有一次基线确认**，不打断用户。

```
[阶段 A] 需求澄清
  ├─ AI 读用户原话 + 第一轮 ≤5 问题（可答"不知道"）
  ├─ AI 输出需求分析表：用户原话 / AI 理解 / 待确认假设 / 已确认决策
  ├─ AI 标记阻塞问题（≤2 个），其余作假设推进
  └─ 阻塞才停下；不阻塞则 AI 直接推进到阶段 B
         │
         ▼
[阶段 B] 候选方案分析（AI 自动推进，不打断）
  ├─ 基于需求推导技术约束，不套标签
  ├─ 输出 2-3 个候选技术方向：适用场景 / 代价 / 不选原因 / 推荐
  ├─ 草拟 MVP、Non-goals、Validation、Seed Tasks
  └─ 把未确认内容归到 Assumptions / Pending Questions（只在 AI 回复中展示）
         │
         ▼
[阶段 C] 基线确认包（AI 自动生成，交用户一次性确认）
  ├─ AI 输出一份 baseline decision packet
  ├─ 必须覆盖 PROJECT.md 全部 9 节：Goal / Users and Scenarios / MVP / Inputs and Outputs / Non-goals / Tech Direction / Constraints and Working Rules / Validation / Seed Tasks
  └─ 用户确认整份基线，不逐项审批
         │
         ▼
[阶段 D] 生成 PROJECT.md（确认后才写）
  ├─ 只写已确认内容为事实
  ├─ 未确认内容不写入 PROJECT.md
  └─ 生成 initial commit message 供用户确认（不提交）
```

### 第一轮问题

一次性问完，≤ 5 个，低门槛，可答"不知道"。围绕 need 而非 solution：

1. 你想解决什么问题？什么场景下觉得现有办法不够？
2. 第一版做到什么算"能用"？最低限度是什么？
3. 谁会用？一个人还是给别人？
4. 主要输入和输出是什么？数据从哪来，到哪去？
5. 有硬约束吗？参考材料、已有代码、必须用的工具、平台限制？

### 阻塞 vs 非阻塞

**只有以下情况是阻塞问题，必须用户回答**：

- 连"想解决什么问题"都说不清（无法推导 Goal）
- 用户目标内部自相矛盾（如"要离线运行"但"要实时同步"）
- 硬约束与需求矛盾
- 已有项目事实（Git / 文件）和用户目标冲突

**其余信息缺失一律非阻塞**：AI 作假设继续推进，在回复中展示 Assumptions，不连续追问。用户可以回答"不知道"，project-init 仍然可以继续生成 Baseline Decision Packet。

**例外**：当外部数据来源、鉴权方式、本地登录态 / API 可用性、设备权限、平台限制等信息会决定核心 MVP 是否可行或决定主要实现路径时，不能把它当作普通 Assumption，也不能把真实接入写成已确认任务。Seed Tasks 必须先安排调查 / mock 验证，确认可行后再接入真实逻辑。

### 需求分析分层

AI 必须显式区分 4 层，防止把理解当事实：

| 层 | 含义 | 能否写入 PROJECT.md 基线 |
|---|---|---|
| **用户原话** | 用户字面说的 | 否（只是输入） |
| **AI 理解** | AI 转述的需求 | 否（待确认） |
| **待确认假设** | 信息不足时 AI 补的假设 | 否 |
| **已确认决策** | 用户确认过的 | 是 |

需求分析表只在 project-init 的回复中展示，**不原样塞进 PROJECT.md**。它的作用是防止 AI 把理解当事实。

### 技术方向生成逻辑

不要根据项目标签选栈（如"todo 工具 → Python"）。必须从需求、使用场景、输入输出、运行环境、硬约束、成功标准推导。

1. 从 Goal / Users / I/O / Constraints 提取技术约束。
2. 输出 2-3 个候选方向，每个含：
   - **适用场景**：什么需求下它合适
   - **代价**：学习成本 / 依赖体积 / 维护负担
   - **不选它的原因**：什么情况下它是错的选择
   - **推荐**：AI 给一个推荐 + 理由（推荐不是决定）
3. 明确列出需要用户确认的技术选择点。

AI 推荐不等于决定。用户未确认前，技术方向不写入 PROJECT.md。未确认的 Tech Direction 必须标为"待确认推荐"：

> Tech Direction：待确认推荐为 Python + PySide6，理由是……

用户明确确认后，才可以写入 PROJECT.md 的 Tech Direction。

### PROJECT.md 结构：9 节

`PROJECT.md` 必须含 9 节：

1. **Goal** — 这个项目要解决什么问题，1-3 句话。
2. **Users and Scenarios** — 谁用，什么场景下用。
3. **MVP** — 最小可用版本包含哪些功能。
4. **Inputs and Outputs** — 主要输入和输出是什么。
5. **Non-goals** — 明确不做什么。防止 AI 过度设计。
6. **Tech Direction** — 技术方向。含已确认的技术选择和理由。
7. **Constraints and Working Rules** — 硬约束和工作规则。
8. **Validation** — 怎么确认功能可用。个人项目可以只写"手动跑命令验证"。
9. **Seed Tasks** — 第一批启动任务，≤ 5 条。

### Assumptions 不默认写入 PROJECT.md

- PROJECT.md 是基线文件，只记录用户确认过的决策、约束和可核验事实。
- AI 可以在 project-init 的回复中展示 Assumptions / Pending Questions。
- **未确认内容不能写入 PROJECT.md 的基线章节**。
- 不要把 Assumptions 做成 PROJECT.md 的固定章节。
- 如果确实有未解决问题，优先放在 project-init 回复或 commit message 的 Next / Notes 中。

### 不写代码，不建脚手架

project-init 只产出文档。代码交给 project-work 写。不要在 init 阶段创建 `src/`、`package.json`、`main.py` 等。

### Seed Tasks 规则

- ≤ 5 条，用于第一轮 project-work 启动。
- 必须服务 MVP，不能写 MVP 之外的任务。
- 是可执行的第一步，不是 roadmap 条目。
- 不能把未来想法写成当前任务。
- 当核心能力依赖未确认的外部 I/O 或可行性未知时（数据来源、鉴权、登录态、API 可用性、设备权限、平台限制），Seed Tasks 必须先安排调查、探测或 mock 验证，不能直接把真实接入写成确定任务。
- 后续的 Next 写在 commit message 里，不回写到 PROJECT.md。不要把 PROJECT.md 变成长期任务看板。

### 不替用户 git commit

project-init 可以生成 initial commit message 供用户确认，但不要执行 `git commit`。提交动作交给用户，或交给 project-finish 处理。这与 project-finish 的规则一致。

### 不预判风险

不要预判项目风险，不要使用 AI Risks 作为 PROJECT.md 章节。AI 的推荐和假设不是基线事实。

### 范例参考

完整的 PROJECT.md 范例见 `docs/examples.md`。

### 核心原则

详见 `docs/design-principles.md`。重点是：Decision Ownership、轻量优先、Git 是事实源、文档只保存长期基线。

---

## 完成后下一步

1. AI 输出 baseline decision packet。
2. 用户确认整份基线（不逐项审批）。
3. AI 生成 PROJECT.md，只写已确认内容。
4. 用户确认后：
   - 用户自行 `git add PROJECT.md && git commit`，或
   - 进入 project-finish 走提交流程（生成 commit message 供确认）。
5. 提交后进入 project-work，从 seed tasks 的第一条开始推进。
