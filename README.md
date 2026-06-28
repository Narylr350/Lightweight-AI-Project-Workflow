# 轻量 AI 项目工作流 Skill Pack

为个人项目、小型开源项目、课程项目、实验性工具提供一套轻量 AI 工作流程。

让 AI 能低成本完成项目初始化、日常推进、需求变化处理、收尾记录和必要复盘。

**Decision Ownership：** AI 负责推进与执行，用户负责关键判断与拍板。AI 可以分析、提候选方案、推荐、执行已确认范围内的任务；不能替用户决定项目目标、MVP、Non-goals、技术方向、长期基线、release、commit、tag、push。这个 pack 不是 AI 全权接管项目。

---

## 这是什么

一套 Markdown skill pack，包含 4 个 skill，让 AI 在小型项目中保持轻量、可核验、不跑偏。

**不是什么：**

- 不是跨对话记忆工具（跨对话接力只是能力之一，不是定位）
- 不是 Superpowers / BMad 替代品
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
| **project-init** | 新项目初始化或建立基线 | 新项目第一天 / 无 PROJECT.md / 方向大改 |
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
| **基线** | `PROJECT.md`（项目根目录） | Goal / Users and Scenarios / MVP / Inputs and Outputs / Non-goals / Tech Direction / Constraints and Working Rules / Validation / Seed Tasks |

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
  examples.md                      范例（PROJECT.md / commit / audit 输出）
```

---

## 安装

将本 pack 的 `skills/` 目录下的 4 个 skill 文件夹放入你的 skill 发现路径（如 `~/.config/opencode/skills/` 或项目 `.opencode/skills/`）。

AI 会根据 skill 的 `description` 自动判断何时触发对应 skill。

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
