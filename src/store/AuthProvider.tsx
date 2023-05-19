// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types
import { Provider } from 'react-redux'
import { store } from './store'
import { useAppSelector } from './hooks'
import { usePostAuthRefreshTokenQuery } from './api/apiHooks'

type Props = {
  children: ReactNode
  fallback: ReactNode
}

const AuthWrapper = ({ children, fallback }: Props) => {
  // ** Hooks
  const router = useRouter()

  const auth = useAppSelector(state => state.auth)

  usePostAuthRefreshTokenQuery(undefined, { skip: !!auth.token })

  if (!auth.init) return <>{fallback}</>

  if (!auth.token) {
    if (!router.pathname.includes('login')) {
      router.replace('/login')
    }
  }

  return <>{children}</>

}

const AuthProvider = ({ children, fallback }: Props) => {

  return (
    <Provider store={store}>
      <AuthWrapper fallback={fallback}>
        {children}
      </AuthWrapper>
    </Provider>
  )
}

export { AuthWrapper, AuthProvider }
