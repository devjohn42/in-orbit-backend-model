import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { getUser } from '../../use-cases/get-user'

export const getProfile: FastifyPluginAsyncZod = async (app) => {
	app.get(
		'/profile',
		{
			schema: {
				tags: ['auth'],
				description: 'Get authenticated user profile',
				operationId: 'getProfile',
				response: {
					200: z.object({
						profile: z.object({
							id: z.string(),
							name: z.string().nullable(),
							email: z.email().nullable(),
							avatarUrl: z.url()
						})
					})
				}
			}
		},
		async (request, reply) => {
			const userId = request.user.sub

			const { user } = await getUser({
				userId
			})

			return reply.status(200).send({ profile: user })
		}
	)
}
