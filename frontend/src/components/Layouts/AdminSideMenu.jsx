import {
  LayoutDashboard,
  UserCog,
  BookOpen,
  Users,
  BarChart2,
  ClipboardPlus,
  PenLine,
  MessagesSquare
 } from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", key: "overview" },
  { icon: UserCog, label: "Mangage Account", key: "account" },
  { icon: BookOpen, label: "Manage Courses", key: "courses" },
  { icon: Users, label: "Manage Classes", key: "classes" },
  { icon: ClipboardPlus, label: "Manage Enrollments", key: "enrollment" },
  { icon: BarChart2, label: "Statistics", key: "statistics" },
  { icon: PenLine  , label: "Customer Consulting", key: "customerConsulting" },
  { icon: MessagesSquare  , label: "Feedback", key: "feedback" },
];

export default function AdminSideMenu({ onMenuSelect, selectedKey }) {
  return (
    <div className="w-64 bg-gray-100 h-screen shadow-lg ">
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
