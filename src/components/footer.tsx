'use client'
import Link from 'next/link'
import { useLocale } from '../hooks/useLocale'

const Footer: React.FC = () => {
  const { t } = useLocale()
  return (
    <footer className="bg-gray-100 text-white p-4 text-center text-sm bottom-0">
      <Link href="/scaleSearch" className="no-underline">
        <p>{t.TITLE}</p>
      </Link>
    </footer>
  )
}

export default Footer
