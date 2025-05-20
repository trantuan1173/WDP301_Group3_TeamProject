import {
  LayoutDashboard,
  UserCog,
  BookOpen,
  Users,
  BarChart2,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", key: "overview" },
  { icon: UserCog, label: "Quản lý tài khoản", key: "account" },
  { icon: BookOpen, label: "Quản lý khóa học", key: "courses" },
  { icon: Users, label: "Quản lý lớp học", key: "classes" },
  { icon: BarChart2, label: "Thống kê", key: "statistics" },
];

export default function AdminSideMenu({ onMenuSelect, selectedKey }) {
  return (
    <div className="w-64 bg-gray-100 h-screen shadow-lg p-4">
      <h3 className="text-lg font-bold mb-6">Menu</h3>
      <ul className="space-y-2">
        {menuItems.map(({ icon: Icon, label, key }) => (
          <li
            key={key}
            onClick={() => onMenuSelect(key)}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer 
              ${selectedKey === key ? "bg-indigo-100 font-semibold" : "hover:bg-indigo-50"}`}
          >
            <Icon className="w-5 h-5 text-indigo-600" />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
