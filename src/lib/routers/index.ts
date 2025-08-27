import { router } from "../trpc";
import { flashcardsRouter } from "./flashcards";

export const appRouter = router({
  flashcards: flashcardsRouter,
});

export type AppRouter = typeof appRouter;
