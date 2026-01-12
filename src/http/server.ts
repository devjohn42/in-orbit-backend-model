import { fastifyCors } from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { authenticateFromGithubRoute } from './routes/authenticate-from-github.route'
import { createGoalCompletionRoute } from './routes/create-completion.route'
import { createGoalRoute } from './routes/create-goal.route'
import { getPendingGoalsRoute } from './routes/get-pending-goals.route'
import { getWeekSummaryRoute } from './routes/get-summary.route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
	origin: '*'
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'In Orbit',
			version: '1.0.0'
		}
	},
	transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
	routePrefix: '/docs'
})

app.register(createGoalRoute)
app.register(createGoalCompletionRoute)
app.register(getPendingGoalsRoute)
app.register(getWeekSummaryRoute)
app.register(authenticateFromGithubRoute)

app
	.listen({
		port: 3333
	})
	.then(() => {
		console.log('HTTP Server Running 🚀')
	})
