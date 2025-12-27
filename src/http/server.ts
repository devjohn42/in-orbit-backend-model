import fastify from 'fastify'
import z from 'zod'
import { createGoal } from '../use-cases/create-goal'

const app = fastify()

app.post('/goals', async (request) => {
  const createGoalBodySchema = z.object({
    title: z.string(),
    desiredWeeklyFrequency: z.number().int().min(1).max(7),
  })

  const body = createGoalBodySchema.parse(request.body)

  await createGoal({
    title: body.title,
    desiredWeeklyFrequency: body.desiredWeeklyFrequency,
  })
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running 🚀')
  })
