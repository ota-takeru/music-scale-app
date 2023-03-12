import { GrLanguage } from 'react-icons/gr'
import { IconContext } from 'react-icons/lib'
import styled from 'styled-components'
import Link from 'next/link'
import { useState } from 'react'
import { useLocale } from '../hooks/useLocale'
import { useRouter } from 'next/router'

const Header = () => {
  const [isDisplay, setIsDisplay] = useState(false)

  const handleClick = () => {
    setIsDisplay(!isDisplay)
  }
  const { t } = useLocale()
  const router = useRouter()
  const currentUrl = router.asPath

  return (
    <Head>
      <h1>
        <Link href="/scaleSearch">{t.TITLE}</Link>
      </h1>
      <div>
        <Button onClick={handleClick}>
          <IconContext.Provider value={{ size: '1.5em' }}>
            <GrLanguage />
          </IconContext.Provider>
        </Button>
        <Ul isDisplay={isDisplay}>
          <li>
            <Link href={currentUrl} locale="en" passHref onClick={handleClick}>
              English
            </Link>
          </li>
          <li>
            <Link href={currentUrl} locale="ja" passHref onClick={handleClick}>
              日本語
            </Link>
          </li>
        </Ul>
      </div>
    </Head>
  )
}

export default Header

const Button = styled.button`
  width: 80px;
  height: 60px;
  font-size: 20px;
  color: black;
  border: none;
  cursor: pointer;
  transition: 0.1s ease;
  background-color: transparent;
  // margin-right: 0 20px;
  user-select: none;
`

const Ul = styled.ul`
  display: ${(props) => (props.isDisplay ? 'block' : 'none')};
  position: absolute;
  top: 50px;
  right: 0;
  background-color: white;
  padding: 10px;
  position: absolute;
  buttom: 0;
  align-items: center;
  border: 1px solid #ccc;
  li {
    list-style: none;
    margin: 10px;
  }
`

const Head = styled.header`
  width: 100%;
  display: block;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  position: relative;
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  h1 {
    font-color: black;
    display: inline;
    font-size: 2em;
    margin: 0;
    text-align: center;
  }
  h1 :active {
    color: black;
  }
  a {
    text-decoration: none;
  }
  a :active {
    color: #fff;
  }
  div {
    position: absolute;
    margin-right: 10em;
    top: 5px;
    right: 0;
  }

  @media (max-width: 1100px) {
    div {
      margin-right: 0;
    }
  }
`
