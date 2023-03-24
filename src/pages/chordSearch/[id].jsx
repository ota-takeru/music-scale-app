import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import ChordSearch from "@/src/components/baseChord"

const Post = () => {
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
            <ChordSearch urlArray={array} />
        </>
    );
}

export default Post
            