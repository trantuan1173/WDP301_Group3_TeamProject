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
    <div className="w-full bg-white shadow-md z-10 relative">
      <div className="container mx-auto w-4/5 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2 text-xl font-bold text-indigo-600">
          <Link to="/">
            <img src="/images/BrandLogo.png" alt="BrandLogo" className="h-12 w-auto" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
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
                <div onClick={() => setShowDropdown(!showDropdown)} className="cursor-pointer">
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
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-20">
                    <Link
                      to="/user"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      User Page
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
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