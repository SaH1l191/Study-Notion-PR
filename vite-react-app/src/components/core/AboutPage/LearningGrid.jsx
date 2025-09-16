import React from 'react'
import LearningGridData from '../../../data/LearningGridData'
import CTAButton from "../../../components/core/HomePage/Button"
import HighlightText from '../HomePage/HighlightText'


const LearningGrid = () => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 mx-auto mb-12 w-[1200px] '>
      {
        // first grid item will take 2col span and 3rd grid item will start from 2nd position as left part is empty 
        LearningGridData.map((card, index) => {
            return (
            <div key={index}
            className ={`${index===0  &&  "lg:col-span-2 h-[294px]"}
             ${card.order % 2 ==1  ?  ( "bg-richblack-700 h-[294px]") :
                card.order%2 ==0 ? "bg-richblack-800 h-[294px]" : "bg-transparent"
                 }
              ${card.order ===3 && "lg:col-start-2"}`}>
                {   
                        card.order < 0 ? (
                            <div className='p-8  lg:w-[90%] flex flex-col pb-10 gap-3'>
                               <div className='text-4xl font-semibold'>
                                  {card.heading}
                                  <HighlightText text={card.highlightText} />
                               </div>
                               <p className='text-richblack-400 font-medium'>
                                    {card.description}
                                </p>
                                <div className='w-fit'>
                                    <CTAButton active={true} linkto={card.BtnLink} >
                                        {card.BtnText}
                                    </CTAButton>
                                </div>      
                            </div>
                        ) : 
                        (
                        <div className='p-8 flex flex-col gap-8'>
                            <h1 className='text-richblack-5 text-lg'>{card.heading}</h1>
                            <p className='text-richblack-300 font-medium'>{card.description}</p>
                        </div>
                        )
                }

            </div>

        ) })
      }
    </div>
  )
}

export default LearningGrid
