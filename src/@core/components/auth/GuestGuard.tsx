// ** React Imports
import { ReactNode, ReactElement } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAppSelector } from 'src/store/hooks'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = ({ children }: GuestGuardProps) => {

  const token = useAppSelector(state => state.auth.token)

  const router = useRouter()

  if (token) {
    const returnUrl = router.query.returnUrl
    const redirectURL = returnUrl ? returnUrl : '/dashboard'

    router.replace(redirectURL as string)
  }

  return <>{children}</>

}

export default GuestGuard
