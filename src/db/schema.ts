import { createId } from '@paralleldrive/cuid2'
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
	id: text('id')
		.primaryKey()
		.$default(() => createId()),
	name: text('name'),
	email: text('email'),
	avatarUrl: text('avatar_url').notNull(),
	experience: integer('experience').notNull().default(0),
	externalAccountId: integer('exteral_account_id').notNull().unique()
})

export const goals = pgTable('goals', {
	id: text('id')
		.primaryKey()
		.$default(() => createId()),
	userId: text('gold_id')
		.references(() => users.id)
		.notNull(),
	title: text('title').notNull(),
	desiredWeeklyFrequency: integer('desired_weekly_frenquency').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
})

export const goalCompletions = pgTable('goal_completions', {
	id: text('id')
		.primaryKey()
		.$default(() => createId()),
	goalId: text('gold_id')
		.references(() => goals.id)
		.notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
})
