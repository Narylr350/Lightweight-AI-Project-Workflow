---
name: project-init
description: 用于新项目初始化或给已有项目建立轻量 AI 工作基线。触发于：新项目第一天、已有项目无 .ai/PROJECT.md 或基线文件不完整、项目方向大改需重建基线。AI 主导需求澄清与基线生成，产出 .ai/ 下的 PROJECT/TECH/CONSTRAINTS/VALIDATION 基线文件。AI 澄清需求、提候选方案，用户拍板关键决策。
---

# Project Init

新项目初始化，或给已有项目建立轻量 AI 工作基线。

产出项目内 `.ai/` 目录下的基线文件（必要时先创建 `.ai/` 目录），作为整个项目的长期基线文档：

- `.ai/PROJECT.md` — 决策摘要：Goal、Users and Scenarios、MVP、Inputs and Outputs、Non-goals、Seed Tasks
- `.ai/TECH.md` — 技术方向
- `.ai/CONSTRAINTS.md` — 工作规则、硬约束、接入的 skill（执行层 + finish 层）
- `.ai/VALIDATION.md` — 验证命令和规则

后续 project-work 读取它们判断方向，project-finish 必要时更新它们，project-audit 校验它们是否过期。

---

## 何时用

- 新项目第一天
- 已有项目但没有 `.ai/PROJECT.md`（或基线文件不完整）
- 项目方向大改，需要重建基线（原基线文件已不反映真实目标）

---

## 何时不用

- `.ai/` 基线文件完整且没大改 → 用 project-work
- 纯粹查问题或复盘 → 用 project-work 或 project-audit
- 只改一个 typo 或小 bug → 直接改，不触发 init

---

## 关键规则

### 语言跟随用户

`.ai/PROJECT.md` 和所有回复用用户的语言。用户说中文就写中文，说英文就写英文。不要默认套英文。其他基线文件（TECH.md / CONSTRAINTS.md / VALIDATION.md）同理。

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
[阶段 A] 需求澄清（仅当有影响 baseline 的 gate 未确认时）
  ├─ AI 逐个评估 8 个 gate 的状态：
  │    - 全部 confirmed / not applicable / converted to Seed Task → 直接进入阶段 B
  │    - 有 gate 未确认 → 先就最高影响的未确认 gate 做轻量澄清
  ├─ 轻量澄清输出：用户原话 / AI 初步理解 / 待确认假设 / 1 个 gate 确认（必要时最多 2 个）
  ├─ 可选："选最接近的就行，有特殊要求可以补充"
  └─ 用户回答后重新评估 gate 状态，全部就绪才进入阶段 B
         │
         ▼
[阶段 B] 候选方案分析（AI 自动推进，不打断）
  ├─ 基于需求推导技术约束，不套标签
  ├─ 输出 2-3 个候选技术方向：适用场景 / 代价 / 不选原因 / 推荐
  ├─ 草拟 MVP、Non-goals、Constraints、Validation、Seed Tasks
  └─ 把未确认内容归到 Assumptions / Pending Questions（只在 AI 回复中展示）
         │
         ▼
[阶段 C] 基线确认包（AI 自动生成，交用户一次性确认）
  ├─ AI 输出一份 baseline decision packet
  ├─ 必须覆盖全部 9 节内容（分布在 4 个文件中）：
  │    `.ai/PROJECT.md`: Goal / Users and Scenarios / MVP / Inputs and Outputs / Non-goals / Seed Tasks
  │    `.ai/TECH.md`: Tech Direction
  │    `.ai/CONSTRAINTS.md`: Constraints and Working Rules（含用户已确认的执行层 + finish 层 skill 接入）
  │    `.ai/VALIDATION.md`: Validation
  └─ 用户确认整份基线，不逐项审批
         │
         ▼
[阶段 D] 生成 `.ai/` 基线文件（确认后才写）
  ├─ 只写已确认内容为事实
  ├─ 未确认内容不写入基线文件
  └─ 生成 initial commit message 供用户确认（不提交）
```

### 已有项目：先深度探索，再提炼基线

给已有项目建基线时，不能只扫一眼文件名就写泛泛的项目介绍。必须真正读懂现有信息，把它**提炼**进 `.ai/` 基线文件，不是复述也不是套话。

- 必读现有事实源：README、已有的项目文档和 AI 指令文件、最近 commit、关键配置。
- 必查 Git 状态：当前分支、`git status`、最近 commit。重新初始化会改项目级 `.ai/` 基线，不能只看当前任务分支上的局部状态。
- **用能看到真实文件系统的方式探索**（如直接列目录、bash/powershell），不要只依赖会过滤 .gitignore 的搜索工具。很多项目会 gitignore 掉 AI 需要读的文档目录，只用 Glob/Grep 会漏掉它们，导致把"已存在的文档"误判为"不存在"。
- 当 README / AI 指令文件引用了某些文档，但搜索工具没找到时，必须直接确认文件系统，不能直接当它不存在。
- 把现有文档里的**具体信息**提炼进基线：当前阶段、当前方向、优先级、真实约束、数据流。不要把具体内容压成一句空话。
- 如果项目已有完整文档体系，`.ai/` 基线文件不复述它们，而是提炼本 pack 工作流需要的关键信息，并在相应章节引用已有文档。
- **只提炼项目事实（目标/范围/技术/真实约束/数据流），不要把项目原有的 AI 协作流程抄进基线。** 项目可能自带一套重工作流（任务文档、流水账、索引维护、固定阅读顺序等），这套默认不沿用——本 pack 用 git commit 做交接、用 `.ai/` 基线文件做基线，不需要再维护项目原有的流程文档。

**Workflow Authority Gate：** 如果探索时发现旧 AI 工作流文件（AGENTS.md、CLAUDE.md、AI_CONTEXT.md、docs/tasks 索引等），必须明确选择处理方式并写入 `.ai/CONSTRAINTS.md`：

- **轻量迁移（默认推荐）**：`.ai/` 基线文件是长期基线，commit message 是进度和交接；旧 docs/tasks 等文件仅作历史参考，不继续维护。在 `.ai/CONSTRAINTS.md` 里写明"旧工作流文件已降级为历史参考，不以它们为事实源"。
- **保留旧工作流（需用户明确确认）**：必须写清哪些文件仍是事实源、什么情况下更新、优先级与 `.ai/` 基线文件的关系。
- **并存（不推荐）**：不能只写"并存，不替代"。必须明确 Goal/MVP/Non-goals 归谁管、日常进度归谁管、冲突时以谁为准。否则默认降级旧流程。
- 只看到项目里已有规则或旧文档内容，不等于 Workflow Authority Gate 已确认。发现旧 workflow 文件时，必须在本轮 init 中向用户展示上述选项，或引用本轮用户已经明确给出的选择。
- `.ai/CONSTRAINTS.md` 只写真实技术约束（如"改 API 注意签名流程""不引入新框架"），不写"每次完成要更新某文档/某索引"这类原项目流程规范。
- 如果用户明确要求沿用项目原有工作流，才把它写进 Constraints and Working Rules，并说明这是用户选择保留的。
- Goal / MVP / Seed Tasks 必须反映用户的**真实当前目标**。如果用户给的是维护目标，就把它落成具体维护方向，不要写成"这个项目是什么"的介绍。

**分支归属确认：** 如果当前在 `feat/*` / `fix/*` 等任务分支，且 init / re-init 会改项目级 `.ai/` 基线，必须先确认这次基线属于哪个范围：

- **项目主线基线（默认推荐）**：回到 `main` / `master` 或先合并任务分支后再写基线。
- **当前任务分支专用基线（需用户明确确认）**：只服务该分支，后续合并时再决定是否进入主线。
- **暂不写基线**：只输出建议，等分支收尾后再 init。

不能因为当前分支干净就直接在任务分支上重写项目级 `.ai/` 基线；也不能把任务分支的 Next 当成主线项目方向。

### 基线确认规则：整份确认，不默认通过

Stage C 必须显式确认整份 Baseline Decision Packet，不能只确认某一项就写入 `.ai/` 基线文件。

- 禁止用"其余如无异议""默认同意""只确认技术方向"等措辞替代整份 baseline 确认。
- 如果使用 `request_user_input` / 用户输入面板，确认问题应针对整份 baseline，例如"是否确认这份 baseline 写入 `.ai/` 基线文件？"
- 面板选项示例：
  - 确认写入
  - 需要调整范围 / MVP
  - 需要调整技术方向 / 约束
- 用户只确认某一项时（如只选了技术方向），只能视为该项确认，不能视为整份 baseline 确认。AI 必须再次就整份 baseline 征求确认。
- 用户确认整份 baseline 后，才可以写入 `.ai/` 基线文件。
- 用户确认整份 Baseline Decision Packet，只确认其中明确标为已确认的内容。不能把 Assumptions / Pending Questions / 待确认推荐通过整份确认洗成 confirmed baseline facts。

### Gate-based baseline discovery

project-init 是低频但关键的基线建立入口，可以比日常 project-work 更严格。需求澄清按 8 个 gate 推进。AI 可以决定下一步问哪个 gate，但不能跳过 gate。

8 个 gate：

1. **Problem Gate** — 确认要解决的问题、场景、当前替代办法或痛点。防止 AI 只根据项目名脑补 Goal。
2. **Delivery Gate** — 确认交付方式和硬约束（本地演示 / 在线访问 / 课程要求 / 平台限制 / 截止时间 / 已有代码）。防止 AI 脑补技术方向。
3. **MVP Gate** — 确认第一版做到什么算能用/能交。防止 AI 自己定义 MVP。
4. **Feasibility Gate** — 确认会影响可行性的外部条件（外部 API / 登录态 / 数据来源 / 权限 / 部署 / 数据库 / 设备能力）。防止把未知实现路径写成任务。
5. **Baseline Gate** — 确认 9 节 baseline（分布在 4 个文件中）。确保写入 `.ai/` 基线文件的都是已确认内容。
6. **Branch Scope Gate** — 确认本次 init / re-init 的 `.ai/` 基线属于项目主线、当前任务分支，还是暂不写入。防止在任务分支上重写主线基线。
7. **Workflow Authority Gate** — 确认旧 AI 工作流文件（AGENTS.md、CLAUDE.md、AI_CONTEXT.md、docs/tasks、roadmap、plans 等）如何处理。防止旧流程和 `.ai/` 基线并存打架。
8. **Skill Selection Gate** — 确认执行层 / finish 层 skill 接入选择。防止把 AI 推荐的 skill 当成用户选择。

原先统称 Workflow Gate 的内容必须拆成上述 3 个独立 gate。只确认 Branch Scope Gate，不代表 Workflow Authority Gate 或 Skill Selection Gate 已确认。

每个 gate 必须是以下三态之一，才算就绪：

- **confirmed** — 用户明确确认，或用户输入已明确覆盖该 gate。
- **not applicable** — 该 gate 对当前项目明显不适用。
- **converted to Seed Task** — 需后续调查的，转成 Seed Tasks 中靠前的调查/确认任务，而不是写成事实。

AI 不能只凭"能推导"跳过 gate；也不能因为某个 gate 看起来常见就自行确认。能脑补出几个字段不等于 gate 已就绪。

### gate 不能跳过，不能降级

建立基线文件时，不能为了少问而把未确认的 gate 写成基线事实。

- AI 不能凭"能推导""其余信息作假设推进"跳过影响 baseline 的 gate。
- 影响 baseline 的 gate 未就绪时，不能把它降级为普通 Assumption 后直接出包。

进入 Baseline Decision Packet（阶段 B/C）的条件：

- 所有影响 baseline 的 gate 都已 confirmed / not applicable / converted to Seed Task。
- Branch Scope Gate、Workflow Authority Gate、Skill Selection Gate 必须分别就绪；只确认其中一个，不能视为 workflow 相关 gate 全部就绪。
- 不能因为"看起来能推导"就进入阶段 B/C。
- 不能把 Assumptions / Pending Questions 通过整份确认洗成 baseline facts。

连续澄清规则：

- 每轮默认只问 1 个 gate 的最高影响问题，必要时最多 2 个。
- 用户回答后，AI 必须重新评估全部 gate 状态。
- 如果还有影响 baseline 的 gate 未就绪，应继续问下一轮，或转成 Seed Task 调查；不能直接当作 Assumption 写入基线文件。

### 第一轮澄清：问准 gate，不做问卷

当有影响 baseline 的 gate 未确认时触发；目标不是收集完整 PRD 信息，而是确认最影响 `.ai/` 基线的 gate。不要在第一轮就展开完整 Goal / MVP / Inputs / Tech Direction / Validation / Seed Tasks。

#### 提问数量

- 默认只问 **1 个** gate 的最高影响问题。
- 如果确实有两个同等关键的 gate 未确认，最多问 2 个。
- "≤5"只是绝对上限，不是推荐数量，也不是固定模板。

#### 提问形式

优先用"一个问题 + 2-3 个可选项 + 可补充说明"的形式：

- 选项必须是用户能理解的自然语言，不要堆专业术语。
- AI 可以给推荐选项，但推荐不是决定。
- 用户可以选一个，也可以补充自己的情况。
- 禁止默认使用"回答不知道也可以""不用一次想完整"这类 AI 安抚话术。如果需要降低压力，用"选最接近的就行"或"有特殊要求可以补充"。

#### 何时用开放问题

当选项会过早框住用户、误导方向，或用户连问题场景都没说清时，才用一个开放问题。开放问题应围绕真实场景或完成标准，例如"你现在遇到的具体麻烦是什么？"或"第一版做到什么就算能用/能交？"。不要输出访谈表。

#### 交互控件

如果运行环境支持 `request_user_input` / 用户输入面板，优先用面板收集关键确认。每次面板问 1 个问题为默认，最多 2 个。每个问题给 2-3 个互斥选项，并允许用户补充。不支持面板时，在正文用同样结构表达。

### 阻塞 vs 非阻塞

**只有以下情况是阻塞问题，必须用户回答**：

- 连"想解决什么问题"都说不清（无法推导 Goal）
- 用户目标内部自相矛盾（如"要离线运行"但"要实时同步"）
- 硬约束与需求矛盾
- 已有项目事实（Git / 文件）和用户目标冲突

**其余不影响 `.ai/` baseline 的信息缺失才是非阻塞**：AI 可以作假设继续推进，在回复中展示 Assumptions，不连续追问。用户暂时不确定时，project-init 仍然可以继续生成 Baseline Decision Packet，但影响 baseline 的 gate 必须按"gate 不能跳过，不能降级"节处理。

**例外**：当外部数据来源、鉴权方式、本地登录态 / API 可用性、设备权限、平台限制等信息会决定核心 MVP 是否可行或决定主要实现路径时，不能把它当作普通 Assumption，也不能把真实接入写成已确认任务。Seed Tasks 必须先安排调查 / mock 验证，确认可行后再接入真实逻辑。

### 需求分析分层

AI 必须显式区分 4 层，防止把理解当事实：

| 层 | 含义 | 能否写入 `.ai/` 基线 |
|---|---|---|
| **用户原话** | 用户字面说的 | 否（只是输入） |
| **AI 理解** | AI 转述的需求 | 否（待确认） |
| **待确认假设** | 信息不足时 AI 补的假设 | 否 |
| **已确认决策** | 用户确认过的 | 是 |

需求分析表只在 project-init 的回复中展示，**不原样塞进 `.ai/` 基线文件**。它的作用是防止 AI 把理解当事实。

### 技术方向生成逻辑

不要根据项目标签选栈（如"todo 工具 → Python"）。必须从需求、使用场景、输入输出、运行环境、硬约束、成功标准推导。

1. 从 Goal / Users / I/O / Constraints 提取技术约束。
2. 输出 2-3 个候选方向，每个含：
   - **适用场景**：什么需求下它合适
   - **代价**：学习成本 / 依赖体积 / 维护负担
   - **不选它的原因**：什么情况下它是错的选择
   - **推荐**：AI 给一个推荐 + 理由（推荐不是决定）
3. 明确列出需要用户确认的技术选择点。

AI 推荐不等于决定。用户未确认前，技术方向不写入 `.ai/TECH.md`。未确认的 Tech Direction 必须标为"待确认推荐"：

> Tech Direction：待确认推荐为方案 A，理由是……

用户明确确认后，才可以写入 `.ai/TECH.md` 的 Tech Direction。

当 Tech Direction 依赖未确认前提时，不能写成确定技术方向。可以在回复里给待确认推荐和候选方案，但 `.ai/TECH.md` 只能写用户确认过的技术方向。如果技术方向前提仍未确认，应先把"确认技术方向前提"列为 Seed Task，而不是写暂定技术方向。

### `.ai/` 基线文件结构：摘要 + 分文件

原 9 节 baseline 分布在 4 个文件中。拆分目的：让 AI 每轮先读短摘要，再按任务需要读取技术、约束、验证细节，不因单文件过长而跳读。

**`.ai/PROJECT.md`** — 决策摘要，每轮必读（控制在 ~80 行以内）：

1. **Goal** — 这个项目要解决什么问题，1-3 句话。
2. **Users and Scenarios** — 谁用，什么场景下用。
3. **MVP** — 最小可用版本包含哪些功能。
4. **Inputs and Outputs** — 主要输入和输出是什么。
5. **Non-goals** — 明确不做什么。防止 AI 过度设计。
6. **Seed Tasks** — 第一批启动任务，≤ 5 条。

**`.ai/TECH.md`** — 技术方向，涉及技术决策时读：

7. **Tech Direction** — 技术方向。含已确认的技术选择和理由。

**`.ai/CONSTRAINTS.md`** — 工作规则，每轮必读：

8. **Constraints and Working Rules** — 硬约束、工作规则、接入的执行层和 finish 层 skill。

**`.ai/VALIDATION.md`** — 验证规则，finish 时读：

9. **Validation** — 怎么确认功能可用。个人项目可以只写"手动跑命令验证"。

### Assumptions 不默认写入基线文件

- `.ai/` 基线文件只记录用户确认过的决策、约束和可核验事实。
- AI 可以在 project-init 的回复中展示 Assumptions / Pending Questions。
- **未确认内容不能写入基线文件**。
- 基线文件禁止写入：暂定技术方向、待确认约束、Pending Questions、Assumptions、"如果以后确认再改"的基线事实。
- 这些未确认内容只能放在 project-init 回复里，或转成 Seed Tasks 的调查/确认任务。
- 不要把 Assumptions 做成 `.ai/PROJECT.md` 或其他基线文件的固定章节。
- 如果确实有未解决问题，优先放在 project-init 回复或 commit message 的 Next / Notes 中。

### Skill Selection Gate：Skill 接入检查

init 阶段从当前环境的 available_skills 列表中找出可接入 skill，分两类给用户选择：

- **执行层 skill**：在 project-work 中使用，管"怎么写/怎么调"（如 TDD / diagnosing-bugs / codebase-design / prototype）。
- **finish 层 skill**：在 project-finish 生成 commit message 前使用，管"提交前对 diff 做额外质量检查"。

- AI 已知当前环境装了哪些 skill，不需要扫描文件系统。
- 只列执行层和 finish 层 skill。不要列管理层 skill（管"做什么"的，如 to-prd / to-issues / handoff / brainstorming——这些和本 pack 职责重叠）。
- **Skill 接入是独立的 Skill Selection Gate，不是 AI 自动配置项。** AI 可以推荐，但必须让用户明确选择；不能把推荐 skill 直接塞进"拟写入文件概要"最后让用户顺手确认。
- 用户确认分支归属或旧工作流处理方式，不等于确认 skill 接入。
- 推荐 finish 层时，必须写出当前 available_skills 中真实存在的 skill 全名，不能写泛称或虚构名称。
- 如果没有读取候选 skill 说明，不能推荐它作为 finish 层，只能列为"可能候选，待确认"或默认不接入。
- 如果当前环境没有具体 finish 层候选，Skill Selection Gate 的 finish 默认选项只能是"未接入 finish 层 skill"。
- Baseline Decision Packet 里必须区分：
  - **已确认接入**：可以写入 `.ai/CONSTRAINTS.md`。
  - **推荐但待确认**：只放在回复的候选项里，不能写入基线文件。
  - **未接入**：用户未选或没有明确回答时的默认值。
- **用户确认接入的 skill 必须写入 `.ai/CONSTRAINTS.md`，明确记录哪些 skill 在 work 层使用、哪些 skill 在 finish 层使用。** 这不是可选展示，是基线的一部分。没写进去，work/finish 阶段就不能乱触发 skill。
- 如果用户没明确选，默认不接入任何外部 skill，并在 `.ai/CONSTRAINTS.md` 里写明"未接入外部执行层 skill；未接入 finish 层 skill"。
- 用户也可以一个都不选，不影响项目推进。

### 验证环境确认

确认技术方向后，检查项目技术栈对应的关键验证环境（如构建工具、运行时、数据库、测试工具）。用途不是记录当前环境状态（环境是易变的），而是明确三件事：

- **项目需要哪些验证环境**（构建工具、运行时、数据库、测试工具等，由技术栈决定）。
- **这些环境不可用时怎么处理**：AI 先尝试修复（如启动服务、设环境变量——可逆操作、不问用户）；不行再尝试安装；确实做不到才提示用户。
- **每个环境哪类验证可用、哪类不可用、什么条件下才做**。

结果写入 `.ai/CONSTRAINTS.md` 或 `.ai/VALIDATION.md`，但不是写"当前开/关"，而是写处理规则（如"浏览器验证不稳时优先用构建产物静态证据"）。

按 design-principles 的"AI 自己处理可逆操作"原则执行：启动服务、设环境变量这类低风险操作 AI 直接做，不打断用户。只有需管理员权限、装全局软件、需凭据时才提示用户。

### 不写代码，不建脚手架

project-init 只产出文档。代码交给 project-work 写。不要在 init 阶段创建 `src/`、`package.json`、`main.py` 等。

### Seed Tasks 规则

- ≤ 5 条，用于第一轮 project-work 启动。
- 必须服务 MVP，不能写 MVP 之外的任务。
- 是可执行的第一步，不是 roadmap 条目。
- **不能写流程占位符**（如"确认第一个切片""创建任务记录""按需审计"）。这些是元任务，不是真实任务。Seed Task 要能直接交给 project-work 开工，指向具体的功能、bug 或改动。
- 已有项目从现有文档和用户真实目标提炼具体 Seed Tasks，不要写泛泛的流程步骤。
- 不能把未来想法写成当前任务。
- 当核心能力依赖未确认的外部 I/O 或可行性未知时（数据来源、鉴权、登录态、API 可用性、设备权限、平台限制），Seed Tasks 必须先安排调查、探测或 mock 验证，不能直接把真实接入写成确定任务。
- 后续的 Next 写在 commit message 里，不回写到 `.ai/PROJECT.md`。不要把 `.ai/PROJECT.md` 变成长期任务看板。

### 不替用户 git commit

project-init 可以生成 initial commit message 供用户确认，但不要执行 `git commit`。提交动作交给用户，或交给 project-finish 处理。这与 project-finish 的规则一致。

### 不预判风险

不要预判项目风险，不要使用 AI Risks 作为 `.ai/` 基线章节。AI 的推荐和假设不是基线事实。

### 范例参考

完整的 `.ai/` 基线文件范例见 `docs/examples.md`。

### 核心原则

详见 `docs/design-principles.md`。重点是：Decision Ownership、轻量优先、Git 是事实源、文档只保存长期基线。

---

## 完成后下一步

1. AI 输出 baseline decision packet。
2. 用户确认整份基线（不逐项审批）。
3. AI 生成 `.ai/` 基线文件，只写已确认内容。
4. 用户确认后：
   - 用户自行 `git add .ai/ && git commit`，或
   - 进入 project-finish 走提交流程（生成 commit message 供确认）。
5. 提交后进入 project-work，从 seed tasks 的第一条开始推进。
