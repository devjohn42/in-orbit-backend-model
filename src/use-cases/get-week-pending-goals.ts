import dayjs from 'dayjs'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'

interface GetWeekPendingGoalsRequest {
	userId: string
}

export const getWeekPendingGoals = async ({ userId }: GetWeekPendingGoalsRequest) => {
	const firstDayOfWeek = dayjs().startOf('week').toDate()
	const lastDayOfWeek = dayjs().endOf('week').toDate()

	const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
		db
			.select({
				id: goals.id,
				title: goals.title,
				desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
				createdAt: goals.createdAt
			})
			.from(goals)
			.where(and(lte(goals.createdAt, lastDayOfWeek), eq(goals.userId, userId)))
	)

	const goalsCompletionCounts = db.$with('goal_completion_counts').as(
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
					eq(goals.userId, userId)
				)
			)
			.groupBy(goalCompletions.goalId)
	)

	const pendingGoals = await db
		.with(goalsCreatedUpToWeek, goalsCompletionCounts)
		.select({
			id: goalsCreatedUpToWeek.id,
			title: goalsCreatedUpToWeek.title,
			desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
			completionCount: sql /* sql */`
        COALESCE(${goalsCompletionCounts.completionCount}, 0)
      `.mapWith(Number)
		})
		.from(goalsCreatedUpToWeek)
		.leftJoin(
			goalsCompletionCounts,
			eq(goalsCompletionCounts.goalId, goalsCreatedUpToWeek.id)
		)

	return {
		pendingGoals
	}
}
