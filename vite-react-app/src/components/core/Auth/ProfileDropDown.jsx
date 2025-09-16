import { useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import useOnClickOutside from "../../../hooks/useClick"
import { logout } from "../../../services/operations/authApi"


const ProfileDropDown = () => {

  const {user}  = useSelector(state=>state.profile)
  const {token} = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  useOnClickOutside(ref, () => setOpen(false))

  if(!user ) return null



  return (
    <button className="relative" onClick={()=>setOpen(true)}>
      <div className="flex items-center gap-x-1">
        <img src={user?.image} className="aspect-square w-[30px] rounded-full object-cover"/>
        <AiOutlineCaretDown className="text-sm text-richblack-100"/>
      </div>
      {open && (
        <div onClick={(e)=>e.stopPropagation()} ref={ref}
        className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800">
          <Link to="/dashboard/my-profile" onClick={()=>setOpen(false)}
         >
            <div className="flex w-full text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25 items-center ga-x-1 px-[10px] py-[10px]">
            <VscDashboard className="text-lg" />
            Dashboard
            </div>
          </Link>
          <div onClick={()=>{setOpen(false); dispatch(logout(navigate))}}
            className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
            <VscSignOut className="text-lg"/>Logout
          </div>
        </div>
      )}

    </button>
  )
}

export default ProfileDropDown
