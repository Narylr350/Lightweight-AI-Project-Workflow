# 轻量 AI 项目工作流 Skill Pack

一套面向个人项目和小型开源项目的 AI 项目工作流 skill。

没有项目上下文时，AI 通常会采用通用做法。通用做法本身没有问题，但不应该覆盖项目已经形成的目标、边界、表达方式和维护习惯。

这个 pack 保存项目推进需要的工程上下文，并尽量继承项目中已有的作者选择和具体锚点，让无记忆或弱记忆的 AI 在换线程、换模型后仍能继续对齐项目。未特别定义的部分可以继续使用合适的默认做法。

5 个 skill，Git 事实源，结构化 commit message，最小基线文件。

---

## 适用场景

- 个人项目
- 小型开源项目
- 课程项目
- 实验性工具

---

## 5 个 Skill

| Skill | 一句话 | 何时触发 |
|---|---|---|
| **project-init** | 新项目初始化或建立基线 | 新项目第一天 / 无 `.ai/PROJECT.md` 或基线不完整 / 方向大改 |
| **project-work** | 日常主入口，判断任务类型后最小范围推进 | 每次开工 |
| **project-finish** | 收尾检查 + 生成结构化 commit message | 一轮工作结束准备提交前 |
| **project-handoff** | 为未完成工作生成 Git 外临时接力 | 额度 / 上下文 / 工具中断时由用户手动触发 |
| **project-audit** | 低频复盘诊断，默认只读不改 | 多轮失败 / 用户喊停 / release 前 / 接手冲突 |

典型流程：

```text
init（一次）-> work ⇄ finish（常态循环）
                  ├-> handoff（用户手动中断）-> work
                  └-> audit（异常时介入）
```

---

## 三层事实模型

| 层 | 载体 | 记什么 |
|---|---|---|
| **事实** | Git（代码 / diff / 文件） | 做了什么改动 |
| **交接** | commit message | Why / What / Verify / Next / Notes |
| **基线** | `.ai/` 基线文件（项目内） | PROJECT 摘要 / TECH 技术方向 / CONSTRAINTS 工作规则 / VALIDATION 验证规则 |

交接信息只是线索，必须用 Git + 文件系统核验后才采信。

详见 `docs/design-principles.md`。

---

## 文件结构

```
README.md                          本文件
skills/
  project-init/SKILL.md            初始化 / 建立基线
  project-work/SKILL.md            日常主入口
  project-finish/SKILL.md          收尾 + 生成 commit
  project-handoff/SKILL.md         手动生成未完成工作的临时接力
  project-audit/SKILL.md           低频复盘
docs/
  design-principles.md             核心原则展开
  examples.md                      范例（`.ai/` 基线文件 / commit / audit 输出）
```

基线文件不在本 pack 内，而是由 project-init 在你的项目里创建：

```
<你的项目>/
  .ai/PROJECT.md                   决策摘要：Goal / Users / MVP / I/O / Non-goals / Seed Tasks
  .ai/TECH.md                      技术方向
  .ai/CONSTRAINTS.md               工作规则、硬约束、接入的 skill
  .ai/VALIDATION.md                验证命令和规则
```

project-handoff 还会按需创建 `.ai/HANDOFF.local.md`。它是本地临时交接，不属于基线，不进入 Git。

---

## 安装

将本 pack 的 `skills/` 目录下的 5 个 skill 文件夹放入你的 skill 发现路径（如 `~/.config/opencode/skills/` 或项目 `.opencode/skills/`）。

## 怎么用

用平台提供的显式 skill 调用方式触发（例如 OpenCode 的 `/project-work` 或 Codex 的 `$project-work`），不要等 AI 自己选。

**新项目第一天：**

```
/project-init 我想做一个 XXX 工具
```

AI 问几个关键问题 -> 生成基线确认包 -> 你确认 -> 写入 `.ai/` 基线文件。

**日常开发：**

```
/project-work 做 XXX 功能
```

AI 读 `.ai/PROJECT.md` 摘要和 `.ai/CONSTRAINTS.md` 规则 -> git 核验 -> 判断任务类型 -> 实现 -> 自动进入 finish。

**一轮做完，收尾提交：**

```
/project-finish
```

AI 检查改动 -> 验证 -> 生成 commit message -> 你确认后提交。

**工作没完成，但必须换线程或换 AI：**

```text
/project-handoff
```

AI 核验当前 Git / 文件状态 -> 生成 `.ai/HANDOFF.local.md` 和可复制交接文本 -> 下一位 AI 用 project-work 接手。

project-handoff 只能由用户明确调用。它不会因为额度、上下文长度、错误次数或工作区有未提交改动而自动触发；Codex 安装会通过 skill policy 禁止隐式调用。

**感觉跑偏了：**

```
/project-audit
```

AI 只读分析 -> 输出诊断报告 -> 交你决定。

**搭配执行层 / finish 层 skill：**

init 阶段会列出环境里已装的执行层 skill（如 TDD / debugging）和 finish 层 skill（如 code review）。你确认要用的会写入 `.ai/CONSTRAINTS.md`。之后 work/finish 会按层自动加载它们：

```
/project-work 用 TDD 做 XXX 功能
```

---

## 核心原则

- AI owns execution, user owns decisions
- 轻量是注意力控制，不是少做事
- Git 是主要事实源
- commit message 是已提交工作的交接载体
- 未完成工作只在用户手动触发时生成本地临时 handoff
- 文档只保存长期基线
- 产物只写项目内容

详见 `docs/design-principles.md`。
