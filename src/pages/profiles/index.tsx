import { useRouter } from "next/router";

export default function Profiles() {
    const router = useRouter();
    
    let profileId = '1345618';

    console.log('contact rerender')

    //check for stored profileId, if not, sent to list
    // - has to be stored elsewhere, maybe local or redux?
    // if no profile, push to list
    // else push to profileId
    if (!profileId) {
        console.log(profileId)
        router.push({
            pathname: '/profiles/list'
        })
        return;
    }
    router.push({
        pathname: `/profiles/${profileId}/credit`
    })

}