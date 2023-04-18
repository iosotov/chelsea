// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAppSelector } from 'src/store/hooks'
import { selectAuthState, selectCurrentToken, selectRefreshInit, } from 'src/store/authSlice'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props

  // call from global state instead of object
  const router = useRouter()
  const loading = useAppSelector(selectAuthState);
  const init = useAppSelector(selectRefreshInit)

  const token = useAppSelector(selectCurrentToken)

  useEffect(
    () => {
      if (!router.isReady) {
        return
      }

      if (init && !token && !loading) {
        if (router.asPath !== '/dashboard/') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace('/login')
        }
      }
    },

    [init, loading, router, router.route, token]
  )

  if (init && token) {

    return <>{children}</>
  }

  return fallback
}

export default AuthGuard
