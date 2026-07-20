'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import type { LocaleTexts } from '../types'
import en from '../locales/en'
import ja from '../locales/ja'

export type Locale = 'ja' | 'en'
export type Theme = 'light' | 'dark'

const LOCALE_STORAGE_KEY = 'music-scale-app-locale'
const THEME_STORAGE_KEY = 'music-scale-app-theme'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'ja',
  setLocale: () => undefined,
})

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => undefined,
  toggleTheme: () => undefined,
})

const readStoredLocale = (): Locale | null => {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    return stored === 'en' || stored === 'ja' ? stored : null
  } catch {
    return null
  }
}

const readStoredTheme = (): Theme | null => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'dark' || stored === 'light' ? stored : null
  } catch {
    return null
  }
}

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.style.colorScheme = theme
}

export const LocaleProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('ja')
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    const storedLocale = readStoredLocale()
    const initialLocale = storedLocale ?? 'ja'
    const storedTheme = readStoredTheme()
    const initialTheme =
      storedTheme ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light')

    const animationFrame = window.requestAnimationFrame(() => {
      setLocaleState(initialLocale)
      setThemeState(initialTheme)
      document.documentElement.lang = initialLocale
      applyTheme(initialTheme)
    })

    if (!storedTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleMediaChange = (event: MediaQueryListEvent) => {
        const nextTheme = event.matches ? 'dark' : 'light'
        setThemeState(nextTheme)
        applyTheme(nextTheme)
      }
      mediaQuery.addEventListener?.('change', handleMediaChange)
      return () => {
        window.cancelAnimationFrame(animationFrame)
        mediaQuery.removeEventListener?.('change', handleMediaChange)
      }
    }

    return () => window.cancelAnimationFrame(animationFrame)
  }, [])

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale)
    document.documentElement.lang = nextLocale
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale)
    } catch {
      // localStorage may be unavailable in private browsing or embedded views.
    }
  }, [])

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme)
    applyTheme(nextTheme)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    } catch {
      // localStorage may be unavailable in private browsing or embedded views.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [setTheme, theme])

  const themeValue = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [setTheme, theme, toggleTheme],
  )

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <ThemeContext.Provider value={themeValue}>
        {children}
      </ThemeContext.Provider>
    </LocaleContext.Provider>
  )
}

interface UseLocaleReturn {
  locale: Locale
  t: LocaleTexts
  setLocale: (locale: Locale) => void
}

export const useLocale = (): UseLocaleReturn => {
  const { locale, setLocale } = useContext(LocaleContext)
  const t = locale === 'en' ? en : ja
  return { locale, t, setLocale }
}

export const useTheme = (): ThemeContextValue => useContext(ThemeContext)
