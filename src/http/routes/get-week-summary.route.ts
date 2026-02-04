import dayjs from 'dayjs'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getWeekSummary } from '../../use-cases/get-week-summary'
import { authenticateUserHook } from '../hooks/authenticate-user'

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		'/summary',
		{
			onRequest: [authenticateUserHook],
			schema: {
				tags: ['goals'],
				description: 'Get week summary',
				operationId: 'getWeekSummary',
				querystring: z.object({
					weekStartAt: z.coerce
						.date()
						.optional()
						.default(dayjs().startOf('week').toDate())
				}),
				response: {
					200: z.object({
						summary: z.object({
							completed: z.number(),
							total: z.number(),
							goalsPerDay: z.record(
								z.string(),
								z.array(
									z.object({
										id: z.string(),
										title: z.string(),
										completedAt: z.string()
									})
								)
							)
						})
					})
				}
			}
		},
		async (request) => {
			const userId = request.user.sub
			const { weekStartAt } = request.query

			const { summary } = await getWeekSummary({
				userId,
				weekStartAt
			})

			return { summary }
		}
	)
}
