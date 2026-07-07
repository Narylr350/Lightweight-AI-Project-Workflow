# 设计原则

本文件是 skill pack 的核心原则展开。各 SKILL.md 引用此处，不重复阐述。

---

## 1. Decision Ownership（决策归属）

AI owns execution. User owns decisions.

- AI 可以分析、提出候选方案、比较取舍、给出推荐、执行已确认范围内的任务。
- AI 不能替用户决定项目目标、MVP、Non-goals、技术方向、长期基线、release、commit、tag、push、破坏性操作。
- **AI recommendations are not decisions.** 推荐不等于拍板，用户确认后才算决策。
- **AI assumptions are not baseline facts.** 未确认内容只能写成 Assumptions / Pending Questions，不能写成基线事实。
- `.ai/` 基线文件只能记录已确认决策、已确认约束和可核验项目事实。
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
- 给已有项目装这个 pack，用 pack 的轻量交接（git commit + `.ai/` 基线文件），不自动沿用项目原有的重工作流（任务文档、流水账、索引维护等）。除非用户明确要求保留原流程。
- 尊重原项目工程风格：代码风格、目录结构、命名、技术栈、测试命令、文档语言和语气要跟随项目。**但这不覆盖本 pack 的工作流契约**：`.ai/` 基线文件、Why/What/Verify/Next/Notes、Git 核验、Decision Ownership、finish/audit 规则仍然生效。

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
| **基线** | `.ai/` 基线文件（项目内） | PROJECT 摘要 + TECH 技术方向 + CONSTRAINTS 工作规则 + VALIDATION 验证规则 | project-init 创建，project-finish 必要时更新 | 基线变化时 |

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

- `.ai/PROJECT.md` 记项目决策摘要，`.ai/TECH.md` / `.ai/CONSTRAINTS.md` / `.ai/VALIDATION.md` 记分层基线，不记日常进度。
- 日常进度由 commit message 承载。
- 只有基线发生变化（方向调整 / Tech Direction 变化 / Constraints 变化 / MVP 重定义 / Validation 规则变化）时才更新对应的 `.ai/` 文件。
- 不要在 `.ai/PROJECT.md` 里维护任务列表——Seed Tasks 只用于启动，后续 Next 写在 commit message。

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

- 用户在当前 session 明确提出的需求，优先于 commit message 里的 Next 或 `.ai/PROJECT.md` 里的 Seed Tasks。
- 但如果新需求与 `.ai/` 基线冲突，必须停下问用户，或触发 project-audit。
- **不要**在不更新对应 `.ai/` 基线文件的情况下，按新方向改代码——这会让基线与实际脱节，后续 AI 接手时无法判断真实目标。
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

- 改一个 typo：直接改，提交时用简短 message，不触发完整 skill 流程。
- 修一个小 bug：用 project-work 判断 → 改 → project-finish 提交。
- 只有需要诊断时才用 project-audit。
- 只有基线缺失或大改时才用 project-init。

判断标准：如果任务能在 10 分钟内完成且不涉及基线变化，走最短路径。

小任务走最短路径，不等于绕过 Decision Ownership：

- 仍然不能自动 commit / tag / push / release，除非用户明确授权。
- 涉及 `.ai/` 基线文件、长期工作规则、分支归属、skill 接入的改动，不算简单维护。
- 如果简单改动会改变行为或影响交接 Notes，仍然进 project-finish。

---

## 12. Instruction Hygiene（纠偏污染防护）

用户纠偏时，AI 先分类再决定落盘位置：

| 纠偏类型 | 落盘位置 |
|---|---|
| 本轮交接信息 | commit Notes |
| 长期工作规则 | 转译成正向规则，确认后写 `.ai/CONSTRAINTS.md` 或 skill |
| 产品需求 | 转译成面向用户/开发者的产品规则 |
| 情绪反馈 / 一次性纠偏 | 不落盘 |

**禁止把以下内容写进代码、README、用户文档、产品文案、SKILL 正文：**

- 用户纠偏原话
- AI 失败过程
- AI 自我警告

commit Notes 可以记录纠偏（交接层），但产物层不能被污染。产物文档越来越像"AI 被训话记录"是反模式。

---

## 13. Maintenance Surface（工程一致性表面）

代码改了，但 README、配置示例、版本号、CHANGELOG、安装说明没同步——这是常见 AI 工程素养缺口。

**识别时机：** init / re-init 时识别项目已有的维护表面，不强制复杂模板。维护表面包括：

- README / 使用说明
- CHANGELOG
- 版本文件（package.json / pyproject.toml / VERSION 等）
- `.env.example` / config.example
- 公开 API 文档
- CLI help / 命令示例
- 安装脚本 / 构建配置

**检查时机：** 只在 project-finish 触发条件出现时检查，不每轮检查。触发条件：

- 本轮改了用户可见行为
- CLI 参数 / 命令示例
- 配置项
- 依赖
- 安装方式
- 公开 API
- 包元信息
- release 相关内容

**版本号单独处理：** 只有 release / tag / publish / 用户明确要求发布时才处理版本号。不每轮 bump。

---

## 14. Frequency-based Weight（按频率决定流程重量）

不要用"轻量"一刀切压所有入口。按使用频率决定流程重量：

| 入口 | 频率 | 重量 | 重点 |
|---|---|---|---|
| project-init / re-init | 低频 | 可以更重 | 把基线和 Seed Tasks 立住 |
| project-work | 高频 | 必须轻 | 最小范围推进 |
| project-finish | 高频 | 必须轻 | 只做触发式检查 |
| project-audit | 低频 | 可以稍重 | 只读诊断，不默认修 |

真正应该防的是 work / finish 变重。init 重一点没有问题，因为它是低频基线建立入口。
