import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'
import {
	calculateLevelFromExperience,
	calculateTotalExperienceForLevel
} from '../modules/gamification'

interface GetUserLevelAndExperienceRequest {
	userId: string
}

export const getUserLevelAndExperience = async ({
	userId
}: GetUserLevelAndExperienceRequest) => {
	const [{ experience }] = await db
		.select({
			experience: users.experience
		})
		.from(users)
		.where(eq(users.id, userId))

	const level = calculateLevelFromExperience(experience)
	const experienceToNextLevel = calculateTotalExperienceForLevel(level)

	return {
		experience,
		level,
		experienceToNextLevel
	}
}
