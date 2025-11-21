import React from "react";
import { ThemeProvider } from "./Theme.jsx";
import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <ThemeProvider>
      <div className="h-[100vh] flex flex-col">
        {/* 导航栏 */}
        <nav className="p-3 bg-sky-200 dark:bg-blue-900">
          <Link to="/">首页</Link> |{" "}
          <Link to="/login">登录</Link> |{" "}
          <Link to="/shape">Shape</Link>
        </nav>

        {/* 子路由渲染位置 */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
}
