import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createGoalRoute } from './routes/create-goal.route'
import { createGoalCompletionRoute } from './routes/create-completion.route'
import { getPendingGoalsRoute } from './routes/get-pending-goals.route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createGoalRoute)
app.register(createGoalCompletionRoute)
app.register(getPendingGoalsRoute)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running 🚀')
  })
