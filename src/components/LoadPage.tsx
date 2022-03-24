import React, { Suspense, useMemo } from 'react'
import { Loading } from './Loading'
import { Route, RouteProps } from 'react-router-dom'
import { useError } from 'hooks/useError'

type LoadPageProps = {
  page: Promise<{ Page: React.FC }>
}

const Noop: React.FC = () => {
  return <></>
}

export const LoadPage: React.FC<{ lazy: React.LazyExoticComponent<React.FC> }> = ({ lazy, children }) => {
  const Lazy = lazy

  return <Suspense fallback={<Loading />}>
    <Lazy>{children}</Lazy>
  </Suspense>
}

const getKey = (path: string | string[] | undefined) => {
  if (Array.isArray(path)) {
    return path.join(',')
  } else {
    return path
  }
}

const Cache = new Map<LoadPageProps['page'], React.LazyExoticComponent<React.FC<{}>>>()
export const RoutePage: React.FC<RouteProps & LoadPageProps> = ({ page, children, ...rest }) => {
  const [error, { setError }] = useError()

  const defPage = useMemo(() => {
    let lazy = Cache.get(page)
    if (!lazy) {
      lazy = React.lazy(() => page
        .then(i => ({
          default: i.Page,
        }))
        .catch(e => {
          setError(e)
          return ({
            default: Noop,
          })
        })
      )
    }
    return lazy
  }, [page, setError])

  return <Route {...rest}>{error || <LoadPage key={getKey(rest.path as any)} lazy={defPage}>{children}</LoadPage>}</Route>
}
