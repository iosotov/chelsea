// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types
import type { ACLObj, AppAbility } from 'src/configs/acl'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Config Import
import { buildAbilityFor } from 'src/configs/acl'

// ** Component Import
import NotAuthorized from 'src/pages/401'
import Spinner from 'src/@core/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks

// ** Util Import
import { useAppSelector } from 'src/store/hooks'
import { selectAuthPermissions, selectCurrentToken } from 'src/store/authSlice'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard = false, authGuard = true } = props

  // ** Hooks\
  const token = useAppSelector(selectCurrentToken)
  const permissions = useAppSelector(selectAuthPermissions)
  const router = useRouter()

  // ** Vars
  let ability: AppAbility

  useEffect(() => {
    if (token && permissions && !guestGuard && router.route === '/') {
      const returnUrl = router.query.returnUrl
      const redirectURL = returnUrl && returnUrl !== '/dashboard' ? returnUrl : '/dashboard'

      router.replace(redirectURL as string)
    }
  }, [token, guestGuard, router, permissions])

  // User is logged in, build ability for the user based on his role
  if (token && !ability) {
    ability = buildAbilityFor(permissions)
    if (router.route === '/') {
      return <Spinner />
    }
  }

  // If guest guard or no guard is true or any error page
  if (guestGuard || router.route === '/404' || router.route === '/500' || !authGuard) {
    // If user is logged in and his ability is built
    if (token && ability) {
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    } else {
      // If user is not logged in (render pages like login, register etc..)
      return <>{children}</>
    }
  }

  // Check the access of current user and render pages
  if (ability && token && ability.can(aclAbilities.action, aclAbilities.subject)) {
    if (router.route === '/') {
      return <Spinner />
    }

    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard
