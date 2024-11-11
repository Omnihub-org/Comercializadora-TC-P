'use client'

import { loginAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFormState } from 'react-dom'

export function LoginForm() {
	const [state, formAction] = useFormState(loginAction, null)

	return (
		<form className='space-y-6' action={formAction}>
			<Input name='username' placeholder='Username' />
			<Input name='password' type='password' placeholder='Password' />
			<Button type='submit'>Login</Button>
		</form>
	)
}
