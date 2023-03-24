import Router from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import { useLocale } from '../hooks/useLocale'
import Header from '../components/header'
import SubContainer from '../components/subContainer'
import Container from '../components/container'

const Home = () => {
  const { t } = useLocale()
  return (
    <>
      <Header href="/" title={t.HOME_TITLE} />
      <Container>
        <SubContainer>
          <Descriptions>
            <p>{t.DESCRIPTIONS_HOME}</p>
          </Descriptions>
        </SubContainer>
        <SubContainer isresponsive="true">
          <Div>
            <Link href="/scaleSearch">
              <p>{t.SCALE_TITLE}</p>
            </Link>
          </Div>
          <Div>
            <Link href="/chordSearch">
              <p>{t.CHORD_TITLE}</p>
            </Link>
          </Div>
        </SubContainer>
      </Container>
    </>
  )
}
export default Home

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px 60px;
  background-color: #eee;
  border: 2px solid #fff;
  border-radius: 10px;
  width: 70%;
  &:hover {
    border: 2px solid #333;
  }
  a {
    font-size: 1.5em;
    text-decoration: none;
    text-align: center;
    width: 100%;
  }
  @media (max-width: 600px) {
    margin: 20px 20px;
  }
`
const Descriptions = styled.div`
  padding: 0 8em;
  p {
    font-size: 1.5em;
  }
  @media (max-width: 600px) {
    padding: 0 3em;
    p {
      font-size: 1.2em;
    }
  }
`

// Home.getInitialProps = async ({ res }) => {
//   if (typeof window === 'undefined') {
//     res.writeHead(302, { Location: '/scaleSearch' })
//     res.end()

//     return {}
//   }

//   Router.push('/scaleSearch')

// return {}
// }
