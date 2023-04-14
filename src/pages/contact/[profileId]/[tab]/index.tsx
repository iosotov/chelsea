import { useRouter } from 'next/router'
import UserProfile from '..'

export default function ProfileTab() {
  const router = useRouter()
  const { tab } = router.query

  if (tab) return <UserProfile tab={String(tab)} />
}
