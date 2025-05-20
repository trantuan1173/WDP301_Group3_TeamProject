import { Bell, Search, UserCircle } from "lucide-react";

export default function NavBar() {
  return (
    <div className="flex items-center justify-between bg-white px-6 py-3 shadow-md">
      <div className="flex items-center gap-2 text-xl font-bold text-indigo-600">
        <img src="/images/logo.png" alt="Logo" className="h-8" />
        SMART ENGLISH CENTER
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
        <UserCircle className="w-8 h-8 text-gray-600 cursor-pointer" />
      </div>
    </div>
  );
}
