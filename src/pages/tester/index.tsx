import { useCreateCampaignMutation, useDeleteCampaignMutation, useGetCampaignsQuery, useUpdateCampaignMutation } from "src/store/api/campaignApiSlice"
import { useCreateCompanyMutation, useDeleteCompanyMutation, useDisableCompanyMutation, useEnableCompanyMutation, useGetCompaniesQuery, useUpdateCompanyMutation } from "src/store/api/companyApiSlice"
import { selectAllCampaigns } from "src/store/campaignSlice"
import { selectAllCompanies } from "src/store/companySlice"
import { useAppSelector } from "src/store/hooks"
import { selectProfileById } from "src/store/profileSlice"


const testCreate = {

  name: "Testeroo",
  phone: "777-333-0000"

}

const testUpdate = {
  name: "Testerooop",
  phone: "000-999-3333",
  email: "test@prime.com",
  address1: "ad 1",
  address2: "ad 2",
  city: "city",
  state: "ca",
  zipcode: "92613",
  parentCompanyId: "920502eb-684b-43db-bb03-0bef5fe00ce0",
  parentCompanyName: "Luna",
  companyId: "4a8f69db-da9a-43c2-b85b-44d7657e7df7"
}

export default function Tester() {

  const id = "1327485548"


  const profile = useAppSelector((state) => selectProfileById(state, id))


  // GET REQUESTS

  const { data: profileInfo } = useGet




  useGetCompaniesQuery({})

  const [create] = useCreateCompanyMutation()
  const [update] = useUpdateCompanyMutation()
  const [enable] = useEnableCompanyMutation()
  const [disable] = useDisableCompanyMutation()




  function handleCreate() {
    create(testCreate)

  }

  function handleUpdate() {
    update(testUpdate)

  }

  function handleEnable() {
    const companyId = "4a8f69db-da9a-43c2-b85b-44d7657e7df7"
    enable(companyId)

  }

  function handleDisable() {
    const companyId = "4a8f69db-da9a-43c2-b85b-44d7657e7df7"
    disable(companyId)

  }


  console.log(companies)



  return (
    <>
      <button onClick={handleCreate}>create</button>
      <button onClick={handleUpdate}>update</button>
      <button onClick={handleEnable}>delete</button>
      <button onClick={handleDisable}>delete</button>
    </>
  )
}

// export default function Tester() {


//   const companies = useAppSelector(selectAllCompanies)


//   useGetCompaniesQuery({})

//   const [create] = useCreateCompanyMutation()
//   const [update] = useUpdateCompanyMutation()
//   const [enable] = useEnableCompanyMutation()
//   const [disable] = useDisableCompanyMutation()




//   function handleCreate() {
//     create(testCreate)

//   }

//   function handleUpdate() {
//     update(testUpdate)

//   }

//   function handleEnable() {
//     const companyId = "4a8f69db-da9a-43c2-b85b-44d7657e7df7"
//     enable(companyId)

//   }

//   function handleDisable() {
//     const companyId = "4a8f69db-da9a-43c2-b85b-44d7657e7df7"
//     disable(companyId)

//   }


//   console.log(companies)



//   return (
//     <>
//       <button onClick={handleCreate}>create</button>
//       <button onClick={handleUpdate}>update</button>
//       <button onClick={handleEnable}>delete</button>
//       <button onClick={handleDisable}>delete</button>
//     </>
//   )
// }
