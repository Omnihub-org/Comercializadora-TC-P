'use client'

import FinalStatus from '@/components/core/final-status'

export default function FeatureErrorPage({ error }: { error: Error & { digest?: string } }) {
  return <FinalStatus status='error' messages={error} />
}
