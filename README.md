# 轻量 AI 项目工作流 Skill Pack

一套面向个人项目和小型开源项目的轻量 AI 项目启动与推进 skill。不是 Superpowers，不是 Matt skills，不是 BMad——它解决的是三个真实痛点：

**痛点一：AI 越写越笨。** 同一对话上下文长了质量下降，换新对话又要重新解释项目背景。时间花在复述上，不是花在开发上。

**痛点二：重流程压死人。** Superpowers 做个功能先写 spec、brainstorm、design、plan——小项目撑不起这个 token 消耗。设计文档和实施计划还会互相打架。

**痛点三：AI 做完就走了。** 改了什么、为什么改、怎么验证、下一步做什么——这些交接信息不留下，下个 AI 只能靠猜。

这个 pack 不试图复现完整软件工程流程。它只用 Git、一份轻量基线文件和几行结构化 commit message，让 AI 能在个人项目里低成本立项、稳定推进、干净收尾。

**核心设计：**

- **三层事实模型**：Git（事实）→ commit message（交接）→ .ai/PROJECT.md（基线）。信息存在文件里，不靠对话记忆。
- **Decision Ownership**：AI 推进与执行，用户做关键判断与拍板。AI 不能替用户决定目标、MVP、技术方向、基线。
- **轻量优先**：简单任务走快速模式，验证按风险分级，不让流程开销超过改造成本。
- **入口极少**：只 4 个 skill——init / work / finish / audit，内部阶段不暴露为命令。

**不是什么：**

- 不是 Superpowers / BMad 替代品（它们太重）
- 不是跨对话记忆工具（跨对话接力只是能力之一，不是定位）
- 不是完整软件工程流程（个人项目不需要）
- 不含 CLI / MCP / hook / 数据库

---

## 适用场景

- 个人项目
- 小型开源项目
- 课程项目
- 实验性工具

不适用：需要重型 PM 流程、多人协作、正式发布管理的团队项目。

---

## 4 个 Skill

| Skill | 一句话 | 何时触发 |
|---|---|---|
| **project-init** | 新项目初始化或建立基线 | 新项目第一天 / 无 .ai/PROJECT.md / 方向大改 |
| **project-work** | 日常主入口，判断任务类型后最小范围推进 | 每次开工 |
| **project-finish** | 收尾检查 + 生成结构化 commit message | 一轮工作结束准备提交前 |
| **project-audit** | 低频复盘诊断，默认只读不改 | 多轮失败 / 用户喊停 / release 前 / 接手冲突 |

典型流程：

```
init（一次）→ work ⇄ finish（常态循环）→ audit（异常时介入）
```

---

## 三层事实模型

整套 pack 建立在这个模型上：

| 层 | 载体 | 记什么 |
|---|---|---|
| **事实** | Git（代码 / diff / 文件） | 做了什么改动 |
| **交接** | commit message | Why / What / Verify / Next / Notes |
| **基线** | `.ai/PROJECT.md`（项目内） | Goal / Users and Scenarios / MVP / Inputs and Outputs / Non-goals / Tech Direction / Constraints and Working Rules / Validation / Seed Tasks |

铁律：交接信息只是线索，必须用 Git + 文件系统核验后才采信。

详见 `docs/design-principles.md`。

---

## 文件结构

```
README.md                          本文件
skills/
  project-init/SKILL.md            初始化 / 建立基线
  project-work/SKILL.md            日常主入口
  project-finish/SKILL.md          收尾 + 生成 commit
  project-audit/SKILL.md           低频复盘
docs/
  design-principles.md             核心原则展开
  examples.md                      范例（.ai/PROJECT.md / commit / audit 输出）
```

基线文件不在本 pack 内，而是由 project-init 在你的项目里创建：

```
<你的项目>/
  .ai/PROJECT.md                   项目基线（9 节），由 project-init 创建
```

---

## 安装

将本 pack 的 `skills/` 目录下的 4 个 skill 文件夹放入你的 skill 发现路径（如 `~/.config/opencode/skills/` 或项目 `.opencode/skills/`）。

## 怎么用

用 `/skill 名` 强制触发对应 skill，不要等 AI 自己选。

**新项目第一天：**

```
/project-init 我想做一个 XXX 工具
```

AI 问几个关键问题 → 生成基线确认包 → 你确认 → 写入 `.ai/PROJECT.md`。

**日常开发：**

```
/project-work 做 XXX 功能
```

AI 读基线 → git 核验 → 判断任务类型 → 实现 → 自动进入 finish。

**一轮做完，收尾提交：**

```
/project-finish
```

AI 检查改动 → 验证 → 生成 commit message → 你确认后提交。

**感觉跑偏了：**

```
/project-audit
```

AI 只读分析 → 输出诊断报告 → 交你决定。

**搭配执行层 skill：**

init 阶段会列出环境里已装的执行层 skill（如 TDD / debugging），你确认要用的会写入 `.ai/PROJECT.md`。之后 work 会自动加载它们：

```
/project-work 用 TDD 做 XXX 功能
```

---

## 核心原则摘要

- AI owns execution, user owns decisions（决策归属）
- 轻量优先，避免重流程常态化
- Git 是主要事实源
- commit message 是交接载体，不是日记
- 文档只保存长期基线，不保存流水账
- 用户当前需求优先于旧计划，但不偷偷改基线
- 入口最小化（4 个 skill）

详见 `docs/design-principles.md`。
