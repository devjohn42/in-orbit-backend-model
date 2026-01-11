import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { createGoal } from '../../use-cases/create-goal'

export const createGoalRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		'/goals',
		{
			schema: {
				tags: ['goals'],
				description: 'Create a goal',
				body: z.object({
					title: z.string(),
					desiredWeeklyFrequency: z.number().int().min(1).max(7)
				}),
				response: {
					200: z.null()
				}
			}
		},
		async (request, reply) => {
			const { title, desiredWeeklyFrequency } = request.body

			await createGoal({
				title,
				desiredWeeklyFrequency
			})

			return reply.status(200).send()
		}
	)
}
