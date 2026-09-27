import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const projectData: Array<{
  name: string;
  userId: string;
  messages: {
    create: Array<{
      content: string;
      role: "USER" | "ASSISTANT";
      type: "RESULT" | "ERROR";
    }>;
  };
}> = [
  {
    name: "sample-project",
    userId: "seed-user",
    messages: {
      create: [
        {
          content: "Build a landing page",
          role: "USER",
          type: "RESULT",
        },
      ],
    },
  },
];

export async function main() {
  for (const p of projectData) {
    await prisma.project.create({ data: p });
  }
}

main();
