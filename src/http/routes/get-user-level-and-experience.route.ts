import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { getUserLevelAndExperience } from '../../use-cases/get-user-level-and-experience'
import { authenticateUserHook } from '../hooks/authenticate-user'

export const getUserExperienceAndLevelRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		'/profile/gamification',
		{
			onRequest: [authenticateUserHook],
			schema: {
				tags: ['users', 'gamification'],
				description: 'Get user experience and level',
				response: {
					200: z.object({
						experience: z.number(),
						level: z.number(),
						experienceToNextLevel: z.number()
					})
				}
			}
		},
		async (request, reply) => {
			const userId = request.user.sub

			const { experience, level, experienceToNextLevel } =
				await getUserLevelAndExperience({
					userId
				})

			return reply.status(200).send({ experience, level, experienceToNextLevel })
		}
	)
}
