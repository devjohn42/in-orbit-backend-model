import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { authenticateFromGithubCode } from '../../use-cases/authenticate-from-github-code'

export const authenticateFromGithubRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		'/auth/github',
		{
			schema: {
				tags: ['auth'],
				description: 'Authenticate user from Github code',
				operationId: 'authenticateFromGithub',
				body: z.object({
					code: z.string()
				}),
				response: {
					201: z.object({ token: z.string() })
				}
			}
		},
		async (request, reply) => {
			const { code } = request.body

			const { token } = await authenticateFromGithubCode({
				code
			})

			console.log('Token gerado no backend:', token)

			return reply.status(201).send({ token })
		}
	)
}
