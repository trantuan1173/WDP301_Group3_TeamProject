import { Bell, Search, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // đường dẫn tùy vào cấu trúc của bạn
import { useState, useEffect, useRef } from "react";

export default function NavBar() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full bg-white shadow-md z-10 relative  ">
      <div className="container mx-auto w-4/5 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2 text-xl font-bold text-indigo-600">
          <Link to="/">
            <img
              src="/images/BrandLogo.png"
              alt="BrandLogo"
              className="h-12 w-auto"
            />
          </Link>
        </div>

        <div className="flex items-center gap-7 ">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {user ? (
            <>
              <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-indigo-600 transition" />
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="cursor-pointer"
                >
                  {user?.profile?.imageURL ? (
                    <img
                      src={user.profile.imageURL}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-12 h-12 text-gray-600 hover:text-indigo-600 transition" />
                  )}
                </div>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    <Link   to="/dashboard/profile"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 no-underline transition-colors duration-200 ease-in-out hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setShowDropdown(false)}
                   
                    >
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm1 2H9a4 4 0 00-4 4v1h10v-1a4 4 0 00-4-4z" />
                      </svg>
                      My Profile
                    </Link>

                    <Link
                     to="/user"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 no-underline transition-colors duration-200 ease-in-out hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setShowDropdown(false)}
                    >
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1 0v12h12V4H4zm2 2h8v2H6V6z" />
                      </svg>
                      User Page
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 no-underline transition-colors duration-200 ease-in-out hover:bg-red-50 hover:text-red-700"
                    >
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h6a1 1 0 010 2H5v10h5a1 1 0 110 2H4a1 1 0 01-1-1V4zm12.293 3.293a1 1 0 010 1.414L13.414 11H17a1 1 0 110 2h-3.586l1.879 1.879a1 1 0 01-1.414 1.414l-3.586-3.586a1 1 0 010-1.414l3.586-3.586a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-indigo-900 text-white text-lg font-bold px-4 py-2 rounded-xl shadow hover:bg-indigo-800 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="ml-2 bg-indigo-900 text-white text-lg font-bold px-4 py-2 rounded-xl shadow hover:bg-indigo-800 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
