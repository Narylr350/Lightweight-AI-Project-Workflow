---
name: project-handoff
description: 仅当用户明确调用 project-handoff 或明确要求生成交接时使用。把因额度、上下文压缩、服务故障或必须换 AI 而中断的未完成工作，压缩成 Git 外的临时接力材料。禁止 AI 根据额度、上下文长度、错误次数或任务未完成状态自行触发。
---

# Project Handoff

## 定位

为**尚未完成、不能合理提交，但必须换线程或换 AI** 的工作生成一次临时接力。

它不是 project-finish，不创建完成假象，不要求为了交接提交半成品。它只压缩当前工作增量，让下一位 AI 能从仓库事实继续。

## 触发规则：只能由用户手动触发

- 只有用户明确调用 `project-handoff`，或明确要求“生成交接 / 换 AI 接手”时才执行。
- **禁止**因为 AI 发现额度可能不足、上下文较长、连续报错、任务未完成或准备结束回复而自行触发。
- project-work / project-finish / project-audit 不得替用户自动调用本 skill，只能在适用时告诉用户它存在。
- 用户的明确调用已经授权生成临时交接，不再为“是否生成”重复确认。

## 何时用

- 额度即将用完，当前工作还没完成。
- 上下文将被压缩，用户希望换新线程或换模型继续。
- 当前 AI、工具或服务故障，需要交给另一个 AI。
- 用户主动要求暂停当前工作并生成可接力材料。

## 何时不用

- 一轮工作已经完成并准备提交 → 用 project-finish。
- 正常继续上一轮已提交工作 → 用 project-work 读取 commit Next。
- 多轮失败需要判断是否跑偏 → 用 project-audit。
- 用户没有明确要求交接 → 不触发。

## 关键边界

- 默认只读项目状态；除临时 handoff 文件和本地 Git exclude 外，不修改项目文件。
- 不 `commit`、`tag`、`push`、`stash`、`reset`、`clean`、切分支或合并。
- 不为了让状态更整齐而补代码、格式化、安装依赖、构建或跑测试；只记录已经存在的结果。
- handoff 是线索，不是事实源，不确认新决策，也不把 AI 推断写成用户决定。
- 不复制完整对话、完整 diff、长日志或已有基线文档；引用路径、commit、命令和关键结果即可。
- 删除 API key、密码、token、cookie、本地凭据和不必要的个人信息。

## 执行流程

### 1. 核验当前状态

读取当前任务相关的项目级指令和 `.ai/` 基线，再核验：

- 当前项目 / Git 根目录
- 当前分支和 HEAD
- `git status`
- staged / unstaged / untracked 范围
- 与当前任务直接相关的 `git diff`
- 已经执行过的验证及其原始结果

没有 Git 仓库时，明确写出“非 Git 项目”，改用文件系统核验，不假装有提交事实。

### 2. 只压缩继续工作需要的增量

优先保留：

- 用户当前真正要求什么
- 已完成进度和已确认决策
- 未完成部分处于什么状态
- 改动文件及其作用
- 已验证 / 未验证边界
- 已排除方案和失败原因
- Git 无法表达的运行时或外部状态
- 下一位 AI 的第一个核验动作和最近下一步

项目长期目标、技术方向和规则已经在 `.ai/` 或项目指令中存在时，只引用，不重复抄写。

### 3. 写入本地临时文件

默认路径：

```text
.ai/HANDOFF.local.md
```

规则：

- 该文件不是基线文件，不进入三层事实模型。
- Git 仓库中，如果该文件尚未被忽略，用 `git rev-parse --git-path info/exclude` 定位本地 exclude 文件，把 handoff 的**精确相对路径**加入其中；不要假定 `.git` 一定是目录，也不要修改 tracked `.gitignore`。
- 写入后用 `git check-ignore` 或等价方式确认它不会被提交。
- 如果该路径已经被 Git 跟踪，不覆盖 tracked 文件；改为只在回复中输出 handoff，并说明路径冲突。
- 新 handoff 可以覆盖旧的本地 handoff；用户本次手动触发代表要以当前状态为准。

### 4. 同时输出可复制版本

回复中给出：

- 本地 handoff 文件路径（若成功写入）
- 一份 Markdown 代码块中的相同内容
- 一句接手方式：让下一位 AI 使用 project-work，并先核验 Git 后读取该 handoff

不要在交接后继续推进原任务。

## Handoff 输出契约

只保留有内容的节，空节直接省略：

```markdown
# Project Handoff

## Task
用户当前要求和本次交接目标。

## Repository State
项目路径、Git 根、分支、HEAD、staged / unstaged / untracked 摘要。

## Progress and Decisions
已完成进度、用户确认过的决定。

## Work in Progress
未完成部分、相关文件、代码当前处于什么状态。

## Verification
已经执行的验证、真实结果、尚未覆盖的范围。

## Rejected or Failed Paths
已排除方案、失败原因，防止重复尝试。

## Runtime or External State
进程、服务、端口、临时路径、IDE / MCP / 外部系统状态。

## Next Action
下一位 AI 先核验什么，再做哪个最近步骤。

## References
必要的文件路径、commit、issue、日志或外部资料。
```

## 接手纪律

handoff 中的完成描述、验证结论和 Next 都必须由下一位 AI 使用 Git、文件系统和实际工具重新核验。发现冲突时，以当前仓库事实和用户当前要求为准。
