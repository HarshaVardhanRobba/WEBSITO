import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { inngest } from "@/inngest/client";
import prisma from "../../../../lib/prisma";
import { generateSlug } from "random-word-slugs"
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({
    getOne: baseProcedure
    .input(z.object({
        id: z.string().min(1, {message: "Project Id REQUIRED"}).max(300, {message: "Project Id too long, make it short"})
    }
))
    .query(async({ input}) => {
        const Exisitngprojects = await prisma.project.findUnique({
            where: {
                id: input.id,
            },
        });
        if (!Exisitngprojects) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Project not found"});
        }
        return Exisitngprojects;
    }),getMany: baseProcedure
    .query(async() => {
        const projects = await prisma.project.findMany({
            orderBy: {
                updatedAt: "asc"
            },
        });
        return projects;
    }),
    create: baseProcedure
    .input(
        z.object({
            value: z.string()
            .min(1, { message: "Message cannot be empty" })
            .max(10000, { message: "Message cannot be longer than 10,000 characters" }),
        })
    )
    .mutation(async ({ input }) => {
        const createdProject = await prisma.project.create({
            data: {
                name: generateSlug(2, {
                    format: "kebab",
                }),
                messages: {
                    create: {
                        content: input.value,
                        role: "USER",
                        type: "RESULT"
                    }
                }
            }
        })

        await inngest.send({
            name: "code-agent/run",
            data: {
                value: input.value,
                projectId: createdProject.id,
            },
        });
        return createdProject;
    })
})