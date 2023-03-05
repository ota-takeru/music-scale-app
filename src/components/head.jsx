import Head from 'next/head'
import { useLocale } from '../hooks/useLocale'

const { t } = useLocale()

export default Head = () => {
  return (
    <Head>
      <title>MusicTools</title>
      <meta name="description" content={t.DESCRIPTIONS} />
      <meta name="keywords" content={'scale'} />
    </Head>
  )
}
