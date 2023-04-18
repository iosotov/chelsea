// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAppSelector } from 'src/store/hooks'
import { selectAuthState, selectCurrentToken, selectRefreshInit } from 'src/store/authSlice'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props

  /*
  Global State

  loading => are we waiting on API calls
  init => has refresh-token api been called
   */
  const loading = useAppSelector(selectAuthState)
  const init = useAppSelector(selectRefreshInit)
  const token = useAppSelector(selectCurrentToken)

  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (token) {
      if (router) {
        const returnUrl = router.query.returnUrl
        const redirectURL = returnUrl && returnUrl !== '/dashboard' ? returnUrl : '/dashboard'

        router.replace(redirectURL as string)
      }
    }
  }, [router, token])

  /*

  if refreshAPI called, all API calls made, and no token
  render guest page

  */
  if (init && !loading && !token) {
    return <>{children}</>
  }

  return fallback
}

export default GuestGuard
