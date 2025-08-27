import { router } from "../trpc";
import { flashcardsRouter } from "./flashcards";
import { worksheetsRouter } from "./worksheets";

export const appRouter = router({
  flashcards: flashcardsRouter,
  worksheets: worksheetsRouter,
});

export type AppRouter = typeof appRouter;
