import { useRouter } from "next/router";

export default function Profiles() {
    const router = useRouter()

    router.push({
        pathname: '/profiles/list'
    })
}