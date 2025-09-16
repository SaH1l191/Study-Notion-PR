import React from "react";
import { FooterLink2 } from "../../data/footer-links";
import { Link } from "react-router-dom";

// Images
import Logo from "../../assets/Logo/Logo-Full-Light.png";

// Icons
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles", "Blog", "Chart Sheet", "Code challenges",
  "Docs", "Projects", "Videos", "Workspaces"
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = () => {
  return (
    <footer className="bg-richblack-800 text-richblack-400 text-sm">
      {/* Top Grid */}
      <div className="w-11/12 max-w-maxContent mx-auto py-14 border-b border-richblack-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {/* Company */}
            <div>
              <img
                src={Logo}
                alt="Company Logo"
                className="h-10 w-auto mb-4 object-contain"
                width={160}
                height={32}
              />
              <h2 className="text-richblack-50 font-semibold mb-2">Company</h2>
              <ul className="space-y-1">
                {["About", "Careers", "Affiliates"].map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={`/${item.toLowerCase()}`}
                      className="hover:text-richblack-50 transition duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex gap-3 mt-4 text-lg">
                <FaFacebook />
                <FaGoogle />
                <FaTwitter />
                <FaYoutube />
              </div>
            </div>

            {/* Resources */}
            <div>
              <h2 className="text-richblack-50 font-semibold mb-2">Resources</h2>
              <ul className="space-y-1">
                {Resources.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="hover:text-richblack-50 transition duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>

              <h2 className="text-richblack-50 font-semibold mt-5 mb-2">Support</h2>
              <Link
                to="/help-center"
                className="hover:text-richblack-50 transition duration-200"
              >
                Help Center
              </Link>
            </div>

            {/* Plans & Community */}
            <div>
              <h2 className="text-richblack-50 font-semibold mb-2">Plans</h2>
              <ul className="space-y-1">
                {Plans.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="hover:text-richblack-50 transition duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>

              <h2 className="text-richblack-50 font-semibold mt-5 mb-2">
                Community
              </h2>
              <ul className="space-y-1">
                {Community.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="hover:text-richblack-50 transition duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Side - FooterLink2 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {FooterLink2.map((section, i) => (
              <div key={i}>
                <h2 className="text-richblack-50 font-semibold mb-2">
                  {section.title}
                </h2>
                <ul className="space-y-1">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        to={link.link}
                        className="hover:text-richblack-50 transition duration-200"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-11/12 max-w-maxContent mx-auto py-4 flex flex-col lg:flex-row items-center justify-between">
        {/* Bottom Links */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3 lg:mb-0">
          {BottomFooter.map((item, idx) => (
            <Link
              key={idx}
              to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
              className={`hover:text-richblack-50 transition duration-200 ${
                idx < BottomFooter.length - 1 ? "border-r pr-3 border-richblack-700" : ""
              } pl-3`}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Credit */}
        <div className="text-center text-xs text-richblack-400">
          Made with ❤ by Sahil Haldankar
        </div>
      </div>
    </footer>
  );
};

export default Footer;
