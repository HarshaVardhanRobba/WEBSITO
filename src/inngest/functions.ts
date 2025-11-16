import { inngest } from "./client";
import { createAgent, createNetwork, createTool, gemini, type Tool } from '@inngest/agent-kit';
import { serve } from "inngest/next"; // or your framework
import { Sandbox } from "@e2b/code-interpreter"
import { getSandbox, last_assistant_text_agent_content } from "./utils";
import z from "zod";
import { PROMPT } from "@/prompt";
import prisma from "../../lib/prisma";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const codeagentFuntion = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("Lovable1-nextjs-harsha");
      return sandbox.sandboxId
    })

    const codeAgent = createAgent<AgentState>({
      name: 'Code-agent',
      description: 'Code-agent',
      system: PROMPT,
      model: gemini({
        model: "gemini-2.0-flash",
        apiKey: process.env.GEMINI_API_KEY,
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "use terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = {stdout: "", stderr: ""};

              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  }
                  });
                  return result.stdout;
              } catch (error) {
                return `CommandError: ${error} \n stdout: ${buffers.stdout} \n stderr: ${buffers.stderr}`;
              }
            });
          },
        }),
        createTool({
            name: "createorUpdateFiles",
            description: "Create or update files",
            parameters: z.object({
              files: z.array(
                z.object({
                  path: z.string(),
                  content: z.string(),
                }),
              ),
            }),
            handler: async (
              { files },
              { step, network }: Tool.Options<AgentState>
            ) => {
              const newfiles = await step?.run("CreateorUpdateFiles", async () => {
                try {
                  const updatedFiles = network.state.data.files || {};
                  const sandbox = await getSandbox(sandboxId);
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }
                  return updatedFiles;
                } catch (error) {
                  throw new Error(`FileError: ${error}`);
                }
              });
              if (typeof newfiles === "object") {
                network.state.data.files = newfiles;
              }
            }
          }),
          createTool({
            name: "readfiles",
            description: "Read files form sandbox",
            parameters: z.object({
              files: z.array(z.string()),
            }),
            handler: async ({ files }, { step }) => {
              return await step?.run("readfiles", async () => {
                try {
                  const sandbox = await getSandbox(sandboxId);
                  const contents = [];
                  for (const file of files) {
                    const content = await sandbox.files.read(file);
                    contents.push({ path: file, content });
                  }
                  return JSON.stringify(contents);
                } catch (error) {
                  return `FileReadingError: ${error}`;
                }
               })
            }
          })
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const last_assistant_Message_Text = last_assistant_text_agent_content(result);

          if(last_assistant_Message_Text && network) {
            if(last_assistant_Message_Text.includes("task_summary>")) {
              network.state.data.summary = last_assistant_Message_Text;
            }
          }
          return result;
        },
      }
    });

    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 20,
      router: async ({ network}) => {
        const summary = network.state.data.summary;

        if(summary) {
          return;
        }
        return codeAgent;
      }
    })

    const result = await network.run(event.data.value);

    const isError = !result.state.data.summary || 
      Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const Host = sandbox.getHost(3000);
      return `https://${Host}`;
    });

    await step.run("save-result", async () => {
      if(isError) {
        return await prisma.message.create({
          data: {
            content: "As error occurred bro, try again",
            role: "ASSISTANT",
            type: "ERROR",
          }
        })
      }
      return await prisma.message.create({
        data: {
          content: result.state.data.summary,
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: "fragment",
              files: result.state.data.files,
            },
          },
        },
      })
    })

    return { 
      url: sandboxUrl,
    title: "Fragment",
    files: result.state.data.files,
    summary: network.state.data.summary,
   };
  }
);

// Serve with Inngest's serve, not createServer
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [codeagentFuntion],
});