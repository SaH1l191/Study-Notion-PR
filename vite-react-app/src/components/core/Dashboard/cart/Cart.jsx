import React from 'react'
import { useSelector } from 'react-redux'
import RenderCartCourses from './RenderCartCourses';
import RenderTotalAmount from './RenderTotalAmont';


const Cart = () => {

  const {totalPrice,totalItems} = useSelector((state)=>state.cart);
  console.log("totalPrice",totalPrice);

  return (
    <div>
      <h1 className='text-3xl font-medium mb-14 text-richblack-5'>Your Cart</h1>
      <p className='pb-2 font-semibold border-b border-b-richblack-400 text-richblack-400'>{totalItems} Courses in Cart</p>
      {
        totalPrice > 0 ? (<div className='flex flex-col-reverse items-start mt-8 md:flex-row gap-x-10 gap-y-6'>
            <RenderCartCourses/>
            <RenderTotalAmount/>
        </div>) : (<p className='text-3xl text-center mt-14 text-richblack-200'>Your Cart is Empty</p>)
      }
    </div>
  )
}

export default Cart