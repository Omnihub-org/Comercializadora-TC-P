'use server'

import { lucia } from '@/lib/auth'
import { db } from '@/lib/db'
import { verify, hash, Options as ArgonOptions } from '@node-rs/argon2'
import { loginSchema } from '@/schemas/auth'
import { createServerAction } from 'zsa'
import { generateId } from 'lucia'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { adminCredentials } from '@/lib/admin'

const argonOptions: ArgonOptions = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1,
}

const authErrorMessage = 'Invalid username or password'

export async function loginAction(_: any, formData: FormData) {
	const username = formData.get('username')
	const password = formData.get('password')

	if (username !== adminCredentials.username || password !== adminCredentials.password) {
		return { error: authErrorMessage }
	}

	const user = await db.user.upsert({
		create: {
			id: generateId(15),
			username: adminCredentials.username,
			password_hash: await hash(adminCredentials.password, argonOptions),
		},
		where: { username: adminCredentials.username },
		update: {},
	})

	const validPassword = await verify(user.password_hash, password, argonOptions)

	if (!validPassword) {
		return { error: authErrorMessage }
	}

	const session = await lucia.createSession(user.id, {})
	const sessionCookie = lucia.createSessionCookie(session.id)
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

	return redirect('/admin/leads/LOAN')
}

// export const loginAction = createServerAction()
// 	.input(loginSchema)
// 	.handler(async ({ input }) => {
// 		if (input.username !== adminCredentials.username || input.password !== adminCredentials.password) {
// 			throw authErrorMessage
// 		}

// const user = await db.user.upsert({
// 	create: {
// 		id: generateId(15),
// 		username: adminCredentials.username,
// 		password_hash: await hash(adminCredentials.password, argonOptions),
// 	},
// 	where: { username: adminCredentials.username },
// 	update: {},
// })

// const validPassword = await verify(user.password_hash, input.password, argonOptions)

// if (!validPassword) {
// 	throw authErrorMessage
// }

// const session = await lucia.createSession(user.id, {})
// const sessionCookie = lucia.createSessionCookie(session.id)
// cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

// return redirect('/admin')
// 	})
