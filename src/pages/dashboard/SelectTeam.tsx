import React, { useEffect } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { useTeamId } from './Dashboard'

/**
 * 自动为将当前url加上默认Team.
 */
export const Page: React.FC = () => {
  const { params, url } = useRouteMatch<{ team?: string }>()
  const { teamName } = useTeamId()
  const history = useHistory()

  useEffect(() => {
    if (params.team !== teamName) {
      const newUrl = url + teamName + '/'
      history.replace(newUrl)
    }
  }, [params, teamName, url, history])

  return <></>
}
