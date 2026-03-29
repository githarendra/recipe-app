import { useEffect } from 'react'

const usePageTitle = (page) => {
  useEffect(() => {
    document.title = page ? `FlavorSync | ${page}` : 'FlavorSync'
  }, [page])
}

export default usePageTitle