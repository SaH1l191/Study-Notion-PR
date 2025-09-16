import React from 'react'
import ChangeProfilePicture from './ChangeProfilePicture'
import EditProfile from './EditProfile'
import ChangePassword from './ChangePassword'
import DeleteAccount from './DeleteAccount'

const Settings = () => {
  return (
    <div>
      {/* Section - 1 Heading */}
      <h1 className='text-3xl font-medium text-richblack-5 font-inter mb-14'>Edit Profile</h1>
      {/* Section -2 Change Profile Picture */}
      <ChangeProfilePicture/>
      {/* Section -3 Edit Profile Information } */}
      <EditProfile/>
      {/* Section - 4 Change password  */}
      <ChangePassword/>
      {/* Section - 5 Delete Account */}
      <DeleteAccount/>
    </div>
  )
}

export default Settings