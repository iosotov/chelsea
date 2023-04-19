import { useRouter } from "next/router";

export default function Transactions() {
    const router = useRouter();

    router.push({
        pathname: '/transactions/list'
    })
}