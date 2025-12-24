// Cadastros mockados para popular o db com dados fictícios

import { client, db } from '.'
import { goalCompletios, goals } from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalCompletios)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      { title: 'Acordar cedo', desiredWeeklyFrequency: 5 },
      { title: 'Me exercitar', desiredWeeklyFrequency: 3 },
      { title: 'Estudar Programação', desiredWeeklyFrequency: 7 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletios).values([
    { goalId: result[1].id, createdAt: startOfWeek.toDate() },
    { goalId: result[2].id, createdAt: startOfWeek.add(1, 'day').toDate() },
  ])
}

seed().finally(() => {
  client.end()
})
