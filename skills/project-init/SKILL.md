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
[阶段 A] 需求澄清（仅当存在关键未知时）
  ├─ AI 评估是否存在关键未知：
  │    - 没有关键未知 → 直接进入阶段 B
  │    - 存在关键未知 → 先做轻量澄清
  ├─ 轻量澄清输出：用户原话 / AI 初步理解 / 待确认假设 / 1 个关键确认（必要时最多 2 个）
  ├─ 可选："选最接近的就行，有特殊要求可以补充"
  └─ 用户回答后综合信息，不逐项追问，直接进入阶段 B
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

### 基线确认规则：整份确认，不默认通过

Stage C 必须显式确认整份 Baseline Decision Packet，不能只确认某一项就写入 PROJECT.md。

- 禁止用"其余如无异议""默认同意""只确认技术方向"等措辞替代整份 baseline 确认。
- 如果使用 `request_user_input` / 用户输入面板，确认问题应针对整份 baseline，例如"是否确认这份 baseline 写入 PROJECT.md？"
- 面板选项示例：
  - 确认写入
  - 需要调整范围 / MVP
  - 需要调整技术方向 / 约束
- 用户只确认某一项时（如只选了技术方向），只能视为该项确认，不能视为整份 baseline 确认。AI 必须再次就整份 baseline 征求确认。
- 用户确认整份 baseline 后，才可以写入 PROJECT.md。
- 用户确认整份 Baseline Decision Packet，只确认其中明确标为已确认的内容。不能把 Assumptions / Pending Questions / 待确认推荐通过整份确认洗成 confirmed baseline facts。

### 交互节奏：关键未知模型，不用字段数量判断

project-init 先判断是否存在"会改变 PROJECT.md baseline 的关键未知"。关键未知指：答案不同会改变 Goal / MVP / Tech Direction / Constraints and Working Rules / Validation / Seed Tasks 的信息。

- **没有关键未知时**：可以直接进入候选方案分析和 Baseline Decision Packet，不问澄清问题。
- **存在关键未知时**：不直接出完整 Baseline Decision Packet；先问 1 个最高影响决策点。用户回答后，再判断是否还有关键未知。

关键未知类型（通用，不针对单一场景）：

- 硬约束：课程/作业要求、平台限制、必须用的工具、截止/交付方式
- 核心使用场景：谁用、在哪里用、如何交付
- 输入输出边界：数据从哪来，到哪去，是否依赖外部系统
- MVP 完成标准：做到什么算能用/能交
- 技术方向前提：是否必须有后端、数据库、部署、GUI、CLI 等

不要用"能推导出 Goal + 至少 2 项"这种字段数量判断。能脑补出几个字段不等于没有关键未知。

### 关键未知不能降级

project-init 是低频但关键的基线建立入口，可以比 project-work 更严格。建立 PROJECT.md 时，不能为了少问而把关键未知写成基线事实。

- 一旦 AI 识别出某未知会影响 Goal / MVP / Tech Direction / Constraints and Working Rules / Validation / Seed Tasks，就不能把它降级为普通 Assumption 后直接出包。
- 不能用"其余信息作假设推进"绕过关键未知。

关键未知必须满足以下三者之一，才能继续：

1. 用户明确确认；
2. 转成 Seed Tasks 中靠前的调查/确认任务；
3. 明确说明它为什么不影响第一版 baseline。

连续澄清规则：

- 每轮仍默认只问 1 个最高影响问题，必要时最多 2 个。
- 用户回答后，AI 必须重新检查是否还有关键未知。
- 如果还有会改变 Tech Direction / MVP / Validation / Seed Tasks 的关键未知，应继续问下一轮，或转成 Seed Task 调查；不能直接当作 Assumption 写入 PROJECT.md。

### 第一轮澄清：问准关键未知，不做问卷

当存在关键未知时触发；目标不是收集完整 PRD 信息，而是确认最影响 PROJECT.md baseline 的关键未知项。不要在第一轮就展开完整 Goal / MVP / Inputs / Tech Direction / Validation / Seed Tasks。

#### 提问数量

- 默认只问 **1 个** 最高影响问题。
- 如果确实有两个同等关键未知，最多问 2 个。
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

**其余不影响 PROJECT.md baseline 的信息缺失才是非阻塞**：AI 可以作假设继续推进，在回复中展示 Assumptions，不连续追问。用户暂时不确定时，project-init 仍然可以继续生成 Baseline Decision Packet，但关键未知必须按"关键未知不能降级"节处理。

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

当 Tech Direction 依赖未确认前提时，不能写成确定技术方向。可以在回复里给待确认推荐和候选方案，但 PROJECT.md 只能写用户确认过的技术方向。如果技术方向前提仍未确认，应先把"确认技术方向前提"列为 Seed Task，而不是写暂定技术方向。

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
- PROJECT.md 禁止写入：暂定技术方向、待确认约束、Pending Questions、Assumptions、"如果以后确认再改"的基线事实。
- 这些未确认内容只能放在 project-init 回复里，或转成 Seed Tasks 的调查/确认任务。
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
