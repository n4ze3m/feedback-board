import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { sendNotification } from "../../utils/courier";

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
					comments: true,
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
				votes: feedback.upVotes - feedback.downVotes,
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
				include: {
					user: true,
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
					projectId: project.id,
					status: "In Review",
				},
			});

			if (inReview) {
				statusId = inReview.id;
			}

			const response = await ctx.prisma.feedbacks.create({
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

			if (project.isNotificationsEnabled) {
				await sendNotification({
					recipient: project.user.email,
					subject: `New feedback from ${
						input.user || input.email || "Anonymous"
					}`,
					message: `
					<h1>New feedback from ${input.user || input.email || "Anonymous"}</h1>
					<p>${input.message}</p>
					`,
					btnLink: `${process.env.NEXT_PUBLIC_APP_URL}/board/${project.publicId}/${response.id}`,
					btnText: "View feedback",
				});
			}

			return {
				message: "Feedback created",
			};
		}),

	vote: publicProcedure
		.input(
			z.object({
				publicId: z.string(),
				feedbackId: z.string(),
				type: z.string(),
				userId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const project = await ctx.prisma.project.findFirst({
				where: {
					publicId: input.publicId,
				},
				include: {
					user: true,
				},
			});

			if (!project) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Project not found",
				});
			}

			const feedback = await ctx.prisma.feedbacks.findFirst({
				where: {
					id: input.feedbackId,
					projectId: project.id,
				},
			});

			if (!feedback) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Feedback not found",
				});
			}

			// check if user has already voted
			const hasVoted = await ctx.prisma.feedbackVotes.findFirst({
				where: {
					feedbackId: input.feedbackId,
					clientId: input.userId,
				},
			});

			if (hasVoted) {
				await ctx.prisma.feedbackVotes.delete({
					where: {
						id: hasVoted.id,
					},
				});

				if (hasVoted.voteType === "up") {
					await ctx.prisma.feedbacks.update({
						where: {
							id: input.feedbackId,
						},
						data: {
							upVotes: {
								decrement: 1,
							},
						},
					});
				} else {
					await ctx.prisma.feedbacks.update({
						where: {
							id: input.feedbackId,
						},
						data: {
							downVotes: {
								decrement: 1,
							},
						},
					});
				}

				return {
					message: "Vote deleted",
				};
			}

			if (input.type === "up") {
				await ctx.prisma.feedbackVotes.create({
					data: {
						feedbackId: input.feedbackId,
						clientId: input.userId,
						voteType: "up",
					},
				});

				await ctx.prisma.feedbacks.update({
					where: {
						id: input.feedbackId,
					},
					data: {
						upVotes: {
							increment: 1,
						},
					},
				});
			} else if (input.type === "down") {
				await ctx.prisma.feedbackVotes.create({
					data: {
						feedbackId: input.feedbackId,
						clientId: input.userId,
						voteType: "down",
					},
				});

				await ctx.prisma.feedbacks.update({
					where: {
						id: input.feedbackId,
					},
					data: {
						downVotes: {
							increment: 1,
						},
					},
				});
			}

			return {
				message: "Vote created",
			};
		}),

	getSingleFeedbackPublic: publicProcedure
		.input(
			z.object({
				publicId: z.string(),
				feedbackId: z.string(),
			}),
		)
		.query(async ({ input, ctx }) => {
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

			const feedback = await ctx.prisma.feedbacks.findFirst({
				where: {
					id: input.feedbackId,
					projectId: project.id,
				},
				include: {
					status: true,
					type: true,
					comments: true,
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
				email: undefined,
				votes: feedback.upVotes - feedback.downVotes,
			};
		}),

	createPublicComment: publicProcedure
		.input(
			z.object({
				publicId: z.string(),
				feedbackId: z.string(),
				message: z.string(),
				user: z.string().nullable(),
				email: z.string().nullable(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const project = await ctx.prisma.project.findFirst({
				where: {
					publicId: input.publicId,
				},
				include: {
					user: true,
				},
			});

			if (!project) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Project not found",
				});
			}

			const feedback = await ctx.prisma.feedbacks.findFirst({
				where: {
					id: input.feedbackId,
					projectId: project.id,
				},
			});

			if (!feedback) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Feedback not found",
				});
			}

			await ctx.prisma.feedbackComment.create({
				data: {
					message: input.message,
					feedbackId: feedback.id,
					email: input.email,
					name: input.user,
				},
			});

			if (project.isNotificationsEnabled) {
				await sendNotification({
					recipient: project.user.email,
					subject: "Someone commented on one of your feedbacks",
					message: `## ${input.user || input.email || "Anonymous"} left a comment on your feedback
					${input.message}
					`,
					btnLink: `${process.env.APP_URL}/board/${project.publicId}/${feedback.id}`,
					btnText: "View feedback",
				});
			}

			return {
				message: "Comment created",
			};
		}),

	createAdminComment: publicProcedure
		.input(
			z.object({
				publicId: z.string(),
				feedbackId: z.string(),
				message: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.user) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "Unauthorized",
				});
			}

			const project = await ctx.prisma.project.findFirst({
				where: {
					id: input.publicId,
				},
			});

			if (!project) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Project not found",
				});
			}

			const feedback = await ctx.prisma.feedbacks.findFirst({
				where: {
					id: input.feedbackId,
					projectId: project.id,
				},
			});

			if (!feedback) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Feedback not found",
				});
			}

			await ctx.prisma.feedbackComment.create({
				data: {
					message: input.message,
					feedbackId: feedback.id,
					email: ctx.user.email,
					name: "Admin",
					isAdmin: true,
				},
			});

			return {
				message: "Comment created",
			};
		}),
});
