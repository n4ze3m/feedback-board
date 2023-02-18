import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import slugify from "slugify";

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
		return projects
	}),
});
