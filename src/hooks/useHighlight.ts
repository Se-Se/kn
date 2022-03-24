import { useLocation } from 'react-router-dom'
import { parse } from 'qs'

interface Query {
  highlight?: string
}
export const useHighlight = () => {
  const location = useLocation()
  const result: Query = parse(location.search, {
    ignoreQueryPrefix: true
  })
  return result.highlight
}
