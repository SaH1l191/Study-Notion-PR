import { Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";
import "./App.css";
import { ACCOUNT_TYPE } from "./Util/constants";
import { useSelector } from "react-redux";

// Lazy load all components and pages
const Home = React.lazy(() => import("./Pages/Home"));
const Navbar = React.lazy(() => import("./Component/Common/Navbar"));
const OpenRoute = React.lazy(() => import("./Component/Core/Auth/OpenRoute"));
const ProtectedRoute = React.lazy(() => import("./Component/Core/Auth/PrivateRoute"));

const Login = React.lazy(() => import("./Pages/Login"));
const SignUp = React.lazy(() => import("./Pages/Signup"));
const ForgotPassword = React.lazy(() => import("./Pages/ForgotPassword"));
const UpdatePassword = React.lazy(() => import("./Pages/UpdatePassword"));
const VerifyEmail = React.lazy(() => import("./Pages/VerifyEmail"));

const About = React.lazy(() => import("./Pages/About"));
const Contact = React.lazy(() => import("./Pages/Contact"));
const Catalog = React.lazy(() => import("./Pages/Catalog"));
const CourseDetails = React.lazy(() => import("./Pages/CourseDetails"));
const ViewCourse = React.lazy(() => import("./Pages/ViewCourse"));
const Dashboard = React.lazy(() => import("./Pages/Dashboard"));
const Error = React.lazy(() => import("./Pages/Error"));

const Settings = React.lazy(() => import("./Component/Core/Dashboard/Settings"));
const MyProfile = React.lazy(() => import("./Component/Core/Dashboard/MyProfile"));
const EnrolledCourses = React.lazy(() => import("./Component/Core/Dashboard/EnrolledCourses"));
const Cart = React.lazy(() => import("./Component/Core/Dashboard/Cart"));
const AddCourse = React.lazy(() => import("./Component/Core/Dashboard/AddCourse"));
const MyCourses = React.lazy(() => import("./Component/Core/Dashboard/MyCourses"));
const EditCourse = React.lazy(() => import("./Component/Core/Dashboard/EditCourse/EditCourse"));
const Instructor = React.lazy(() => import("./Component/Core/Dashboard/InstructorDashboard/InstructorChart"));
const VideoDetails = React.lazy(() => import("./Component/Core/ViewCourse/VideoDetails"));

function App() {
  const { user } = useSelector((state) => state.profile);

  return (
    <div className="flex flex-col w-screen min-h-screen bg-richblack-900 font-inter">
      <Suspense fallback={<div className="grid flex-1 place-items-center"><div className="spinner"></div></div>}>
        <Navbar />
      </Suspense>

      <Suspense fallback={<div className="grid flex-1 place-items-center"><div className="spinner"></div></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog/:catalogName" element={<Catalog />} />
          <Route path="/courses/:courseId" element={<CourseDetails />} />

          <Route
            path="/login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/forgot-password"
            element={
              <OpenRoute>
                <ForgotPassword />
              </OpenRoute>
            }
          />
          <Route
            path="/update-password/:id"
            element={
              <OpenRoute>
                <UpdatePassword />
              </OpenRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <OpenRoute>
                <VerifyEmail />
              </OpenRoute>
            }
          />
          <Route
            path="/about"
            element={
              <OpenRoute>
                <About />
              </OpenRoute>
            }
          />
          <Route path="/contact" element={<Contact />} />

          {/* Dashboard Routes */}
          <Route
            element={
              <Suspense fallback={<div className="grid flex-1 place-items-center"><div className="spinner"></div></div>}>
                <Dashboard />
              </Suspense>
            }
          >
            <Route
              path="/dashboard/my-profile"
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard/settings" element={<Settings />} />

            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route
                  path="/dashboard/enrolled-courses"
                  element={<EnrolledCourses />}
                />
                <Route path="/dashboard/cart" element={<Cart />} />
              </>
            )}

            {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="/dashboard/add-course" element={<AddCourse />} />
                <Route path="/dashboard/my-courses" element={<MyCourses />} />
                <Route
                  path="/dashboard/edit-course/:courseId"
                  element={<EditCourse />}
                />
                <Route path="/dashboard/instructor" element={<Instructor />} />
              </>
            )}
          </Route>

          {/* View Course Routes */}
          <Route
            element={
              <ProtectedRoute>
                <ViewCourse />
              </ProtectedRoute>
            }
          >
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            )}
          </Route>

          {/* Error / 404 */}
          <Route
            path="*"
            element={
              <Suspense fallback={<div className="w-full h-full spinner"></div>}>
                <Error />
              </Suspense>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
