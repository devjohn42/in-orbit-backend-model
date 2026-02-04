import dayjs from 'dayjs'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../db'
import { goalCompletions, goals, users } from '../db/schema'

interface CreateGoalCompletionRequest {
	userId: string
	goalId: string
}

export const createGoalCompletion = async ({
	userId,
	goalId
}: CreateGoalCompletionRequest) => {
	const firstDayOfWeek = dayjs().startOf('week').toDate()
	const lastDayOfWeek = dayjs().endOf('week').toDate()

	const goalCompletionCounts = db.$with('goal_completion_counts').as(
		db
			.select({
				goalId: goalCompletions.goalId,
				completionCount: count(goalCompletions.id).as('completionCount')
			})
			.from(goalCompletions)
			.innerJoin(goals, eq(goals.id, goalCompletions.goalId))
			.where(
				and(
					gte(goalCompletions.createdAt, firstDayOfWeek),
					lte(goalCompletions.createdAt, lastDayOfWeek),
					eq(goalCompletions.goalId, goalId),
					eq(goals.userId, userId)
				)
			)
			.groupBy(goalCompletions.goalId)
	)

	const result = await db
		.with(goalCompletionCounts)
		.select({
			desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
			completionCount: sql /* sql */`
        COALESCE(${goalCompletionCounts.completionCount}, 0)
        `.mapWith(Number)
		})
		.from(goals)
		.leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
		.where(and(eq(goals.userId, userId), eq(goals.id, goalId)))
		.limit(1)

	const { completionCount, desiredWeeklyFrequency } = result[0]

	if (completionCount >= desiredWeeklyFrequency) {
		throw new Error('Goal already completed this week!')
	}

	const EXPERIENCE_EARNED_WHEN_COMPLETE_A_GOAL = 3
	const EXPERIENCE_EARNED_WHEN_COMPLETE_A_GOAL_FOR_LAST_TIME = 5

	const isLastCompletionFromGoal = completionCount + 1 === desiredWeeklyFrequency
	const earnedExperience = isLastCompletionFromGoal
		? EXPERIENCE_EARNED_WHEN_COMPLETE_A_GOAL_FOR_LAST_TIME
		: EXPERIENCE_EARNED_WHEN_COMPLETE_A_GOAL

	const goalCompletion = await db.transaction(async () => {
		const [goalCompletion] = await db
			.insert(goalCompletions)
			.values({ goalId })
			.returning()

		await db
			.update(users)
			.set({
				experience: sql /* sql */`${users.experience} + ${earnedExperience}`
			})
			.where(eq(users.id, userId))

		return goalCompletion
	})

	return { goalCompletion }
}
