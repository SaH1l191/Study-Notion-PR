import React, { useState } from 'react'
import {HomePageExplore} from "../../../data/homepage-explore";
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths"
];

const ExploreMore = () => {

  const [currentTab,setCurrentTab] = useState(tabsName[0]);
  const [courses,setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard,setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

  const setMyCards = (value)=>{
    setCurrentTab(value);
    const result = HomePageExplore.filter((course)=>course.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  }

  // Find the max number of courses in any tab to reserve space
  const maxCourses = Math.max(...HomePageExplore.map(tab => tab.courses.length));

  return (
    <div className='relative w-full py-16 md:py-24'>
      <div className='text-4xl font-semibold items-stretch md:text-center'>
        Unlock the <HighlightText text={"Power of Code"}/>
      </div>
      <p className='text-lg items-stretch md:text-center mt-3 font-semibold text-richblack-300'>
        Learn to Build Anything You Can Imagine
      </p>
      <div className='flex flex-col md:flex-row w-[50%] md:w-fit mx-auto items-center justify-center rounded-full bg-richblack-800 mt-5 mb-8 border-richblack-100 md:px-2 py-1'>
        {
          tabsName.map((element,index)=>(
            <div className={`text-xs md:text-[16px] flex items-center justify-between md:gap-2 
              ${currentTab === element ? "bg-richblack-900 text-richblack-5 font-medium" : "text-richblack-200"} rounded-full transition-all duration-200 cursor-pointer 
              hover:bg-richblack-500 hover:text-richblack-5 px-1 md:px-7 py-2`} key={index}
              onClick={()=>{setMyCards(element)}}>
              {element}
            </div>
          ))
        }
      </div>
      {/* Reserve space for cards */}
      <div
        className='flex flex-col md:flex-row items-center gap-3 md:gap-8 w-[90%] md:w-full mx-auto transition-all duration-300'
        style={{
          minHeight: `320px`, // Adjust based on your card height
        }}
      >
        {
          courses.map((element,index) => (
            <CourseCard key={index} cardData={element} currentCard={currentCard} setCurrentCard={setCurrentCard} />
          ))
        }
        {/* Render invisible placeholders to reserve space for max cards */}
        {Array.from({length: maxCourses - courses.length}).map((_, idx) => (
          <div key={idx} className="opacity-0 pointer-events-none">
            <CourseCard cardData={{}} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExploreMore