---
name: project-init
description: 用于新项目初始化或给已有项目建立轻量 AI 工作基线。触发于：新项目第一天、已有项目无 .ai/PROJECT.md、项目方向大改需重建基线。AI 主导需求澄清与基线生成，产出 .ai/PROJECT.md 9 节。AI 澄清需求、提候选方案，用户拍板关键决策。
---

# Project Init

新项目初始化，或给已有项目建立轻量 AI 工作基线。

产出项目内 `.ai/PROJECT.md`（必要时先创建 `.ai/` 目录），作为整个项目的长期基线文档。后续 project-work 读取它判断方向，project-finish 必要时更新它，project-audit 校验它是否过期。

---

## 何时用

- 新项目第一天
- 已有项目但没有 `.ai/PROJECT.md`
- 项目方向大改，需要重建基线（原 .ai/PROJECT.md 已不反映真实目标）

---

## 何时不用

- 已有 `.ai/PROJECT.md` 且没大改 → 用 project-work
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
[阶段 A] 需求澄清（仅当有影响 baseline 的 gate 未确认时）
  ├─ AI 逐个评估 5 个 gate 的状态：
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
  ├─ 草拟 MVP、Non-goals、Validation、Seed Tasks
  └─ 把未确认内容归到 Assumptions / Pending Questions（只在 AI 回复中展示）
         │
         ▼
[阶段 C] 基线确认包（AI 自动生成，交用户一次性确认）
  ├─ AI 输出一份 baseline decision packet
  ├─ 必须覆盖 .ai/PROJECT.md 全部 9 节：Goal / Users and Scenarios / MVP / Inputs and Outputs / Non-goals / Tech Direction / Constraints and Working Rules / Validation / Seed Tasks
  └─ 用户确认整份基线，不逐项审批
         │
         ▼
[阶段 D] 生成 .ai/PROJECT.md（确认后才写）
  ├─ 只写已确认内容为事实
  ├─ 未确认内容不写入 .ai/PROJECT.md
  └─ 生成 initial commit message 供用户确认（不提交）
