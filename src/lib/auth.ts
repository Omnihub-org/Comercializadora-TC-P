import 'server-only'

import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import { db } from './db'
import { Lucia, Session, User } from 'lucia'
import { User as DatabaseUser } from '@prisma/client'
import { cache } from 'react'
import { cookies } from 'next/headers'

export const adapter = new PrismaAdapter(db.session, db.user)

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === 'production',
		},
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
		}
	},
})

export const validateRequest = cache(async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
	const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null

	if (!sessionId) {
		return {
			user: null,
			session: null,
		}
	}

	const result = await lucia.validateSession(sessionId)
	// next.js throws when you attempt to set cookie when rendering page
	try {
		if (result.session && result.session.fresh) {
			const sessionCookie = lucia.createSessionCookie(result.session.id)
			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
		}
		if (!result.session) {
			const sessionCookie = lucia.createBlankSessionCookie()
			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
		}
	} catch {}
	return result
})

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: Omit<DatabaseUser, 'id'>
	}
}
