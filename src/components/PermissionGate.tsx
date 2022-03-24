import React, { createContext, useEffect, useContext, useMemo, useCallback } from 'react'
import { UserPermission as UserPermissionOri, Maybe, useViewerQuery, useViewerTeamRoleLazyQuery } from 'generated/graphql'

const TeamIdCtx = createContext<string | undefined>(undefined)
export type UserPermission = UserPermissionOri
export type Perms = UserPermission | UserPermission[]
type RoleGateProps = {
  perm?: Maybe<Perms>
}
export const PermTeamProvider = TeamIdCtx.Provider
const Nothing = <></>

export const useHasPermission = (tid?: string) => {
  const ctxId = useContext(TeamIdCtx)
  const teamId = tid ?? ctxId
  const { data } = useViewerQuery()
  const [fetchTeamRole, { data: teamData }] = useViewerTeamRoleLazyQuery()
  const curPerm: UserPermissionOri[] = useMemo(() => {
    return [
      ...data?.viewer?.userRole.permissions ?? [],
      ...teamData?.viewer?.teamRole?.permissions ?? []
    ]
  }, [data, teamData])
  useEffect(() => {
    if (teamId) {
      fetchTeamRole({
        variables: {
          teamId
        }
      })
    }
  }, [teamId, fetchTeamRole])

  return useCallback((perm?: Maybe<Perms>) => {
    if (curPerm === undefined) {
      return false
    }
    if (perm) {
      const perms: UserPermission[] = Array.isArray(perm) ? perm : [perm]
      if (!perms.some(p => curPerm.includes(p))) {
        return false
      }
    }

    return true
  }, [curPerm])
}

export const RoleGate: React.FC<RoleGateProps> = ({ perm, children }) => {
  return useHasPermission()(perm) ? <>{children}</> : Nothing
}

export const LoginGate: React.FC = ({ children }) => {
  const { data } = useViewerQuery()

  if (data?.viewer) {
    return <>{children}</>
  }

  return <></>
}
