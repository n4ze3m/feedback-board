import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const feedbackRouter = createTRPCRouter({
	create: publicProcedure
		.input(
			z.object({
				name: z.string(),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.user) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You must be logged in to create a project",
				});
			}

			return;
		}),

	getFeedbackById: publicProcedure
		.input(
			z.object({
				projectId: z.string(),
				feedbackId: z.string(),
			}),
		)
		.query(async ({ input, ctx }) => {
			if (!ctx.user) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You must be logged in to create a project",
				});
			}

			const isUserInProject = await ctx.prisma.project.findFirst({
				where: {
					id: input.projectId,
					userId: ctx.user.id,
				},
				include: {
					status: true,
				},
			});

			if (!isUserInProject) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You must be logged in to create a project",
				});
			}

			const feedback = await ctx.prisma.feedbacks.findFirst({
				where: {
					id: input.feedbackId,
					projectId: input.projectId,
				},
				include: {
					status: true,
					type: true,
				},
			});

			if (!feedback) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Feedback not found",
				});
			}

			return {
				...feedback,
				project_status: isUserInProject.status,
			};
		}),

	changeStatus: publicProcedure
		.input(
			z.object({
				projectId: z.string(),
				feedbackId: z.string(),
				status: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.user) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You must be logged in to create a project",
				});
			}
			const isUserInProject = await ctx.prisma.project.findFirst({
				where: {
					id: input.projectId,
					userId: ctx.user.id,
				},
				include: {
					status: true,
				},
			});

			if (!isUserInProject) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You must be logged in to create a project",
				});
			}

			const feedback = await ctx.prisma.feedbacks.findFirst({
				where: {
					id: input.feedbackId,
					projectId: input.projectId,
				},
			});

			if (!feedback) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Feedback not found",
				});
			}

			await ctx.prisma.feedbacks.update({
				where: {
					id: input.feedbackId,
				},
				data: {
					statusId: input.status,
				},
			});

			return {
				message: "Status updated",
			};
		}),

	getPubicFeedback: publicProcedure
		.input(
			z.object({
				publicId: z.string(),
			}),
		)
		.query(async ({ input, ctx }) => {
			const project = await ctx.prisma.project.findFirst({
				where: {
					publicId: input.publicId,
				},
				include: {
					feedbackTypes: true,
				},
			});

			if (!project) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Project not found",
				});
			}

			const feedbacks = await ctx.prisma.feedbacks.findMany({
				where: {
					projectId: project.id,
				},
				include: {
					status: true,
					type: true,
				},
			});

			return {
				feedbacks: feedbacks.map((feedback) => ({
					...feedback,
					email: undefined,
					votes: feedback.upVotes - feedback.downVotes,
				})),
				types: project.feedbackTypes,
				settings: {
					allowVotes: project.isUpVotesEnabled,
				},
			};
		}),

	createPublicFeedback: publicProcedure
		.input(
			z.object({
				publicId: z.string(),
				title: z.string(),
				message: z.string(),
				type: z.string(),
				user: z.string().nullable(),
				email: z.string().nullable(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const project = await ctx.prisma.project.findFirst({
				where: {
					publicId: input.publicId,
				},
			});

			if (!project) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Project not found",
				});
			}

			let statusId = null;

			const inReview = await ctx.prisma.feedbackStatus.findFirst({
				where: {
					projectId: input.publicId,
					status: "In Review",
				},
			});

			if (inReview) {
				statusId = inReview.id;
			}

			await ctx.prisma.feedbacks.create({
				data: {
					title: input.title,
					message: input.message,
					projectId: project.id,
					typeId: input.type,
					statusId: statusId,
					email: input.email,
					name: input.user,
				},
			});

			return {
				message: "Feedback created",
			};
		}),
});
