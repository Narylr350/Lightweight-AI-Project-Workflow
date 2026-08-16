import type { ExtensionAPI, ExtensionCommandContext } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

const BUILTIN_TOOLS = new Set(["read", "grep", "find", "ls", "bash", "edit", "write"]);
const READ_ONLY_TOOLS = new Set(["read", "grep", "find", "ls", "bash"]);
const TOOL_SEARCH = "search_tools";

type WorkflowCommand = "project-init" | "project-work" | "project-finish" | "project-handoff" | "project-audit";

const READ_ONLY_COMMANDS = new Set<WorkflowCommand>([
	"project-finish",
	"project-audit",
]);

function toolsFor(command?: WorkflowCommand): string[] {
	const builtins = command && READ_ONLY_COMMANDS.has(command) ? READ_ONLY_TOOLS : BUILTIN_TOOLS;
	return [...builtins, TOOL_SEARCH];
}

function searchTerms(query: string): string[] {
	const normalized = query.trim().toLowerCase();
	if (!normalized) return [];

	return [...new Set([normalized, ...normalized.split(/[^\p{L}\p{N}_-]+/u).filter((term) => term.length > 1)])];
}

function registerToolSearch(pi: ExtensionAPI) {
	pi.registerTool({
		name: TOOL_SEARCH,
		label: "Search Tools",
		description: "Search for and enable currently inactive tools relevant to the task",
		parameters: Type.Object({
			query: Type.String({ description: "Capability or task keywords; use tool names or English keywords when useful" }),
			limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 10 })),
		}),
		async execute(_toolCallId, params) {
			const terms = searchTerms(params.query);
			const matches = pi
				.getAllTools()
				.filter((tool) => !BUILTIN_TOOLS.has(tool.name) && tool.name !== TOOL_SEARCH)
				.map((tool) => {
					const haystack = `${tool.name} ${tool.description}`.toLowerCase();
					return {
						name: tool.name,
						description: tool.description,
						score: terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0),
					};
				})
				.filter((tool) => tool.score > 0)
				.sort((left, right) => right.score - left.score || left.name.localeCompare(right.name))
				.slice(0, params.limit ?? 5);

			if (matches.length === 0) {
				return {
					content: [{ type: "text", text: `No tools found for: ${params.query}` }],
					details: { matches: [], added: [] },
				};
			}

			const active = pi.getActiveTools();
			const added = matches.map((tool) => tool.name).filter((name) => !active.includes(name));
			pi.setActiveTools([...new Set([...active, ...added])]);

			return {
				content: [{
					type: "text",
					text: added.length > 0
						? `Loaded tools: ${added.join(", ")}`
						: `Matching tools already active: ${matches.map((tool) => tool.name).join(", ")}`,
				}],
				details: { matches, added },
			};
		},
	});
}

function registerWorkflowCommand(pi: ExtensionAPI, command: WorkflowCommand, description: string) {
	pi.registerCommand(command, {
		description,
		handler: async (args, ctx: ExtensionCommandContext) => {
			if (!ctx.isIdle()) {
				ctx.ui.notify("当前任务仍在运行，请完成后再切换工作流入口。", "warning");
				return;
			}

			pi.setActiveTools(toolsFor(command));
			const suffix = args.trim() ? ` ${args.trim()}` : "";
			pi.sendUserMessage(`/skill:${command}${suffix}`, { expandPromptTemplates: true });
		},
	});
}

export default function workflowExtension(pi: ExtensionAPI) {
	registerToolSearch(pi);
	pi.on("session_start", () => pi.setActiveTools(toolsFor()));

	registerWorkflowCommand(pi, "project-init", "建立或重建项目基线");
	registerWorkflowCommand(pi, "project-work", "按项目事实推进当前任务");
	registerWorkflowCommand(pi, "project-finish", "只读检查当前改动并准备提交信息");
	registerWorkflowCommand(pi, "project-handoff", "生成未完成工作的临时接力");
	registerWorkflowCommand(pi, "project-audit", "只读复盘项目状态与工作路径");
}
