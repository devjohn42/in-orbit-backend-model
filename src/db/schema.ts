import { timestamp, integer, text, pgTable } from 'drizzle-orm/pg-core'

export const goals = pgTable('goals', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  desiredWeeklyFrequency: integer('desired_weekly_frenquency').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
