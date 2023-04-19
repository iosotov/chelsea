import Link from "next/link"

export default function ContactList() {

  const Random = () => {
    return Math.floor(Math.random() * (9999999-1000000) + 1000000)
  }
  
  return (
    <>
      <p>Contact List</p>
      <Link href={`/profiles/${Random()}/debts`}>Random Profile</Link>
    </>
  )
}
