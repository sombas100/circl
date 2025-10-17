import React from "react";
import { Link } from "react-router-dom";
import logo from "../../public/circl-logo.png";

const Sidebar = () => {
  return (
    <aside className="w-64 shrink-0 border-r bg-white h-screen sticky top-0">
      <nav className="p-6">
        <div className="flex items-center justify-center">
          <img className="pb-8 " src={logo} alt="circle logo" />
        </div>
        <ul className="flex flex-col justify-center items-center gap-4">
          <li>
            <Link className="hover:text-sky-600 font-medium" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="hover:text-sky-600 font-medium" to="/friends">
              Friends
            </Link>
          </li>
          <li>
            <button className="text-left hover:text-red-600 font-medium">
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
