import React from 'react'
import ContactUsForm from '../../contactPage/ContactUsForm'


const ContactFormSection = () => {
  return (
    <div className='mx-auto font-inter'>
      <h1 className='text-4xl font-semibold tracking-tight text-center text-richblack-5'>Get in Touch</h1>
      <p className='self-stretch mt-3 text-base font-medium text-center text-richblack-300'>We&apos;d love to here for you, Please fill out this form.</p>
      <div className='mx-auto mt-12'>
        <ContactUsForm/>
      </div>
    </div>
  )
}

export default ContactFormSection