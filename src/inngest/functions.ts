import { inngest } from "./client";
import { createAgent, gemini } from '@inngest/agent-kit';
import { serve } from "inngest/next"; // or your framework
import { Sandbox } from "@e2b/code-interpreter"
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("Lovable1-nextjs-harsha");
      return sandbox.sandboxId
    })

    const codeAgent = createAgent({
      name: 'Code-agent',
      system: 'You are an expert Code agent and an Expert Next.js Developer. You write Readable and maintainable code with clear comments and you deliver it with Markdown. and at the end you explain that the code',
      model: gemini({
        model: "gemini-2.0-flash",
        apiKey: process.env.GEMINI_API_KEY,
      }),
    });

    const prompt = `Write a summary of your code: ${event.data?.value}`;
    const { output } = await codeAgent.run(prompt);

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const Host = sandbox.getHost(3000);
      return `https://${Host}`;
    })

    return { output, sandboxUrl };
  }
);

// Serve with Inngest's serve, not createServer
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld],
});