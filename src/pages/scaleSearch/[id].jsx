import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useConvertScaleName } from '@/src/hooks/useConvertScaleName'
import Base from '../../components/base'
import DisplayChords from '@/src/components/displayChords'
import styled from 'styled-components'

function Post() {
  const router = useRouter()
  const { id } = router.query
  const [array, setArray] = useState([])

  useEffect(() => {
    if (id) {
      setArray(id.split('-'))
    }
  }, [router.query])

  return (
    <>
      <Base queryKey={array[0]} queryScale={array[1]} urlArray={array}>
        <Container>
          {/* <h1>{array[0] + ' ' + useConvertScaleName(array[1])}</h1>
          <DisplayChords /> */}
        </Container>
      </Base>
    </>
  )
}

export default Post

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  padding: 20px 20px;
`
