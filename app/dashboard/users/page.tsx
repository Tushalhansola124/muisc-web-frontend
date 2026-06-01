import { UsersTable } from "../../../components/user-module/user-view"


const User = () => {
  return (
    <>
    <div>
      <h1 className='text-2xl pb-2  font-bold'>Users List</h1>
        <UsersTable/>
    </div>
    </>
  )
}

export default User