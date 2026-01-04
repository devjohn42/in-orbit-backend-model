import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider
} from 'fastify-type-provider-zod'
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

app.register(createGoalRoute)
app.register(createGoalCompletionRoute)
app.register(getPendingGoalsRoute)
app.register(getWeekSummaryRoute)

app
	.listen({
		port: 3333
	})
	.then(() => {
		console.log('HTTP Server Running 🚀')
	})
