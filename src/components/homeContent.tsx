'use client'

import Link from 'next/link'
import type { FC } from 'react'
import Container from './container'
import { useLocale } from '../hooks/useLocale'

const HomeContent: FC = () => {
  const { t } = useLocale()

  return (
    <Container>
      <div className="home-content">
        <h1>{t.HOME_TITLE}</h1>
        <p>{t.DESCRIPTIONS_HOME}</p>
        <div className="home-actions">
          <Link href="/scaleSearch" data-testid="home-scale-link">
            {t.SCALE_TITLE}
          </Link>
          <Link href="/chordSearch" data-testid="home-chord-link">
            {t.CHORD_TITLE}
          </Link>
        </div>
      </div>
    </Container>
  )
}

export default HomeContent
