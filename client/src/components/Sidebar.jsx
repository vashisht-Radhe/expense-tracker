import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  ArrowLeftRight,
  FolderKanban,
  BarChart3,
  UserCircle,
  LogOut,
  X,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  {
    name: "Dashboard",
    to: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Transactions",
    to: "/transactions",
    icon: <ArrowLeftRight size={20} />,
  },
  {
    name: "Category",
    to: "/category",
    icon: <FolderKanban size={20} />,
  },
  {
    name: "Analytics",
    to: "/analytics",
    icon: <BarChart3 size={20} />,
  },
];

const Sidebar = ({ onClose, openProfile }) => {

  return (
    <aside className=" flex h-screen w-full sm:w-60 shrink-0 flex-col border-r border-border-light bg-surface p-6">
      <div className="mb-10 flex items-center justify-between md:justify-start gap-3 px-1">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-secondary text-white shadow-sm">
            F
          </div>

          <span className="text-lg font-bold text-heading">FinTrack</span>
        </div>

        <button onClick={onClose} className="md:hidden">
          <X />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-text-secondary hover:bg-background hover:text-heading"
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border-light pt-4">
        <button
          onClick={openProfile}
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors
                 text-text-secondary hover:bg-background hover:text-heading"
        >
          <UserCircle size={20} />
          Profile
        </button>

        <button
          type="button"
          className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-secondary-light hover:text-secondary-hover"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
