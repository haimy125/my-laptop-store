import React from "react";

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 flex-shrink-0">
      <div className="h-16 flex items-center justify-center">
        <span className="text-2xl font-semibold">My App</span>
      </div>
      <nav className="mt-5">
        <ul>
          <li className="p-4 hover:bg-gray-700">
            <a href="#" className="block">
              Overview
            </a>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <a href="#" className="block">
              Reports
            </a>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <a href="#" className="block">
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
