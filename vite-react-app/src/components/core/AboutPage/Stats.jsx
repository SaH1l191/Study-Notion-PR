import React from 'react'

const Stats = () => {

  const statsData = [
    { count:"5k",label:"Active Students"},
    { count:"10+",label:"Mentors"},
    { count:"200+",label:"Courses"},
    { count:"50+",label:"Awards"},
  ]
  return (
    <section  className='bg-richblack-700 '>
         <div className='flex flex-col justify-between w-11/12 gap-10 mx-auto text-white max-w-maxContent '>
           <div className='flex flex-col justify-between gap-10 text-center md:flex-row'>
            {
               statsData.map((data,index)=>{
                return (
                  <div key={index} className="flex flex-col py-10">
                    <h1 className="text-3xl font-bold text-richblack-5">{data.count}</h1>
                    <p className="font-semibold text-md text-richblack-500">{data.label}</p>
                  </div>
                )
               })
            }
           </div>
         </div>
    </section>
  )
}

export default Stats