import { inngest } from "./client";
import { createAgent, gemini } from '@inngest/agent-kit';
import { serve } from "inngest/next"; // or your framework

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const summerizerAgent = createAgent({
      name: 'Summmerizer',
      system: 'You are an expert summarizer..',
      model: gemini({
        model: "gemini-2.0-flash",
        apiKey: process.env.GEMINI_API_KEY,
      }),
    });

    const prompt = `Write a summary about: ${event.data?.value}`;
    const { output } = await summerizerAgent.run(prompt);

    const lastMessage = output[output.length - 1];
    const summaryText = lastMessage?.type === 'text' ? lastMessage.content : '';

    return { summary: summaryText };
  }
);

// Serve with Inngest's serve, not createServer
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld],
});