import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // imagine as download step
    await step.sleep("downloading", "30s");

    // imagine as processing step
    await step.sleep("processing", "10s");

    // imagine as summary step
    await step.sleep("summary", "5s");

    return { message: `Hello ${event.data.email}!` };
  },
);