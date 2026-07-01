# 设计原则

本文件是 skill pack 的核心原则展开。各 SKILL.md 引用此处，不重复阐述。

---

## 1. Decision Ownership（决策归属）

AI owns execution. User owns decisions.

- AI 可以分析、提出候选方案、比较取舍、给出推荐、执行已确认范围内的任务。
- AI 不能替用户决定项目目标、MVP、Non-goals、技术方向、长期基线、release、commit、tag、push、破坏性操作。
- **AI recommendations are not decisions.** 推荐不等于拍板，用户确认后才算决策。
- **AI assumptions are not baseline facts.** 未确认内容只能写成 Assumptions / Pending Questions，不能写成基线事实。
- `.ai/PROJECT.md` 只能记录已确认决策、已确认约束和可核验项目事实。
- 减少确认疲劳：只在决策点确认，不在已确认范围内的普通执行步骤反复确认。

### AI 自己处理可逆操作，简化用户操作量

Decision Ownership 是"方向归用户"，不是"所有动作都问用户"。AI 能自己做的可逆、低风险操作，直接做，不要抛给用户判断。

环境/执行类问题按这个顺序处理：

1. 服务没启动、环境变量没设、缺临时文件等 → AI 直接尝试启动/设置/创建（可逆、低风险，不问）。
2. 启动失败、依赖没装 → AI 尝试帮忙修复或安装。
3. 只有 AI 确实做不了（需管理员权限、装全局软件有副作用、需付费、需用户凭据）→ 才提示用户。

AI 仍不能擅自做的（回到 Decision Ownership）：破坏性操作、改变项目方向/基线、commit/tag/push/release。

目标：能 AI 解决的全自己解决，最小化用户操作量。

---

## 2. 轻量优先

避免重流程常态化。

- 小任务不写长 PRD。
- 不做全项目审计（除非触发 project-audit）。
- 不要求全量测试。
- **验证按风险分级**：配置/文档/纯变量名等低风险改动做 targeted 验证（grep、单次命令），不做全量测试。逻辑/接口/流程等高风险改动才全量验证。不让验证成本超过改动成本。
- 能用一行 commit message 说清的事，不写一段文档。
- 给已有项目装这个 pack，用 pack 的轻量交接（git commit + .ai/PROJECT.md），不自动沿用项目原有的重工作流（任务文档、流水账、索引维护等）。除非用户明确要求保留原流程。
- 尊重原项目工程风格：代码风格、目录结构、命名、技术栈、测试命令、文档语言和语气要跟随项目。**但这不覆盖本 pack 的工作流契约**：.ai/PROJECT.md、Why/What/Verify/Next/Notes、Git 核验、Decision Ownership、finish/audit 规则仍然生效。

判断标准：如果某个流程步骤对当前任务没有实际帮助，就跳过。

---

## 3. 完成标准：先看结构性问题

不要把单次模型输出的措辞波动当成必须继续修 skill 的理由。

一轮规则改动可以收尾，通常需要同时满足：

- 主要流程已经按设计走通。
- 已知的结构性失败被约束住，例如跳过必要确认、把假设写成基线事实、错误写入文件位置、越权执行 git / release。
- 剩余问题只是表达风格、个别输出顺序、模型偶发选择，而不是规则缺口。
- 没有把单一试跑场景、具体项目名或具体技术选择写成默认规则。

如果新试跑暴露问题，先判断它是通用设计缺口、规则冲突、工具异常，还是单次输出偏差。只有前两类才继续改 skill；后两类记录结论即可，不围绕单个样本反复加规则。

---

## 4. Git 是主要事实源

代码和文件是唯一可核验的事实。

- `git status` / `git log` / `git diff` 是核对项目真实状态的唯一手段。
- 任何 handoff / summary / notes 都只是线索，必须用 Git 和文件系统核验后才采信。
- 不要基于"上次对话说要做什么"开工，要基于"Git 显示实际做了什么"开工。

但 Git 本身不够：它记录 What，不记录 Why / Verify / Next。这些由 commit message 补充。

---

## 5. 三层事实模型

| 层 | 载体 | 记什么 | 谁写 | 更新频率 |
|---|---|---|---|---|
| **事实** | Git（代码 / diff / 文件） | 做了什么改动 | 人 + AI | 每次改动 |
| **交接** | commit message | Why / What / Verify / Next / Notes | project-finish 生成 | 每次提交 |
| **基线** | `.ai/PROJECT.md`（项目内） | Goal / Users and Scenarios / MVP / Inputs and Outputs / Non-goals / Tech Direction / Constraints and Working Rules / Validation / Seed Tasks | project-init 创建，project-finish 必要时更新 | 基线变化时 |

**铁律**：上层依赖下层。交接信息必须用事实层核验；基线变化必须反映到事实层。

---

## 6. commit message 是交接载体

不是日记，不是 changelog，是给下一个 session（人或 AI）的交接条。

- 必须含 Why / What / Verify / Next。
- Notes 按规则决定是否写（见 project-finish）。
- Next 是线索，不是承诺。下一轮 AI 读完 Next 后，必须用 Git 核验当前状态再决定是否照做。
- 一行能说清的不要写五段。

---

## 7. 文档只保存长期基线

不保存流水账。

- `.ai/PROJECT.md` 记项目基线，不记日常进度。
- 日常进度由 commit message 承载。
- 只有基线发生变化（方向调整 / Tech Direction 变化 / Constraints 变化 / MVP 重定义）时才更新 .ai/PROJECT.md。
- 不要在 .ai/PROJECT.md 里维护任务列表——seed tasks 只用于启动，后续 Next 写在 commit message。

---

## 8. handoff 只是线索

任何交接信息（commit Next / 对话 summary / handoff notes）都可能：

- 过期（状态已变）
- 错误（理解偏差）
- 重复（已否方案又被提起）

因此：读完交接信息后，必须用 `git status` / `git log` / `git diff` 核对真实状态。发现冲突时，以 Git 事实为准，不盲目按交接信息执行。

project-audit 专门检查交接信息与 Git 事实是否一致。

---

## 9. 用户当前需求优先于旧计划

但不偷偷改基线。

- 用户在当前 session 明确提出的需求，优先于 commit message 里的 Next 或 .ai/PROJECT.md 里的 seed tasks。
- 但如果新需求与 .ai/PROJECT.md 基线冲突，必须停下问用户，或触发 project-audit。
- **不要**在不更新 .ai/PROJECT.md 的情况下，按新方向改代码——这会让基线与实际脱节，后续 AI 接手时无法判断真实目标。
- 临时探索性改动可以例外，但 commit message 必须在 Notes 里标明"偏离基线，待确认"。

---

## 10. 入口最小化

对外只保留 4 个 skill：

- `project-init` — 初始化 / 重建基线
- `project-work` — 日常主入口
- `project-finish` — 收尾 + 生成 commit
- `project-audit` — 低频复盘

用户不需要记内部阶段。project-work 内部判断任务类型，但不暴露为命令。不新增 checkpoint / intake / execute / closeout 等额外入口。

---

## 11. 小任务不做全流程

不是每轮都要走完 init → work → finish → audit。

- 改一个 typo：直接改，直接提交，不触发任何 skill 流程。
- 修一个小 bug：用 project-work 判断 → 改 → project-finish 提交。
- 只有需要诊断时才用 project-audit。
- 只有基线缺失或大改时才用 project-init。

判断标准：如果任务能在 10 分钟内完成且不涉及基线变化，走最短路径。
