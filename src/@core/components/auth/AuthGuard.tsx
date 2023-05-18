// ** React Imports
import { ReactNode, ReactElement } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAppSelector } from 'src/store/hooks'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props

  // call from global state instead of object
  const router = useRouter()

  const auth = useAppSelector(state => state.auth)


  if (auth.token) return <>{children}</>

  if (auth.init) {
    if (router.asPath !== '/dashboard') {
      router.replace({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      })
    } else {
      router.replace('/login')
    }
  }

  return <>{fallback}</>

}

export default AuthGuard
