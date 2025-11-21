import { createBrowserRouter } from "react-router-dom";
import Main from "./pages/Main";
import LogIn from "./pages/Login";
import Shape from "./pages/Shape";
import Loading from "./pages/Loading";

const router = createBrowserRouter([
  // 打开应用时默认显示登录页
  { path: "/", element: <LogIn /> },
  { path: "/login", element: <LogIn /> },
  { path: "/loading", element: <Loading /> },
  { path: "/main", element: <Main /> },
  { path: "/shape", element: <Shape /> },
]);

export default router;

