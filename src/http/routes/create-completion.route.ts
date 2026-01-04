import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { createGoalCompletion } from '../../use-cases/create-goal-completion'

export const createGoalCompletionRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		'/goal-completions',
		{
			schema: {
				body: z.object({
					goalId: z.string()
				})
			}
		},
		async (request) => {
			const { goalId } = request.body

			await createGoalCompletion({ goalId })
		}
	)
}
