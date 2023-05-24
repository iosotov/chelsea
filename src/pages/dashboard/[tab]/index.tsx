import { useRouter } from 'next/router'
import Dashboard from '..'

export default function DashboardTab() {
  const router = useRouter()
  const { tab } = router.query

  if (tab) return <Dashboard tab={String(tab)} />
}
