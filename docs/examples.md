# 范例

本文件提供 `.ai/` 基线文件、commit message、audit 输出的范例。各 SKILL.md 引用此处，不重复。

---

## 范例 1：`.ai/` 基线文件

假设项目：一个命令行 todo 工具（个人使用）。

技术方向决策过程（用户确认前，AI 在回复中展示）：

```
候选 A：Python + 标准库
  适用场景：单人 CLI，数据量小，无网络依赖
  代价：无第三方依赖，但 CLI 参数解析需手写或用 argparse
  不选原因：无（除非用户已熟悉其他语言）
  推荐：是——符合单人、本地、零依赖需求

候选 B：Python + click/rich
  适用场景：需要复杂子命令或彩色输出
  代价：引入第三方依赖，打包变复杂
  不选原因：MVP 不需要复杂输出
  推荐：否

候选 C：Node.js
  适用场景：用户更熟 JS，或后续可能做 Web 版
  代价：与用户当前环境不一致
  不选原因：用户未表达 JS 偏好
  推荐：否

需用户确认：语言选 Python（标准库），存储用单 JSON 文件。
```

用户确认后生成 4 个 `.ai/` 基线文件。

`.ai/PROJECT.md`（每轮必读摘要）：

```markdown
# Todo CLI

## Goal

一个命令行 todo 工具，支持快速添加、列出、完成、删除任务。本地存储，无网络依赖。

## Users and Scenarios

单人使用。场景：在终端快速记录待办，完成后标记，不依赖云端。

## MVP

- `todo add "<任务>"` 添加任务
- `todo list` 列出未完成
- `todo done <id>` 标记完成
- `todo del <id>` 删除

## Inputs and Outputs

- 输入：命令行参数（子命令 + 任务文本 / id）
- 输出：终端文本（任务列表 / 操作确认）
- 数据来源：用户手动输入
- 数据存储：本地 `~/.todo.json`

## Non-goals

- 不做云同步
- 不做团队协作
- 不做 GUI（第一版）
- 不做提醒/通知

## Seed Tasks

1. 搭建项目结构：`todo/__main__.py` + `todo/cli.py` + `todo/storage.py`
2. 实现 storage.py：读写 `~/.todo.json`，CRUD 基础
3. 实现 cli.py：add / list / done / del 四个子命令
4. 手动验证完整流程
```

`.ai/TECH.md`：

```markdown
# Tech Direction

- 语言：Python 3.10+
- 依赖：仅标准库，不引入第三方包
- 存储：单 JSON 文件，无数据库
- 平台：Windows / macOS / Linux

用户确认：Python 标准库 + JSON 文件存储。AI 曾推荐 Python，候选含 Node.js，用户选 Python。
```

`.ai/CONSTRAINTS.md`：

```markdown
# Constraints and Working Rules

- 不引入第三方包
- 单 JSON 文件存储，不用数据库
- 跨平台运行
- 未接入外部执行层 skill
- 未接入 finish 层 skill
```

`.ai/VALIDATION.md`：

```markdown
# Validation

- 手动跑命令验证功能
- `python -m todo add test && python -m todo list` 看输出
- 无自动化测试要求（个人项目，MVP 阶段）
```

注意：范例中展示的候选方案分析只出现在 project-init 的回复中，不写入 `.ai/` 基线文件。基线文件只记录用户确认后的选择。
---

## 范例 2：标准 commit message（Notes 省略）

```
feat: 实现 todo list 子命令

Why:    MVP 需要 list 功能，用户要能看到未完成任务
What:   - 新增 cli.py 的 list 子命令
        - storage.py 加 get_pending() 返回未完成任务列表
        - 输出格式：id + 任务文本
Verify: 手动跑 `python -m todo list`，输出空（无任务时）正确；add 后再 list 输出任务
Next:   实现 done 子命令
```

---

## 范例 3：含 Notes 的 commit message

```
fix: 修复 JSON 文件不存在时崩溃

Why:    首次运行时 ~/.todo.json 不存在，storage 读文件直接报错
What:   - storage.py 读文件前检查存在性，不存在返回空列表
        - add 时若文件不存在则创建
Verify: 删除 ~/.todo.json 后跑 `python -m todo add test`，不崩溃且任务写入成功
Next:   考虑文件权限问题（跨平台路径）
Notes:  - 已否方案：曾考虑用 try/except 捕获 FileNotFoundError，但显式检查更清晰
        - 临时妥协：未处理 JSON 格式损坏的情况，留给后续
```

---

## 范例 4：audit 输出

触发场景：AI 连续 3 轮在 todo 工具里加功能，但用户说"不对，怎么越做越复杂"。

```markdown
# Project Audit 报告

## 触发原因

用户连续 3 轮反馈"不对"，项目偏离预期。

## 观察方式

当前 AI 参与了前几轮功能扩展，因此调用一个独立上下文的子代理做只读反证审查。交给它的只有用户目标、`.ai/` 基线、5 个 commit 和用户反馈，没有附带主 AI 的根因或保留 / 回退倾向；主 AI 随后重新核验了它提出的候选解释。

## 现状（Git 核验）

- 最近 5 个 commit：feat: add tag system / feat: add priority / feat: add reminder / feat: add due date / feat: add subtask
- `.ai/PROJECT.md` 摘要：MVP = add/list/done/del，Non-goals 明确写了"不做提醒"
- `.ai/CONSTRAINTS.md`：未声明允许扩展 tag/priority/reminder 等功能
- 当前代码：cli.py 已 300+ 行，引入了 argparse 以外的逻辑

## 问题

1. **跑偏**：5 个 commit 全在做非目标功能（tag/priority/reminder/due date/subtask）。`.ai/PROJECT.md` 非目标明确写了"不做提醒"。
2. **过度工程化**：引入了 tag/priority 等概念，MVP 标准库足够，不需要这些。
3. **基线未更新**：`.ai/PROJECT.md` 仍写 MVP = 4 个命令，但代码已远超 MVP，基线与实际脱节。

## 判断与证据

- **已核验事实**：最近 5 个 commit 超出当前 MVP，其中 reminder 与 Non-goals 直接冲突；`.ai/` 基线没有同步变化。
- **候选解释 A**：AI 在 work 中忽略或错误解释了基线。需要结合线程记录、commit Notes 或执行过程继续核验，不能只从结果断定“AI 没读”。
- **候选解释 B**：用户实际上改变了方向，但新的决定没有写回基线。当前 Git 无法单独判断，需要用户确认。
- **反证检查**：如果 commit Notes 记录了这些功能由用户逐项确认，就不能把问题简单归为 AI 擅自扩展；问题更可能是基线更新和任务收尾遗漏。
- **外部调研**：本问题由仓库目标、提交和用户决定即可判断，不涉及陌生技术或成熟方案比较，因此不需要联网。

## 可行路径与取舍

1. 如果新增功能不是用户想要的：停止扩展，通过 project-work 规划删除或回退。优点是恢复当前 MVP，代价是放弃已有实现。
2. 如果项目方向已经改变：保留功能，回 project-init / re-init 重新确认 MVP 和 Non-goals。优点是代码与真实方向一致，代价是需要重新建立基线。
3. 如果只有部分功能值得保留：先由用户选定范围，再拆分保留与回退任务。不要默认把所有额外功能标成“实验性”。

## 推荐

先确认这些新增功能是否来自用户已决定的方向变化，再选择回退或更新基线；现有证据不足以替用户决定保留哪一条路径。
```
