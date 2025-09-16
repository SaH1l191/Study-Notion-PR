import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileApi";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const navigate = useNavigate();

  const getEnrolledCourses = async () => {
    try {
      const response = await getUserEnrolledCourses(token);
      setEnrolledCourses(response);
      console.log("Enroll Courses", response);
    } catch (err) {
      console.log("Unable to Fetch Enrolled Courses Data");
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);
  return (
    <div className="text-white">
      <div className="text-3xl text-richblack-50">Enrolled Courses</div>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet
        </p>
      ) : (
     

        //padiign from top and bottom  div 
        <div className="my-8 text-richblack-5">


{/* coursename duration progress heading div  */}
          <div className="flex rounded-t-lg bg-richblack-500 ">
            <div className="w-[45%] px-5 py-3">Course Name</div>
            <div className="w-1/4 px-2 py-3">Durations</div>
            <div className="flex-1 px-2 py-3">Progress</div>
          </div>
          {/* Card Section */}
          {enrolledCourses.map((course, idx, arr) => {
            return (
              <div
                key={idx}
                // to give rounded bottom corner for the last course item in list 
                className={`flex items-center border border-richblack-700 ${
                  idx === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
                }`}
              >

                {/* course name +description + image + onclick */}
                <div
                  onClick={() => {
                    navigate(
                      `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                    );
                    // fetching the first seciton and subsection bcz by default it is active 
                  }}
                  className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                >
                  <img src={course.thumbnail}
                                    alt="courseImg"
                  className="object-cover rounded-lg h-14 w-14" />

                  <div className="flex flex-col max-w-xs gap-2">
                    <p className="font-semibold">{course.courseName}</p>
                    {/* conditional rendering on description */}
                    <p className="text-xs text-richblack-300">                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}</p>
                  </div>

                </div>
                
                {/* duration section */}
                <div  className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
                {/* Progress Section */}
                <div className="flex flex-col w-1/5 gap-2 px-2 py-3">
                  <p>Progress:{course.progressPercentage || 0}%</p>
                  {/* progress bar  third party package -> ramonak/progress-bar*/}
                  <ProgressBar
                    completed={course.progressPercentage}
                    height="8px"
                    isLabelVisible={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
