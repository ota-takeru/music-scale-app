import { GrLanguage } from 'react-icons/gr'
import { IconContext } from 'react-icons/lib'
import styled from 'styled-components'
import Link from 'next/link'
import { useState } from 'react'
import { useLocale } from '../hooks/useLocale'

const Button = styled.button`
  width: 80px;
  height: 60px;
  font-size: 20px;
  color: black;
  border: none;
  cursor: pointer;
  transition: 0.1s ease;
  background-color: #fff;
  margin-right: 0 20px;
  user-select: none;
`

const Ul = styled.ul`
  display: ${(props) => (props.isDisplay ? 'block' : 'none')};
  position: absolute;
  top: 60px;
  right: 0;
  background-color: #eee;
  padding: 10px;
  position: absolute;
  buttom: 0;
  align-items: center;
  li {
    list-style: none;
    margin: 10px;
  }
`

const Head = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  position: relative;
  text-align: center;
  margin-bottom: 20px;
  h1 {
    font-size: 2em;
    margin: 0 auto;
  }
  a {
    text-decoration: none;
  }
  a :active {
    color: #fff;
  }
  div {
    position: relative;
    margin-right: 10em;
  }

  @media (max-width: 1100px) {
    div {
      margin-right: 0;
    }
  }
`
const Header = () => {
  const [isDisplay, setIsDisplay] = useState(false)

  const handleClick = () => {
    setIsDisplay(!isDisplay)
  }
  const { t } = useLocale()
  return (
    <Head>
      <h1>{t.TITLE}</h1>
      <div>
        <Button onClick={handleClick}>
          <IconContext.Provider value={{ size: '1.5em' }}>
            <GrLanguage />
          </IconContext.Provider>
        </Button>
        <Ul isDisplay={isDisplay}>
          <li>
            <Link
              href="/scaleSearch"
              locale="en"
              passHref
              onClick={handleClick}
            >
              English
            </Link>
          </li>
          <li>
            <Link
              href="/scaleSearch"
              locale="ja"
              passHref
              onClick={handleClick}
            >
              日本語
            </Link>
          </li>
        </Ul>
      </div>
    </Head>
  )
}

export default Header
