export type GroupBy<T extends object, K extends keyof T, V extends string = T[K] extends string ? T[K] : never> = {
	[key in V]: T
}
