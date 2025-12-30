import fastify from 'fastify'
import z from 'zod'
import { createGoal } from '../use-cases/create-goal'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { getWeekPendingGoals } from '../use-cases/get-week-pending-goals'
import { createGoalCompletion } from '../use-cases/create-goal-completion'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.post(
  '/goals',
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7),
      }),
    },
  },
  async (request) => {
    const { title, desiredWeeklyFrequency } = request.body

    await createGoal({
      title,
      desiredWeeklyFrequency,
    })
  },
)

app.post(
  '/goal-completions',
  {
    schema: {
      body: z.object({
        goalId: z.string(),
      }),
    },
  },
  async (request) => {
    const { goalId } = request.body

    await createGoalCompletion({ goalId })
  },
)

app.get('/pending-goals', async () => {
  const { pendingGoals } = await getWeekPendingGoals()

  return { pendingGoals }
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running 🚀')
  })
