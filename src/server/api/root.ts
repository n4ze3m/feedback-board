import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { projectRouter } from "./routers/project";
import { feedbackRouter } from "./routers/feedback";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
	example: exampleRouter,
	project: projectRouter,
	feedback: feedbackRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
