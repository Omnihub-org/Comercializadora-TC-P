export const adminCredentials = {
	username: process.env.ADMIN_USERNAME!,
	password: process.env.ADMIN_PASSWORD!,
}

if (!adminCredentials.username || !adminCredentials.password) {
	throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be set')
}
