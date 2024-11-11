import { siteConfig } from '@/config/site'
import { Lead } from '@/lib/lead'

export interface Score {
	loan: {
		amount: { min: number; max: number }
		installments: { min: number; max: number }
	}
	card: {
		amount: { min: number; max: number }
	}
}

export abstract class ScoringAdapter {
	public readonly isFixed?: boolean

	abstract getScore(lead?: Lead): Promise<Score>
}

export function getScoringAdapter(): InstanceType<typeof ScoringAdapter> {
	return siteConfig.scoring.adapter
}