```

### 基线确认规则：整份确认，不默认通过

Stage C 必须显式确认整份 Baseline Decision Packet，不能只确认某一项就写入 .ai/PROJECT.md。

- 禁止用"其余如无异议""默认同意""只确认技术方向"等措辞替代整份 baseline 确认。
- 如果使用 `request_user_input` / 用户输入面板，确认问题应针对整份 baseline，例如"是否确认这份 baseline 写入 .ai/PROJECT.md？"
- 面板选项示例：
  - 确认写入
  - 需要调整范围 / MVP
  - 需要调整技术方向 / 约束
- 用户只确认某一项时（如只选了技术方向），只能视为该项确认，不能视为整份 baseline 确认。AI 必须再次就整份 baseline 征求确认。
- 用户确认整份 baseline 后，才可以写入 .ai/PROJECT.md。
- 用户确认整份 Baseline Decision Packet，只确认其中明确标为已确认的内容。不能把 Assumptions / Pending Questions / 待确认推荐通过整份确认洗成 confirmed baseline facts。

### Gate-based baseline discovery

project-init 是低频但关键的基线建立入口，可以比日常 project-work 更严格。需求澄清按 5 个 gate 推进。AI 可以决定下一步问哪个 gate，但不能跳过 gate。

5 个 gate：

1. **Problem Gate** — 确认要解决的问题、场景、当前替代办法或痛点。防止 AI 只根据项目名脑补 Goal。
2. **Delivery Gate** — 确认交付方式和硬约束（本地演示 / 在线访问 / 课程要求 / 平台限制 / 截止时间 / 已有代码）。防止 AI 脑补技术方向。
3. **MVP Gate** — 确认第一版做到什么算能用/能交。防止 AI 自己定义 MVP。
4. **Feasibility Gate** — 确认会影响可行性的外部条件（外部 API / 登录态 / 数据来源 / 权限 / 部署 / 数据库 / 设备能力）。防止把未知实现路径写成任务。
5. **Baseline Gate** — 确认 9 节 baseline。确保写入 `.ai/PROJECT.md` 的都是已确认内容。

每个 gate 必须是以下三态之一，才算就绪：

- **confirmed** — 用户明确确认，或用户输入已明确覆盖该 gate。
- **not applicable** — 该 gate 对当前项目明显不适用。
- **converted to Seed Task** — 需后续调查的，转成 Seed Tasks 中靠前的调查/确认任务，而不是写成事实。

AI 不能只凭"能推导"跳过 gate；也不能因为某个 gate 看起来常见就自行确认。能脑补出几个字段不等于 gate 已就绪。

### gate 不能跳过，不能降级

建立 .ai/PROJECT.md 时，不能为了少问而把未确认的 gate 写成基线事实。

- AI 不能凭"能推导""其余信息作假设推进"跳过影响 baseline 的 gate。
- 影响 baseline 的 gate 未就绪时，不能把它降级为普通 Assumption 后直接出包。

进入 Baseline Decision Packet（阶段 B/C）的条件：

- 所有影响 baseline 的 gate 都已 confirmed / not applicable / converted to Seed Task。
- 不能因为"看起来能推导"就进入阶段 B/C。
- 不能把 Assumptions / Pending Questions 通过整份确认洗成 baseline facts。

连续澄清规则：

- 每轮默认只问 1 个 gate 的最高影响问题，必要时最多 2 个。
- 用户回答后，AI 必须重新评估全部 gate 状态。
- 如果还有影响 baseline 的 gate 未就绪，应继续问下一轮，或转成 Seed Task 调查；不能直接当作 Assumption 写入 .ai/PROJECT.md。

### 第一轮澄清：问准 gate，不做问卷

当有影响 baseline 的 gate 未确认时触发；目标不是收集完整 PRD 信息，而是确认最影响 .ai/PROJECT.md baseline 的 gate。不要在第一轮就展开完整 Goal / MVP / Inputs / Tech Direction / Validation / Seed Tasks。

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

**其余不影响 .ai/PROJECT.md baseline 的信息缺失才是非阻塞**：AI 可以作假设继续推进，在回复中展示 Assumptions，不连续追问。用户暂时不确定时，project-init 仍然可以继续生成 Baseline Decision Packet，但影响 baseline 的 gate 必须按"gate 不能跳过，不能降级"节处理。

**例外**：当外部数据来源、鉴权方式、本地登录态 / API 可用性、设备权限、平台限制等信息会决定核心 MVP 是否可行或决定主要实现路径时，不能把它当作普通 Assumption，也不能把真实接入写成已确认任务。Seed Tasks 必须先安排调查 / mock 验证，确认可行后再接入真实逻辑。

### 需求分析分层

AI 必须显式区分 4 层，防止把理解当事实：

| 层 | 含义 | 能否写入 .ai/PROJECT.md 基线 |
|---|---|---|
| **用户原话** | 用户字面说的 | 否（只是输入） |
| **AI 理解** | AI 转述的需求 | 否（待确认） |
| **待确认假设** | 信息不足时 AI 补的假设 | 否 |
| **已确认决策** | 用户确认过的 | 是 |

需求分析表只在 project-init 的回复中展示，**不原样塞进 .ai/PROJECT.md**。它的作用是防止 AI 把理解当事实。

### 技术方向生成逻辑

不要根据项目标签选栈（如"todo 工具 → Python"）。必须从需求、使用场景、输入输出、运行环境、硬约束、成功标准推导。

1. 从 Goal / Users / I/O / Constraints 提取技术约束。
2. 输出 2-3 个候选方向，每个含：
   - **适用场景**：什么需求下它合适
   - **代价**：学习成本 / 依赖体积 / 维护负担
   - **不选它的原因**：什么情况下它是错的选择
   - **推荐**：AI 给一个推荐 + 理由（推荐不是决定）
3. 明确列出需要用户确认的技术选择点。

AI 推荐不等于决定。用户未确认前，技术方向不写入 .ai/PROJECT.md。未确认的 Tech Direction 必须标为"待确认推荐"：

> Tech Direction：待确认推荐为 Python + PySide6，理由是……

用户明确确认后，才可以写入 .ai/PROJECT.md 的 Tech Direction。

当 Tech Direction 依赖未确认前提时，不能写成确定技术方向。可以在回复里给待确认推荐和候选方案，但 .ai/PROJECT.md 只能写用户确认过的技术方向。如果技术方向前提仍未确认，应先把"确认技术方向前提"列为 Seed Task，而不是写暂定技术方向。

### .ai/PROJECT.md 结构：9 节

`.ai/PROJECT.md` 必须含 9 节：

1. **Goal** — 这个项目要解决什么问题，1-3 句话。
2. **Users and Scenarios** — 谁用，什么场景下用。
3. **MVP** — 最小可用版本包含哪些功能。
4. **Inputs and Outputs** — 主要输入和输出是什么。
5. **Non-goals** — 明确不做什么。防止 AI 过度设计。
6. **Tech Direction** — 技术方向。含已确认的技术选择和理由。
7. **Constraints and Working Rules** — 硬约束和工作规则。
8. **Validation** — 怎么确认功能可用。个人项目可以只写"手动跑命令验证"。
9. **Seed Tasks** — 第一批启动任务，≤ 5 条。

### Assumptions 不默认写入 .ai/PROJECT.md

- .ai/PROJECT.md 是基线文件，只记录用户确认过的决策、约束和可核验事实。
- AI 可以在 project-init 的回复中展示 Assumptions / Pending Questions。
- **未确认内容不能写入 .ai/PROJECT.md 的基线章节**。
- .ai/PROJECT.md 禁止写入：暂定技术方向、待确认约束、Pending Questions、Assumptions、"如果以后确认再改"的基线事实。
- 这些未确认内容只能放在 project-init 回复里，或转成 Seed Tasks 的调查/确认任务。
- 不要把 Assumptions 做成 .ai/PROJECT.md 的固定章节。
- 如果确实有未解决问题，优先放在 project-init 回复或 commit message 的 Next / Notes 中。

### 不写代码，不建脚手架

project-init 只产出文档。代码交给 project-work 写。不要在 init 阶段创建 `src/`、`package.json`、`main.py` 等。

### Seed Tasks 规则

- ≤ 5 条，用于第一轮 project-work 启动。
- 必须服务 MVP，不能写 MVP 之外的任务。
- 是可执行的第一步，不是 roadmap 条目。
- 不能把未来想法写成当前任务。
- 当核心能力依赖未确认的外部 I/O 或可行性未知时（数据来源、鉴权、登录态、API 可用性、设备权限、平台限制），Seed Tasks 必须先安排调查、探测或 mock 验证，不能直接把真实接入写成确定任务。
- 后续的 Next 写在 commit message 里，不回写到 .ai/PROJECT.md。不要把 .ai/PROJECT.md 变成长期任务看板。

### 不替用户 git commit

project-init 可以生成 initial commit message 供用户确认，但不要执行 `git commit`。提交动作交给用户，或交给 project-finish 处理。这与 project-finish 的规则一致。

### 不预判风险

不要预判项目风险，不要使用 AI Risks 作为 .ai/PROJECT.md 章节。AI 的推荐和假设不是基线事实。

### 范例参考

完整的 .ai/PROJECT.md 范例见 `docs/examples.md`。

### 核心原则

详见 `docs/design-principles.md`。重点是：Decision Ownership、轻量优先、Git 是事实源、文档只保存长期基线。

---

## 完成后下一步

1. AI 输出 baseline decision packet。
2. 用户确认整份基线（不逐项审批）。
3. AI 生成 .ai/PROJECT.md，只写已确认内容。
4. 用户确认后：
   - 用户自行 `git add .ai/PROJECT.md && git commit`，或
   - 进入 project-finish 走提交流程（生成 commit message 供确认）。
5. 提交后进入 project-work，从 seed tasks 的第一条开始推进。
