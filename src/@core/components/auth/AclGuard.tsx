// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types
import type { ACLObj } from 'src/configs/acl'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Config Import
import { buildAbilityFor } from 'src/configs/acl'

// ** Component Import
import NotAuthorized from 'src/pages/401'
import Spinner from 'src/@core/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Util Import
import { useAppSelector } from 'src/store/hooks'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
}

const AclGuard = ({ aclAbilities, children, guestGuard = false, authGuard = true }: AclGuardProps) => {


  const { token, employee: { permissions } } = useAppSelector(state => state.auth)
  const router = useRouter()


  useEffect(() => {
    if (token && permissions && !guestGuard && router.route === '/') {
      const { returnUrl } = router.query
      const redirectURL = returnUrl && returnUrl !== '/dashboard' ? returnUrl : '/dashboard'
      router.replace(redirectURL as string)
    }
  }, [token, guestGuard, router, permissions])

  const ability = token ? buildAbilityFor(permissions) : null
  const isErrorPage = ['/404', '/500'].includes(router.route)

  if (token && !ability && router.route === '/') {
    return <Spinner />
  }

  if (guestGuard || isErrorPage || !authGuard) {
    return token && ability
      ? <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
      : <>{children}</>
  }

  if (token && ability?.can(aclAbilities.action, aclAbilities.subject)) {
    return router.route === '/'
      ? <Spinner />
      : <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}
export default AclGuard
