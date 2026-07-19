import Link from 'next/link'
import Container from '../components/container'
import type { Metadata } from 'next'
import ja from '../locales/ja'

export const metadata: Metadata = {
  title: 'Music Scale App',
  description: ja.DESCRIPTIONS_HOME,
  keywords: ja.KEYWORDS,
}

export default function Home() {
  const t = ja

  return (
    <Container>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>{t.HOME_TITLE}</h1>
        <p>{t.DESCRIPTIONS_HOME}</p>
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <Link
            href="/scaleSearch"
            data-testid="home-scale-link"
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
            }}
          >
            {t.SCALE_TITLE}
          </Link>
          <Link
            href="/chordSearch"
            data-testid="home-chord-link"
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
            }}
          >
            {t.CHORD_TITLE}
          </Link>
        </div>
      </div>
    </Container>
  )
}
