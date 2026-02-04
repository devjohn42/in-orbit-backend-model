import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fastifyCors } from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { env } from '../env'
import { authenticateFromGithubRoute } from './routes/authenticate-from-github.route'
import { createGoalCompletionRoute } from './routes/create-completion.route'
import { createGoalRoute } from './routes/create-goal.route'
import { getPendingGoalsRoute } from './routes/get-pending-goals.route'
import { getProfile } from './routes/get-profile.route'
import { getUserExperienceAndLevelRoute } from './routes/get-user-experience-and-level.route'
import { getWeekSummaryRoute } from './routes/get-week-summary.route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
	origin: '*'
})

app.register(fastifyJwt, {
	secret: env.JWT_SECRET
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
app.register(getProfile)
app.register(getUserExperienceAndLevelRoute)

app
	.listen({
		port: 3333
	})
	.then(() => {
		console.log('HTTP Server Running 🚀')
	})

if (env.NODE_ENV === 'development') {
	const specFile = resolve(__dirname, '../../swagger.json')

	app.ready().then(() => {
		const spec = JSON.stringify(app.swagger(), null, 2)

		writeFile(specFile, spec).then(() => {
			console.log('Swagger spec generated!')
		})
	})
}
