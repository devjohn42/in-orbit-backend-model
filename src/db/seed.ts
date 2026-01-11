// Cadastros mockados para popular o db com dados fictícios

import dayjs from 'dayjs'
import { client, db } from '.'
import { goalCompletions, goals, users } from './schema'

async function seed() {
	await db.delete(goalCompletions)
	await db.delete(goals)

	const [user] = await db
		.insert(users)
		.values({
			name: 'John Doe',
			externalAccountId: 1289,
			avatarUrl: 'https://github.com/devjohn42.png'
		})
		.returning()

	const result = await db
		.insert(goals)
		.values([
			{ userId: user.id, title: 'Acordar cedo', desiredWeeklyFrequency: 5 },
			{ userId: user.id, title: 'Me exercitar', desiredWeeklyFrequency: 3 },
			{ userId: user.id, title: 'Estudar Programação', desiredWeeklyFrequency: 7 }
		])
		.returning()

	const startOfWeek = dayjs().startOf('week')

	await db.insert(goalCompletions).values([
		{ goalId: result[1].id, createdAt: startOfWeek.toDate() },
		{ goalId: result[2].id, createdAt: startOfWeek.add(1, 'day').toDate() }
	])
}

seed().finally(() => {
	client.end()
})
