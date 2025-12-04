import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { inngest } from "@/inngest/client";
import prisma from "../../../../lib/prisma";
import { generateSlug } from "random-word-slugs"
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

export const projectRouter = createTRPCRouter({
    getOne: protectedProcedure
    .input(z.object({
        id: z.string().min(1, {message: "Project Id REQUIRED"}).max(300, {message: "Project Id too long, make it short"})
    }
))
    .query(async({ input, ctx}) => {
        const Exisitngprojects = await prisma.project.findUnique({
            where: {
                id: input.id,
                userId: ctx.auth.userId
            },
        });
        if (!Exisitngprojects) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Project not found"});
        }
        return Exisitngprojects;
    }),getMany: protectedProcedure
    .query(async({ ctx }) => {
        const projects = await prisma.project.findMany({
            where: {
                userId: ctx.auth.userId,
            },
            orderBy: {
                updatedAt: "asc"
            },
        });
        return projects;
    }),
    create: protectedProcedure
    .input(
        z.object({
            value: z.string()
            .min(1, { message: "Message cannot be empty" })
            .max(10000, { message: "Message cannot be longer than 10,000 characters" }),
        })
    )
    .mutation(async ({ input, ctx }) => {
        try {
            await consumeCredits();
        } catch (error) {
            if (error instanceof Error) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: error.message});
            } else {
                throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "you have run out of credits"});
            }
        }
        const createdProject = await prisma.project.create({
            data: {
                userId: ctx.auth.userId,
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