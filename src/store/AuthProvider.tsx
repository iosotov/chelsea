// ** React Imports
import { useEffect, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types
import { Provider } from 'react-redux'
import { store } from './store'
import { RefreshToken, selectRefreshInit } from './authSlice'
import { useAppDispatch, useAppSelector } from './hooks'
import FallbackSpinner from 'src/@core/components/spinner'

type Props = {
  children: ReactNode
}

const AuthWrapper = ({ children }: Props) => {
  // ** Hooks
  const router = useRouter()
  const dispatch = useAppDispatch()

  // has refresh token api been called
  const init = useAppSelector(selectRefreshInit)

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      // send request to refresh-token api to check for token
      const refreshToken = await dispatch(RefreshToken()).unwrap()
      if (!refreshToken) {
        if (!router.pathname.includes('login')) {
          router.replace('/login')
        }
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return init ? <>{children}</> : <FallbackSpinner />
}

const AuthProvider = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <AuthWrapper>{children}</AuthWrapper>
    </Provider>
  )
}

export { AuthWrapper, AuthProvider }
