import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db'
import { users } from '../db/schema'
import { getUser } from './get-user'
import { eq } from 'drizzle-orm'

describe('get user', () => {
  beforeEach(async () => {
    await db.delete(users).where(eq(users.id, 'john-doe'))
  })

  it('should be able to get a user', async () => {
    await db.insert(users).values({
     id: 'john-doe',
     avatarUrl: 'https://github.com/devjohn42.png',
     externalAccountId: 1234567654,
    })

    const result = await getUser({userId: 'john-doe'})

    expect(result).toEqual({
      user: {
        id: 'john-doe',
        name: null,
        email: null,
        avatarUrl: 'https://github.com/devjohn42.png',
      }
    })
  })
})