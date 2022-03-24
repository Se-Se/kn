import React from 'react'
import { omitVariables } from './omitVariables'
import { useProjectIdQuery, ProjectIdDocument } from 'generated/graphql'
import { getRender, act, wait } from 'test-utils'

describe('omitVariables', () => {
  const ProjectName = 'asdfasdf'
  const ProjectId = 'projectIDIDID'
  const mocks = [
    {
      request: {
        query: ProjectIdDocument,
        variables: {
          projectName: ProjectName,
        },
      },
      result: {
        data: {
          __typename: 'Query',
          viewer: {
            __typename: 'User',
            id: 'id',
            username: 'username',
            nickname: 'nickname'
          },
          projectByName: {
            __typename: 'Project',
            id: ProjectId,
          }
        },
      }
    },
  ]
  it('works without argument', async () => {
    const { render } = getRender(mocks)
    const Comp: React.FC = () => {
      const useNewProjectQuery = omitVariables(useProjectIdQuery, {
        projectName: ProjectName
      })
      const { data, error } = useNewProjectQuery()
      return <>{error?.toString()} {data?.projectByName?.id}</>
    }
    const { getByText } = render(<Comp />)
    await act(async () => {
      await wait()
    })
    getByText(ProjectId)
  })
  it('works with options', async () => {
    const { render } = getRender(mocks)
    const Comp: React.FC = () => {
      const useNewProjectQuery = omitVariables(useProjectIdQuery, {
        projectName: ProjectName
      })
      const { data, error } = useNewProjectQuery({})
      return <>{error?.toString()} {data?.projectByName?.id}</>
    }
    const { getByText } = render(<Comp />)
    await act(async () => {
      await wait()
    })
    getByText(ProjectId)
  })
  it('works with variables options', async () => {
    const { render } = getRender(mocks)
    const Comp: React.FC = () => {
      const useNewProjectQuery = omitVariables(useProjectIdQuery, {
        projectName: ProjectName
      })
      const { data, error } = useNewProjectQuery({ variables: { projectName: 'nonoo' } })
      return <>{error?.toString()} {data?.projectByName?.id}</>
    }
    const { getByText } = render(<Comp />)
    await act(async () => {
      await wait()
    })
    getByText(ProjectId)
  })
})
