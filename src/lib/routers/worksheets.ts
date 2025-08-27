import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

const createWorksheetSchema = z.object({
  workspaceId: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).default("Medium"),
  estimatedTime: z.string().optional(),
  problems: z.array(z.object({
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required"),
    type: z.enum(["multiple_choice", "text", "numeric"]).default("text"),
    options: z.array(z.string()).optional(), // for multiple choice
  })).optional(),
});

const updateWorksheetSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
  estimatedTime: z.string().optional(),
  problems: z.array(z.object({
    id: z.string().optional(), // for existing problems
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required"),
    type: z.enum(["multiple_choice", "text", "numeric"]).default("text"),
    options: z.array(z.string()).optional(),
  })).optional(),
});

export const worksheetsRouter = router({
  // Get all worksheets for a workspace
  list: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const worksheets = await ctx.db.worksheet.findMany({
        where: {
          workspaceId: input.workspaceId,
          workspace: {
            ownerId: ctx.session.user.id,
          },
        },
        include: {
          problems: {
            orderBy: {
              order: "asc",
            },
          },
          _count: {
            select: {
              problems: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      return worksheets;
    }),

  // Get a single worksheet with problems
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const worksheet = await ctx.db.worksheet.findFirst({
        where: {
          id: input.id,
          workspace: {
            ownerId: ctx.session.user.id,
          },
        },
        include: {
          problems: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });
      if (!worksheet) {
        throw new Error("Worksheet not found");
      }
      return worksheet;
    }),

  // Create a new worksheet
  create: protectedProcedure
    .input(createWorksheetSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify workspace ownership
      const workspace = await ctx.db.workspace.findFirst({
        where: {
          id: input.workspaceId,
          ownerId: ctx.session.user.id,
        },
      });
      if (!workspace) {
        throw new Error("Workspace not found or access denied");
      }

      const { problems, ...worksheetData } = input;

      const worksheet = await ctx.db.worksheet.create({
        data: {
          ...worksheetData,
          problems: problems ? {
            create: problems.map((problem, index) => ({
              ...problem,
              order: index,
            })),
          } : undefined,
        },
        include: {
          problems: true,
        },
      });
      return worksheet;
    }),

  // Update a worksheet
  update: protectedProcedure
    .input(updateWorksheetSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, problems, ...updateData } = input;
      
      // Verify worksheet ownership
      const existingWorksheet = await ctx.db.worksheet.findFirst({
        where: {
          id,
          workspace: {
            ownerId: ctx.session.user.id,
          },
        },
      });
      if (!existingWorksheet) {
        throw new Error("Worksheet not found or access denied");
      }

      // Handle problems update if provided
      if (problems) {
        // Delete existing problems and create new ones
        await ctx.db.worksheetProblem.deleteMany({
          where: { worksheetId: id },
        });

        await ctx.db.worksheetProblem.createMany({
          data: problems.map((problem, index) => ({
            ...problem,
            worksheetId: id,
            order: index,
          })),
        });
      }

      const worksheet = await ctx.db.worksheet.update({
        where: { id },
        data: updateData,
        include: {
          problems: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });
      return worksheet;
    }),

  // Delete a worksheet
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify worksheet ownership
      const existingWorksheet = await ctx.db.worksheet.findFirst({
        where: {
          id: input.id,
          workspace: {
            ownerId: ctx.session.user.id,
          },
        },
      });
      if (!existingWorksheet) {
        throw new Error("Worksheet not found or access denied");
      }

      // Delete problems first (due to foreign key constraint)
      await ctx.db.worksheetProblem.deleteMany({
        where: { worksheetId: input.id },
      });

      await ctx.db.worksheet.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  // Update problem completion status
  updateProblemStatus: protectedProcedure
    .input(z.object({
      problemId: z.string(),
      completed: z.boolean(),
      answer: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify problem ownership through worksheet
      const problem = await ctx.db.worksheetProblem.findFirst({
        where: {
          id: input.problemId,
          worksheet: {
            workspace: {
              ownerId: ctx.session.user.id,
            },
          },
        },
      });
      if (!problem) {
        throw new Error("Problem not found or access denied");
      }

      const updatedProblem = await ctx.db.worksheetProblem.update({
        where: { id: input.problemId },
        data: {
          completed: input.completed,
          userAnswer: input.answer,
          completedAt: input.completed ? new Date() : null,
        },
      });
      return updatedProblem;
    }),

  // Get worksheet progress
  getProgress: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const worksheet = await ctx.db.worksheet.findFirst({
        where: {
          id: input.id,
          workspace: {
            ownerId: ctx.session.user.id,
          },
        },
        include: {
          problems: {
            orderBy: {
              order: "asc",
            },
          },
          _count: {
            select: {
              problems: true,
            },
          },
        },
      });
      if (!worksheet) {
        throw new Error("Worksheet not found");
      }

      const completedProblems = worksheet.problems.filter(p => p.completed).length;
      const totalProblems = worksheet._count.problems;
      const progressPercentage = totalProblems > 0 ? (completedProblems / totalProblems) * 100 : 0;

      return {
        completedProblems,
        totalProblems,
        progressPercentage,
        problems: worksheet.problems,
      };
    }),
});
