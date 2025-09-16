import React, { useEffect, useState } from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { BsCart4 } from "react-icons/bs";
import ProfileDrop from "../core/Auth/ProfileDropDown";
import { categories } from "../../services/apis";
import { apiConnector } from "../../services/apiConnector";
import { RiArrowDropDownLine } from "react-icons/ri";

// const subLinks = [
//   {
//     title: "python",
//    link : "/catalog/python"
//   },
//    {
//     title:"web dev",
//     link : "/catalog/web-development"
//    },
// ]

const Navbar = () => {
  const { totalItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [subLinks, setSubLinks] = useState([]);
  const [isOpen, setOpen] = useState(false);

  const fetchSublinks = async () => {
    setLoading(true);
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      console.log("printing sublink result", result);
      setSubLinks(result.data.allCategories);
    } catch (error) {
      console.error(error);
      console.log("Could not fetch the Category list");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSublinks();
  }, []);

  const location = useLocation();
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };
  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 z-100">
      <div className="flex items-center justify-between w-11/12 max-w-maxContent">
        {/* Image added */}

        <div className="flex flex-row-reverse items-center justify-end gap-2 md:justify-between">
          {" "}
          <Link to="/"><img src={logo} width={160} height={32} loading="lazy" alt="logo" /></Link>

        </div>

        {/* Nav links */}
        {
          isOpen ? (<nav className={`md:hidden flex relative max-w-maxContent z-30`}>
            <ul className={` flex  gap-x-4 bg-richblack-500 absolute ${token === null ? "-left-52 " : "-left-60"} top-8 pl-4 pr-4  text-richblack-25 items-center text-md mt-2 rounded-lg z-1000`}>
              {NavbarLinks.map((element, index) => {
                return (
                  <li key={index} className="cursor-pointer">
                    {element.title === "Catalog" ? (
                      <div className="relative flex items-center group">
                        <p className="cursor-pointer" >{element.title}</p>
                        <RiArrowDropDownLine size={20} />
                        <div
                          className="invisible absolute left-[50%] top-[50%]
                                  translate-x-[-50%] translate-y-[25%] flex flex-col rounded-md 
                                  bg-richblack-5 p-4 lg:w-[300px] text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 z-50"
                        >
                          <div
                            className="absolute left-[49%] top-0 translate-x-[80%]
                                    translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5 "
                          ></div>
                          {subLinks.length ? (
                            subLinks.map((subLink, index) => (
                              <Link
                                to={`/catalog/${subLink.name
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}`}
                                className="py-4 pl-4 bg-transparent rounded-lg hover:bg-richblack-50"
                                key={index}
                              >
                                <p>{subLink.name}</p>
                              </Link>
                            ))
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Link to={element?.path}>
                        <p
                          className={`${matchRoute(element?.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                            } self-baseline`}
                        >
                          {element?.title}
                        </p>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>) : (<></>)
        }

        <nav className="hidden md:flex">
          <ul className={` flex gap-x-6 text-richblack-25 items-center`}>
            {NavbarLinks.map((element, index) => {
              return (
                <li key={index}>
                  {element.title === "Catalog" ? (
                    <div className="relative flex items-center group">
                      <p>{element.title}</p>
                      <RiArrowDropDownLine size={20} />
                      <div
                        className="invisible absolute left-[50%] -top-[120%]
                                  translate-x-[-50%] translate-y-[25%] flex flex-col rounded-md 
                                  bg-richblack-5 p-4 lg:w-[300px] text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 z-50"
                      >
                        <div
                          className="absolute left-[49%] top-0 translate-x-[80%]
                                    translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5 "
                        ></div>
                        {subLinks.length ? (
                          subLinks.map((subLink, index) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="py-4 pl-4 bg-transparent rounded-lg hover:bg-richblack-50"
                              key={index}
                            >
                              <p>{subLink.name}</p>
                            </Link>
                          ))
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={element?.path}>
                      <p
                        className={`${matchRoute(element?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                          } self-baseline`}
                      >
                        {element?.title}
                      </p>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Login,signup,dashboard buttons*/}
        <div className="flex items-center gap-x-4">
          {user && user.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative">
              <BsCart4 className="text-richblack-100" size={20} />
              {totalItems > 0 && (
                <span
                  className={`font-medium text-xs text-richblack-100 bg-[#ee5050] w-5 h-5 flex items-center justify-center rounded-full absolute -top-2 -right-3 transition-opacity duration-200
      ${totalItems > 0 ? "opacity-100 animate-bounce" : "opacity-0"}
    `}
                  aria-hidden={totalItems === 0}
                >{totalItems}
                </span>
              )}
            </Link>
          )}<div className="flex items-center gap-x-4 min-w-[120px] min-h-[40px]">
  
          {token === null && (
            <Link to="/login">
              <button className="border text-[12px] md:text-base border-richblack-700 bg-richblack-800 py-[6px] px-[8px] md:px-[12px]  md:py-[8px] text-richblack-100 rounded-md">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="border text-[12px] md:text-base border-richblack-700 bg-richblack-800 py-[6px] px-[10px] md:px-[12px]  md:py-[8px] text-richblack-100 rounded-md">
                Sign Up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDrop />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
