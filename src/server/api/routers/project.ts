import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import slugify from "slugify";

const DEFAULT_STATUS = [
	"In Progress",
	"Completed",
	"Duplicate",
	"Rejected",
	"Planned",
	"In Review",
];

const DEFAULT_TAGS = [
	"General 📝",
	"Bug 🐛",
	"Feature 🚀",
	"Design 🎨",
	"Performance 🚀",
	"Accessibility 🦾",
	"Security 🔒",
];

export const projectRouter = createTRPCRouter({
	create: publicProcedure
		.input(
			z.object({
				name: z.string(),
				description: z.string().optional(),
				username: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.user) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You must be logged in to create a project",
				});
			}

			let slug = "";

			if (input.username && input.username.length > 0) {
				const isUsernameAvailable = await ctx.prisma.project.findUnique({
					where: {
						publicId: input.username,
					},
				});

				if (isUsernameAvailable) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "This username is already taken",
					});
				} else {
					slug = slugify(input.username, {
						replacement: "-",
						remove: /[*+~.()'"!:@]/g,
						lower: true,
					});
				}
			} else {
				const timestamp = new Date().getTime();
				slug = slugify(`${input.name} ${timestamp}`, {
					replacement: "-",
					remove: /[*+~.()'"!:@]/g,
					lower: true,
				});
			}

			const project = await ctx.prisma.project.create({
				data: {
					name: input.name,
					description: input.description,
					publicId: slug,
					userId: ctx.user.id,
				},
			});

			for (const status of DEFAULT_STATUS) {
				await ctx.prisma.feedbackStatus.create({
					data: {
						projectId: project.id,
						status: status,
					},
				});
			}

			for (const tag of DEFAULT_TAGS) {
				await ctx.prisma.feedbackTypes.create({
					data: {
						projectId: project.id,
						name: tag,
					},
				});
			}

			return {
				message: "Project created successfully",
				id: project.id,
			};
		}),
	getAll: publicProcedure.query(async ({ ctx }) => {
		if (!ctx.user) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "You must be logged in to create a project",
			});
		}
		const projects = await ctx.prisma.project.findMany({
			where: {
				userId: ctx.user.id,
			},
		});
		return projects;
	}),
	getOne: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			if (!ctx.user) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You must be logged in to create a project",
				});
			}
			const project = await ctx.prisma.project.findFirst({
				where: {
					id: input.id,
					userId: ctx.user.id,
				},
				include: {
					feedbacks: {
						include: {
							type: true,
							status: true,
						},
					},
					status: true,
					feedbackTypes: true,
				},
			});

			if (!project) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Project not found",
				});
			}

			return project;
		}),

	createAdminFeedback: publicProcedure
		.input(
			z.object({
				projectId: z.string(),
				title: z.string(),
				content: z.string(),
				type: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (!ctx.user) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You must be logged in to create a project",
				});
			}

			const isProjectOwner = await ctx.prisma.project.findFirst({
				where: {
					id: input.projectId,
					userId: ctx.user.id,
				},
			});

			if (!isProjectOwner) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You must be the owner of this project",
				});
			}

			let statusId = null;

			const inReview = await ctx.prisma.feedbackStatus.findFirst({
				where: {
					projectId: input.projectId,
					status: "In Review",
				},
			});

			if (inReview) {
				statusId = inReview.id;
			}

			await ctx.prisma.feedbacks.create({
				data: {
					title: input.title,
					message: input.content,
					projectId: input.projectId,
					typeId: input.type,
					email: ctx.user.email,
					statusId: statusId,
				},
			});

			return {
				message: "Feedback created successfully",
			};
		}),

	addLabelAndStatus: publicProcedure
		.input(
			z.object({
				projectId: z.string(),
				name: z.string(),
				type: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (!ctx.user) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You must be logged in to create a project",
				});
			}
			const project = await ctx.prisma.project.findFirst({
				where: {
					id: input.projectId,
					userId: ctx.user.id,
				},
			});

			if (!project) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Project not found",
				});
			}

			if (input.type === "label") {
				await ctx.prisma.feedbackTypes.create({
					data: {
						projectId: input.projectId,
						name: input.name,
					},
				});
			} else if (input.type === "status") {
				await ctx.prisma.feedbackStatus.create({
					data: {
						projectId: input.projectId,
						status: input.name,
					},
				});
			}

			return {
				message: "Label or status added successfully",
			};
		}),

	updateLabelAndStatus: publicProcedure
		.input(
			z.object({
				projectId: z.string(),
				id: z.string(),
				name: z.string(),
				type: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (!ctx.user) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You must be logged in to create a project",
				});
			}
			const project = await ctx.prisma.project.findFirst({
				where: {
					id: input.projectId,
					userId: ctx.user.id,
				},
			});

			if (!project) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Project not found",
				});
			}

			if (input.type === "label") {
				await ctx.prisma.feedbackTypes.update({
					where: {
						id: input.id,
					},
					data: {
						name: input.name,
					},
				});
			} else if (input.type === "status") {
				await ctx.prisma.feedbackStatus.update({
					where: {
						id: input.id,
					},
					data: {
						status: input.name,
					},
				});
			}

			return {
				message: "Label or status updated successfully",
			};
		}),
});
