import 'server-only'

import { Score, ScoringAdapter } from '../adapter'

interface FixedScoringAdapterConfig {
	score: Score
}

export class FixedScoringAdapter extends ScoringAdapter {
	public readonly isFixed = true

	constructor(private readonly config: FixedScoringAdapterConfig) {
		super()
	}

	async getScore(): Promise<Score> {
		return this.config.score
	}
}
