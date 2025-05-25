import { Bell, Search, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";  
export default function NavBar() {
  return (
    <div className="w-full bg-white shadow-md z-10 relative">
      <div className="container mx-auto w-4/5 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2 text-xl font-bold text-indigo-600">
          <Link to="/">
            <img src="/images/BrandLogo.png" alt="BrandLogo" className="h-12 w-auto" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-indigo-600 transition" />
          <UserCircle className="w-8 h-8 text-gray-600 cursor-pointer hover:text-indigo-600 transition" />
        </div>
      </div>
    </div>
  );
}
