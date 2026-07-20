'use client'
import Link from 'next/link'
import { useLocale } from '../hooks/useLocale'

const Footer: React.FC = () => {
  const { t } = useLocale()
  return (
    <footer className="site-footer">
      <Link href="/scaleSearch" className="no-underline">
        <p>{t.TITLE}</p>
      </Link>
    </footer>
  )
}

export default Footer
