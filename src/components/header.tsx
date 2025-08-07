'use client'
import { GrLanguage } from 'react-icons/gr'
import { IconContext } from 'react-icons/lib'
import { RxHome } from 'react-icons/rx'
import { SlMenu } from 'react-icons/sl'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLocale } from '../hooks/useLocale'
import { usePathname } from 'next/navigation'
import type { HeaderProps } from '../types'

const Header: React.FC<HeaderProps> = ({
  href = '/',
  title = 'Music Scale App',
}) => {
  const [isDisplay, setIsDisplay] = useState(false)
  const [displayMenu, setDisplayMenu] = useState(true)

  const handleClick = () => {
    setIsDisplay(!isDisplay)
  }

  const handleMenu = () => {
    setDisplayMenu(!displayMenu)
  }

  const { t } = useLocale()
  const pathname = usePathname()

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
    <header className="bg-white z-[6] w-full h-17-5 flex flex-row justify-between items-left">
      <button
        onClick={handleMenu}
        className="fixed top-5 left-10 appearance-none bg-transparent border-none rounded-lg p-2.5 cursor-pointer z-[100]
                   max-sm:fixed max-sm:left-2.5 max-sm:bg-white max-sm:active:bg-transparent"
      >
        <IconContext.Provider value={{ size: '2em' }}>
          <SlMenu />
        </IconContext.Provider>
      </button>

      <div
        className={`bg-white fixed h-full w-64 overflow-hidden transition-all duration-200 ease-in-out 
                      flex flex-col justify-end border-r border-gray-300 z-[5]
                      ${
                        displayMenu
                          ? 'transform translate-x-0'
                          : 'transform -translate-x-full'
                      }`}
      >
        <ul
          className={`p-0 mt-28 overflow-hidden transition-opacity duration-300 ease-in-out
                       ${displayMenu ? 'opacity-100' : 'opacity-0'}`}
        >
          <Link href="/scaleSearch">
            <li className="list-none text-xl text-gray-700 py-2.5 px-10 text-left no-underline border-b border-gray-300 hover:bg-gray-200">
              {t.SCALE_TITLE}
            </li>
          </Link>
          <Link href="/chordSearch">
            <li className="list-none text-xl text-gray-700 py-2.5 px-10 text-left no-underline border-b border-gray-300 hover:bg-gray-200">
              {t.CHORD_TITLE}
            </li>
          </Link>
        </ul>

        <div className="mt-auto mb-5">
          <ul
            className={`${
              isDisplay ? 'block' : 'hidden'
            } p-2.5 mx-4 bg-gray-50 rounded border border-gray-300`}
          >
            <li className="list-none m-2.5">
              <Link
                href={pathname}
                locale="en"
                onClick={handleClick}
                className="no-underline transition-all duration-1000 ease-in-out"
              >
                English
              </Link>
            </li>
            <li className="list-none m-2.5">
              <Link
                href={pathname}
                locale="ja"
                onClick={handleClick}
                className="no-underline transition-all duration-1000 ease-in-out"
              >
                日本語
              </Link>
            </li>
          </ul>

          <div
            className={`flex items-center justify-center flex-row border-t border-gray-300 pt-2.5 
                          transition-all duration-100 ease-in-out ${
                            displayMenu ? 'opacity-100' : ''
                          }`}
          >
            <div className="flex justify-center items-center ml-[20%] mr-auto rounded-lg w-15 h-15 hover:bg-gray-300">
              <Link
                href="/"
                className="flex justify-center items-center w-full h-full m-0"
              >
                <IconContext.Provider value={{ size: '2em' }}>
                  <RxHome />
                </IconContext.Provider>
              </Link>
            </div>

            <button
              onClick={handleClick}
              className="z-[100] border-none cursor-pointer bg-transparent select-none mr-[20%] ml-auto 
                        rounded-lg w-15 h-15 hover:bg-gray-300"
            >
              <IconContext.Provider value={{ size: '2em' }}>
                <GrLanguage />
              </IconContext.Provider>
            </button>
          </div>
        </div>
      </div>

      <h1 className="ml-72 text-3xl text-gray-700 my-2.5 no-underline max-[1500px]:ml-20 max-sm:mx-auto max-sm:text-center">
        <Link
          href={href}
          className="text-gray-700 my-2.5 no-underline active:text-white"
        >
          {title}
        </Link>
      </h1>
    </header>
  )
}

export default Header
