import Router from 'next/router'

const RedirectPage = () => {
    return (
        <div>
            <h1>Home</h1>
        </div>
    )
}

RedirectPage.getInitialProps = async ({ res }) => {

  if (typeof window === 'undefined') {
    res.writeHead(302, { Location: '/scaleSearch' })
    res.end()

    return {} 
  }

  Router.push('/scaleSearch')

  return {} 
}

export default RedirectPage

