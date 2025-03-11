// components/Sidebar.tsx
"use client";

import React, { useState } from "react";

interface SidebarProps {
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`bg-gradient-to-r from-green-400 to-blue-500 text-white flex-shrink-0 transition-all duration-300 ease-in-out relative ${
        // Thêm gradient
        // Thêm relative
        collapsed ? "w-16" : "w-64"
      } overflow-hidden`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="cursor-pointer absolute top-5 right-2 left-2 p-2 bg-indigo-700 rounded-full hover:bg-indigo-600 focus:outline-none z-10" // Thêm z-10
      >
        {collapsed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        )}
      </button>

      <div className="h-16 flex items-center justify-center">
        <span
          className={`text-2xl font-semibold ${collapsed ? "hidden" : ""}`}
        ></span>
      </div>
      <nav className="mt-5">
        <ul>
          <li
            className="p-4 hover:bg-indigo-700 cursor-pointer"
            onClick={() => onNavigate("products")}
          >
            <span className={`block ${collapsed ? "hidden" : ""}`}>
              Quản lý sản phẩm
            </span>
            {collapsed && <span className="block">SP</span>}
          </li>
          <li
            className="p-4 hover:bg-indigo-700 cursor-pointer"
            onClick={() => onNavigate("brands")}
          >
            <span className={`block ${collapsed ? "hidden" : ""}`}>
              Quản lý thương hiệu
            </span>
            {collapsed && <span className="block">TH</span>}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
