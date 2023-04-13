import { useRouter } from 'next/router'

export default function UserProfile() {
  const router = useRouter()
  const { profileId } = router.query

  return <div>profileId: {profileId}</div>
}
