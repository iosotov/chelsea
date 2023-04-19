import { useRouter } from 'next/router'


//reroutes from tasks to search
export default function Tasks() {
    const router = useRouter();
    router.push({
        pathname: '/tasks/list'
    })
}
