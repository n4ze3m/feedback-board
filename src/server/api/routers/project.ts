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
];

const DEFAULT_TAGS = [
	{
		name: "general",
		emoji: "📝",
	},
	{
		name: "Bug",
		emoji: "🐛",
	},
	{
		name: "Feature",
		emoji: "🎉",
	},
	{
		name: "Design",
		emoji: "🎨",
	},
	{
		name: "Question",
		emoji: "❓",
	},
	{
		name: "Enhancement",
		emoji: "🔨",
	},
	{
		name: "Accessibility",
		emoji: "♿️",
	},
	{
		name: "Performance",
		emoji: "🚀",
	},
	{
		name: "Security",
		emoji: "🔒",
	},
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
						name: tag.name,
						emoji: tag.emoji,
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
					feedbacks: true,
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
});
