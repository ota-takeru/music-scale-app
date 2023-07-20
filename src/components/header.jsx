import { GrLanguage } from 'react-icons/gr'
import { IconContext } from 'react-icons/lib'
import { RxHome } from 'react-icons/rx'
import { SlMenu } from 'react-icons/sl'
import styled from 'styled-components'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { useLocale } from '../hooks/useLocale'
import { useRouter } from 'next/router'

const Header = (props) => {
  const [isDisplay, setIsDisplay] = useState(false)
  const [displayMenu, setDisplayMenu] = useState(true)
  const handleClick = () => {
    setIsDisplay(!isDisplay)
    // setDisplayMenu(!displayMenu)
  }
  const handleMenu = () => {
    setDisplayMenu(!displayMenu)
  }
  const { t } = useLocale()
  const router = useRouter()
  const currentUrl = router.asPath

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 1500) {
        setDisplayMenu(false)
      } else {
        setDisplayMenu(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Head>
      <Menu onClick={handleMenu}>
        <IconContext.Provider value={{ size: '2em' }}>
          <SlMenu />
        </IconContext.Provider>
      </Menu>
      <MenuTab displayMenu={displayMenu} setDisplayMenu={setDisplayMenu}>
        <ul>
          <Link href="/scaleSearch" passHref>
            <li>{t.SCALE_TITLE}</li>
          </Link>
          <Link href="/chordSearch" passHref>
            <li>{t.CHORD_TITLE}</li>
          </Link>
        </ul>
        <Language>
          <Ul isDisplay={isDisplay}>
            <li>
              <Link
                href={currentUrl}
                locale="en"
                passHref
                onClick={handleClick}
              >
                English
              </Link>
            </li>
            <li>
              <Link
                href={currentUrl}
                locale="ja"
                passHref
                onClick={handleClick}
              >
                日本語
              </Link>
            </li>
          </Ul>
          <Footer>
            <Home>
              <Link href="/">
                <IconContext.Provider value={{ size: '2em' }}>
                  <RxHome />
                </IconContext.Provider>
              </Link>
            </Home>
            <Button onClick={handleClick}>
              <IconContext.Provider value={{ size: '2em' }}>
                <GrLanguage />
              </IconContext.Provider>
            </Button>
          </Footer>
        </Language>
      </MenuTab>
      <h1>
        <Link href={props.href}>{props.title}</Link>
      </h1>
    </Head>
  )
}

export default Header

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border-top: 1px solid #ccc;
  padding-top: 10px;
  transition: width 0.1s ease;
  ${({ displayMenu }) => displayMenu && `opacity: 100%;`}
`
const Home = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 0 20%;
  border-radius: 10px;
  width: 60px;
  height: 60px;
  &:hover {
    background-color: #ccc;
  }
  a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    margin: 0;
  }
  svg {
    margin: 0;
    width: 100%;
  }
`
const Menu = styled.button`
  position: fixed;
  top: 20px;
  left: 40px;
  appearance: none;
  background-color: transparent;
  border: none;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  z-index: 100;
  @media (max-width: 600px) {
    position: fixed;
    left: 10px;
    background-color: white;
    &:active {
      background: transparent;
    }
  }
`
const MenuTab = styled.div`
  background-color: white;
  position: fixed;
  height: 100%;
  overflow: hidden;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transform: translateX(-100%);
  z-index: 5;
  border-right: 1px solid #ccc;
  ${({ displayMenu }) =>
    displayMenu &&
    `
    transform: translateX(0);
  `}
  h1 {
    font-size: 1.5em;
    margin: 0;
    text-align: center;
  }
  ul {
    padding: 0;
    margin-top: 7em;
    opacity: 0;
    overflow: hidden;
    transition: 0.3s ease;
    ${({ displayMenu }) =>
      displayMenu &&
      `
    opacity: 100%;
  `}
  }
  li {
    list-style: none;
    font-size: 1.3em;
    color: #333;
    padding: 10px 40px;
    text-align: left;
    text-decoration: none;
    border-bottom: 1px solid #ccc;
  }
  li:hover {
    background: #ddd;
  }
  a {
    transition: 1s ease;
    text-decoration: none;
  }
`
const Button = styled.button`
  z-index: 100;
  border: none;
  cursor: pointer;
  background-color: transparent;
  user-select: none;
  margin: 0 20% 0 auto;
  border-radius: 10px;
  width: 60px;
  height: 60px;
  &:hover {
    background-color: #ccc;
  }
`
const Language = styled.div`
  margin-top: auto;
  margin-bottom: 20px;
`
const Ul = styled.ul`
  display: ${(props) => (props.isDisplay ? 'block' : 'none')};
  padding: 10px;
  align-items: center;
  border: 1px solid #ccc;
  margin: 0 auto;
  li {
    list-style: none;
    margin: 10px;
  }
`
const Head = styled.header`
  background-color: #fff;
  z-index: 6;
  width: 100%;
  height: 70px;
  // border-bottom: 1px solid #ccc;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: left;
  h1 {
    margin-left: 9em;
    font-size: 2em;
  }
  a {
    color: #333;
    margin: 10px 0;
    text-decoration: none;
  }
  a :active {
    color: #fff;
  }
  @media (max-width: 1100px) {
    div {
      margin-right: 0;
    }
    h1 {
      margin-left: 7em;
    }
  @media (max-width: 600px) {
    h1 {
      margin: auto;
      text-align: center;
        }
  }
`
