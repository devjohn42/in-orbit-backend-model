import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { makeGoal } from '../../tests/factories/make-goal'
import { makeGoalCompletion } from '../../tests/factories/make-goal-completion'
import { makeUser } from '../../tests/factories/make-user'
import { getWeekSummary } from './get-week-summary'

describe('get week pending goals', () => {
	it('should be able to get week pending goals', async () => {
		const user = await makeUser()
		const weekStartAt = dayjs(new Date(2026, 0, 18))
			.startOf('week')
			.toDate()

		const goal1 = await makeGoal({
			userId: user.id,
			title: 'Meditar',
			desiredWeeklyFrequency: 3,
			createdAt: weekStartAt
		})
		const goal2 = await makeGoal({
			userId: user.id,
			title: 'Nadar',
			desiredWeeklyFrequency: 1,
			createdAt: weekStartAt
		})
		const goal3 = await makeGoal({
			userId: user.id,
			title: 'Ler um livro',
			desiredWeeklyFrequency: 6,
			createdAt: weekStartAt
		})

		await makeGoalCompletion({
			goalId: goal1.id,
			createdAt: dayjs(weekStartAt).add(2, 'days').toDate()
		})
		await makeGoalCompletion({
			goalId: goal2.id,
			createdAt: dayjs(weekStartAt).add(2, 'days').toDate()
		})
		await makeGoalCompletion({
			goalId: goal3.id,
			createdAt: dayjs(weekStartAt).add(3, 'days').toDate()
		})
		await makeGoalCompletion({
			goalId: goal3.id,
			createdAt: dayjs(weekStartAt).add(6, 'days').toDate()
		})

		const result = await getWeekSummary({
			userId: user.id,
			weekStartAt
		})

		expect(result).toEqual({
			summary: {
				completed: 4,
				total: 10,
				goalsPerDay: {
					'2026-01-24': expect.arrayContaining([
						expect.objectContaining({ title: 'Ler um livro' })
					]),
					'2026-01-21': expect.arrayContaining([
						expect.objectContaining({ title: 'Ler um livro' })
					]),
					'2026-01-20': expect.arrayContaining([
						expect.objectContaining({ title: 'Meditar' }),
						expect.objectContaining({ title: 'Nadar' })
					])
				}
			}
		})
	})
})
