# 设计原则

本文件是 skill pack 的核心原则展开。各 SKILL.md 引用此处，不重复阐述。

---

## 1. Decision Ownership（决策归属）

AI owns execution. User owns decisions.

- AI 可以分析、提出候选方案、比较取舍、给出推荐、执行已确认范围内的任务。
- AI 不能替用户决定项目目标、MVP、Non-goals、技术方向、长期基线、release、commit、tag、push、破坏性操作。
- **AI recommendations are not decisions.** 推荐不等于拍板，用户确认后才算决策。
- **AI assumptions are not baseline facts.** 未确认内容只能写成 Assumptions / Pending Questions，不能写成基线事实。
- `PROJECT.md` 只能记录已确认决策、已确认约束和可核验项目事实。
- 减少确认疲劳：只在决策点确认，不在已确认范围内的普通执行步骤反复确认。

---

## 2. 轻量优先

避免重流程常态化。

- 小任务不写长 PRD。
- 不做全项目审计（除非触发 project-audit）。
- 不要求全量测试。
- 能用一行 commit message 说清的事，不写一段文档。

判断标准：如果某个流程步骤对当前任务没有实际帮助，就跳过。

---

## 3. Git 是主要事实源

代码和文件是唯一可核验的事实。

- `git status` / `git log` / `git diff` 是核对项目真实状态的唯一手段。
- 任何 handoff / summary / notes 都只是线索，必须用 Git 和文件系统核验后才采信。
- 不要基于"上次对话说要做什么"开工，要基于"Git 显示实际做了什么"开工。

但 Git 本身不够：它记录 What，不记录 Why / Verify / Next。这些由 commit message 补充。

---

## 4. 三层事实模型

| 层 | 载体 | 记什么 | 谁写 | 更新频率 |
|---|---|---|---|---|
| **事实** | Git（代码 / diff / 文件） | 做了什么改动 | 人 + AI | 每次改动 |
| **交接** | commit message | Why / What / Verify / Next / Notes | project-finish 生成 | 每次提交 |
| **基线** | `PROJECT.md`（项目根目录） | 目标 / 非目标 / MVP / 技术边界 / 验证方式 / seed tasks | project-init 创建，project-finish 必要时更新 | 基线变化时 |

**铁律**：上层依赖下层。交接信息必须用事实层核验；基线变化必须反映到事实层。

---

## 5. commit message 是交接载体

不是日记，不是 changelog，是给下一个 session（人或 AI）的交接条。

- 必须含 Why / What / Verify / Next。
- Notes 按规则决定是否写（见 project-finish）。
- Next 是线索，不是承诺。下一轮 AI 读完 Next 后，必须用 Git 核验当前状态再决定是否照做。
- 一行能说清的不要写五段。

---

## 6. 文档只保存长期基线

不保存流水账。

- `PROJECT.md` 记项目基线，不记日常进度。
- 日常进度由 commit message 承载。
- 只有基线发生变化（方向调整 / 技术边界变化 / MVP 重定义）时才更新 PROJECT.md。
- 不要在 PROJECT.md 里维护任务列表——seed tasks 只用于启动，后续 Next 写在 commit message。

---

## 7. handoff 只是线索

任何交接信息（commit Next / 对话 summary / handoff notes）都可能：

- 过期（状态已变）
- 错误（理解偏差）
- 重复（已否方案又被提起）

因此：读完交接信息后，必须用 `git status` / `git log` / `git diff` 核对真实状态。发现冲突时，以 Git 事实为准，不盲目按交接信息执行。

project-audit 专门检查交接信息与 Git 事实是否一致。

---

## 8. 用户当前需求优先于旧计划

但不偷偷改基线。

- 用户在当前 session 明确提出的需求，优先于 commit message 里的 Next 或 PROJECT.md 里的 seed tasks。
- 但如果新需求与 PROJECT.md 基线冲突，必须停下问用户，或触发 project-audit。
- **不要**在不更新 PROJECT.md 的情况下，按新方向改代码——这会让基线与实际脱节，后续 AI 接手时无法判断真实目标。
- 临时探索性改动可以例外，但 commit message 必须在 Notes 里标明"偏离基线，待确认"。

---

## 9. 入口最小化

对外只保留 4 个 skill：

- `project-init` — 初始化 / 重建基线
- `project-work` — 日常主入口
- `project-finish` — 收尾 + 生成 commit
- `project-audit` — 低频复盘

用户不需要记内部阶段。project-work 内部判断任务类型，但不暴露为命令。不新增 checkpoint / intake / execute / closeout 等额外入口。

---

## 10. 小任务不做全流程

不是每轮都要走完 init → work → finish → audit。

- 改一个 typo：直接改，直接提交，不触发任何 skill 流程。
- 修一个小 bug：用 project-work 判断 → 改 → project-finish 提交。
- 只有需要诊断时才用 project-audit。
- 只有基线缺失或大改时才用 project-init。

判断标准：如果任务能在 10 分钟内完成且不涉及基线变化，走最短路径。
