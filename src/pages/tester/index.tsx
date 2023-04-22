import { useCreateCampaignMutation, useDeleteCampaignMutation, useGetCampaignsQuery, useUpdateCampaignMutation } from "src/store/api/campaignApiSlice"
import { selectAllCampaigns } from "src/store/campaignSlice"
import { useAppSelector } from "src/store/hooks"


const testCreate = {
  campaignName: 'testero',
  description: 'testero',
  phone: '2223334444',
  displayName: 'testeroo',
  companyId: "920502eb-684b-43db-bb03-0bef5fe00ce0",
  companyName: 'Luna'
}

const testUpdate = {
  campaignName: "Chat 1",
  description: 'hello',
  phone: "9999999991",
  email: "test@prime-logix.co",
  displayName: "Chat 2",
  companyId: "920502eb-684b-43db-bb03-0bef5fe00ce0",
  companyName: 'Luna',
  campaignId: "52f6c331-85e7-40c3-b189-399bf43de7e5"
}

export default function Tester() {


  const campaigns = useAppSelector(selectAllCampaigns)

  useGetCampaignsQuery({})

  const [create] = useCreateCampaignMutation()
  const [update] = useUpdateCampaignMutation()
  const [remove] = useDeleteCampaignMutation()




  function handleCreate() {
    create(testCreate)

  }

  function handleUpdate() {
    update(testUpdate)

  }

  function handleDelete() {
    const id = "52f6c331-85e7-40c3-b189-399bf43de7e5"
    remove(id)

  }


  console.log(campaigns)



  return (
    <>
      <button onClick={handleCreate}>create</button>
      <button onClick={handleUpdate}>update</button>
      <button onClick={handleDelete}>delete</button>
    </>
  )
}
