import Link from 'next/link'
import styled from 'styled-components'
import { useLocale } from '../hooks/useLocale'
const Footer = () => {
  const { t } = useLocale()
  return (
    <Foot>
      <Link href="/scaleSearch">
        <p>{t.TITLE}</p>
      </Link>
    </Foot>
  )
}

export default Footer

const Foot = styled.footer`
  background: #f2f2f2;
  color: #fff;
  padding: 1rem;
  text-align: center;
  font-size: 0.8rem;
  bottom: 0;
  a {
    text-decoration: none;
    // color: #fff;
  }
`
