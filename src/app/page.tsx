'use client'
import React from 'react'
import Container from '../components/container'
import { useLocale } from '../hooks/useLocale'

export default function Home() {
  const { t } = useLocale()

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
          <a
            href="/scaleSearch"
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
            }}
          >
            {t.SCALE_TITLE}
          </a>
          <a
            href="/chordSearch"
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
            }}
          >
            {t.CHORD_TITLE}
          </a>
        </div>
      </div>
    </Container>
  )
}
