import { Sandbox } from "@e2b/code-interpreter"
import { AgentResult, TextMessage } from "@inngest/agent-kit";

export async function getSandbox(sandboxId: string) {
    const sandbox = await Sandbox.connect(sandboxId);
    return sandbox;    
}

export function last_assistant_text_agent_content(result: AgentResult) {
    const last_assistant_text_agent_index = result.output.findLastIndex((message) => message.role === "assistant",
    );

    const message = result.output[last_assistant_text_agent_index] as TextMessage | undefined;

    return message?.content ? typeof message.content === "string" ? message.content : message.content.map((c) => c.text).join("\n") : undefined;
}