import Router from 'next/router'
import Link from 'next/link'
import { useLocale } from '../hooks/useLocale'

const Home = () => {
 const { t } = useLocale() 
  return (
    <div>
      <h1>Home</h1>]
      <Link href="/scaleSearch">{t.TITLE}</Link>
    </div>
  )
}

Home.getInitialProps = async ({ res }) => {
  if (typeof window === 'undefined') {
    res.writeHead(302, { Location: '/scaleSearch' })
    res.end()

    return {}
  }

  Router.push('/scaleSearch')

  return {}
}

export default Home
