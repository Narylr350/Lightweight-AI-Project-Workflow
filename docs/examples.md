# 范例

本文件提供 PROJECT.md、commit message、audit 输出的范例。各 SKILL.md 引用此处，不重复。

---

## 范例 1：PROJECT.md

假设项目：一个命令行 todo 工具（个人使用）。

```markdown
# Todo CLI

## 目标

一个命令行 todo 工具，支持快速添加、列出、完成、删除任务。本地存储，无网络依赖。

## 非目标

- 不做云同步
- 不做团队协作
- 不做 GUI（第一版）
- 不做提醒/通知

## MVP

- `todo add "<任务>"` 添加任务
- `todo list` 列出未完成
- `todo done <id>` 标记完成
- `todo del <id>` 删除
- 数据存 `~/.todo.json`

## 技术边界

- 语言：Python 3.10+
- 依赖：仅标准库，不引入第三方包
- 存储：单 JSON 文件，无数据库
- 平台：Windows / macOS / Linux

## AI 风险

- AI 可能过度设计：加提醒、加优先级、加标签——都在非目标里，不要做
- AI 可能引入第三方库（rich/click）——非目标，标准库足够
- AI 可能把存储改成 SQLite——非目标，单 JSON 文件

## 验证方式

- 手动跑命令验证功能
- `python -m todo add test && python -m todo list` 看输出
- 无自动化测试要求（个人项目，MVP 阶段）

## seed tasks

1. 搭建项目结构：`todo/__main__.py` + `todo/cli.py` + `todo/storage.py`
2. 实现 storage.py：读写 `~/.todo.json`，CRUD 基础
3. 实现 cli.py：add / list / done / del 四个子命令
4. 手动验证完整流程
```

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

## 现状（Git 核验）

- 最近 5 个 commit：feat: add tag system / feat: add priority / feat: add reminder / feat: add due date / feat: add subtask
- PROJECT.md 基线：MVP = add/list/done/del，非目标明确写了"不做提醒"
- 当前代码：cli.py 已 300+ 行，引入了 argparse 以外的逻辑

## 问题

1. **跑偏**：5 个 commit 全在做非目标功能（tag/priority/reminder/due date/subtask）。PROJECT.md 非目标明确写了"不做提醒"。
2. **过度工程化**：引入了 tag/priority 等概念，MVP 标准库足够，不需要这些。
3. **基线未更新**：PROJECT.md 仍写 MVP = 4 个命令，但代码已远超 MVP，基线与实际脱节。

## 根因

- AI 没有在每轮 work 开头读 PROJECT.md 的非目标。
- 用户需求表达模糊时，AI 默认加功能而非停下来问。
- 没有 audit 触发，跑偏累积。

## 建议

1. **立即停止加新功能**。
2. 回退或保留已有功能由用户决定——建议保留但标记为"实验性"。
3. 更新 PROJECT.md：如果用户确实想要这些功能，重定义 MVP；如果不要，规划回退。
4. 后续每轮 project-work 必须先读 PROJECT.md 非目标再开工。

## 下一步

回到 project-work：用户决定方向（保留/回退/重定义 MVP），然后执行。
```
