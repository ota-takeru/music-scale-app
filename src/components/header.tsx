'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { FC } from 'react'
import { FiHome, FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi'
import { GrLanguage } from 'react-icons/gr'
import { useLocale, useTheme, type Locale } from '../hooks/useLocale'
import type { HeaderProps } from '../types'

const Header: FC<HeaderProps> = ({
  href = '/',
  title = 'Music Scale App',
}) => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [displayMenu, setDisplayMenu] = useState(true)
  const { locale, setLocale, t } = useLocale()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleResize = () => {
      const shouldDisplayMenu = window.innerWidth >= 1500
      setDisplayMenu(shouldDisplayMenu)
      if (!shouldDisplayMenu) setIsLanguageOpen(false)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLocaleChange = (nextLocale: Locale) => {
    setLocale(nextLocale)
    setIsLanguageOpen(false)
  }

  const handleMenuToggle = () => {
    if (displayMenu) setIsLanguageOpen(false)
    setDisplayMenu((isOpen) => !isOpen)
  }

  return (
    <header className="site-header">
      <button
        type="button"
        onClick={handleMenuToggle}
        className="menu-toggle"
        aria-label={t.MENU}
        aria-expanded={displayMenu}
        aria-controls="site-navigation"
      >
        {displayMenu ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
      </button>

      <aside
        id="site-navigation"
        className={`site-drawer ${displayMenu ? 'is-open' : ''}`}
        aria-hidden={!displayMenu}
        inert={!displayMenu}
      >
        <nav className="site-nav" aria-label={t.MENU}>
          <Link href="/scaleSearch" className="site-nav-link">
            {t.SCALE_TITLE}
          </Link>
          <Link href="/chordSearch" className="site-nav-link">
            {t.CHORD_TITLE}
          </Link>
        </nav>

        <div className="site-drawer-actions">
          <Link
            href="/"
            className="drawer-action"
            aria-label={t.HOME_TITLE}
          >
            <FiHome aria-hidden="true" />
          </Link>

          <div className="language-control">
            <button
              type="button"
              className="drawer-action"
              onClick={() => setIsLanguageOpen((isOpen) => !isOpen)}
              aria-label={t.LANGUAGE}
              aria-haspopup="true"
              aria-expanded={isLanguageOpen}
              aria-controls="language-options"
            >
              <GrLanguage aria-hidden="true" />
            </button>
            {isLanguageOpen && (
              <div
                id="language-options"
                className="language-popover"
                role="group"
                aria-label={t.LANGUAGE}
              >
                <button
                  type="button"
                  className={`language-option ${locale === 'ja' ? 'is-active' : ''}`}
                  onClick={() => handleLocaleChange('ja')}
                  aria-pressed={locale === 'ja'}
                >
                  日本語
                </button>
                <button
                  type="button"
                  className={`language-option ${locale === 'en' ? 'is-active' : ''}`}
                  onClick={() => handleLocaleChange('en')}
                  aria-pressed={locale === 'en'}
                >
                  English
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="drawer-action"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t.LIGHT_THEME : t.DARK_THEME}
            aria-pressed={theme === 'dark'}
            title={theme === 'dark' ? t.LIGHT_THEME : t.DARK_THEME}
          >
            {theme === 'dark' ? (
              <FiSun aria-hidden="true" />
            ) : (
              <FiMoon aria-hidden="true" />
            )}
          </button>
        </div>
      </aside>

      <div className="site-title">
        <Link href={href}>{title}</Link>
      </div>
    </header>
  )
}

export default Header
