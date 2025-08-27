import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

const createFlashcardSchema = z.object({
  workspaceId: z.string(),
  front: z.string().min(1, "Front content is required"),
  back: z.string().min(1, "Back content is required"),
});

const updateFlashcardSchema = z.object({
  id: z.string(),
  front: z.string().min(1, "Front content is required").optional(),
  back: z.string().min(1, "Back content is required").optional(),
});

export const flashcardsRouter = router({
  // Get all flashcards for a workspace
  list: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const flashcards = await ctx.db.flashcard.findMany({
        where: {
          workspaceId: input.workspaceId,
          workspace: {
            ownerId: ctx.session.user.id,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return flashcards;
    }),

  // Get a single flashcard
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const flashcard = await ctx.db.flashcard.findFirst({
        where: {
          id: input.id,
          workspace: {
            ownerId: ctx.session.user.id,
          },
        },
      });
      if (!flashcard) {
        throw new Error("Flashcard not found");
      }
      return flashcard;
    }),

  // Create a new flashcard
  create: protectedProcedure
    .input(createFlashcardSchema)
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

      const flashcard = await ctx.db.flashcard.create({
        data: {
          front: input.front,
          back: input.back,
          workspaceId: input.workspaceId,
        },
      });
      return flashcard;
    }),

  // Update a flashcard
  update: protectedProcedure
    .input(updateFlashcardSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      
      // Verify flashcard ownership
      const existingFlashcard = await ctx.db.flashcard.findFirst({
        where: {
          id,
          workspace: {
            ownerId: ctx.session.user.id,
          },
        },
      });
      if (!existingFlashcard) {
        throw new Error("Flashcard not found or access denied");
      }

      const flashcard = await ctx.db.flashcard.update({
        where: { id },
        data: updateData,
      });
      return flashcard;
    }),

  // Delete a flashcard
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify flashcard ownership
      const existingFlashcard = await ctx.db.flashcard.findFirst({
        where: {
          id: input.id,
          workspace: {
            ownerId: ctx.session.user.id,
          },
        },
      });
      if (!existingFlashcard) {
        throw new Error("Flashcard not found or access denied");
      }

      await ctx.db.flashcard.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  // Bulk delete flashcards
  bulkDelete: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      // Verify all flashcards belong to user
      const flashcards = await ctx.db.flashcard.findMany({
        where: {
          id: { in: input.ids },
          workspace: {
            ownerId: ctx.session.user.id,
          },
        },
      });
      
      if (flashcards.length !== input.ids.length) {
        throw new Error("Some flashcards not found or access denied");
      }

      await ctx.db.flashcard.deleteMany({
        where: {
          id: { in: input.ids },
        },
      });
      return { success: true, deletedCount: input.ids.length };
    }),
});
