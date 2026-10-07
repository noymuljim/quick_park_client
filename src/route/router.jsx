import { createBrowserRouter } from "react-router";
import rootLayout from "../layout/rootLayout";
import home from "../pages/Home/home";
import authLayout from "../layout/authLayout";
import login from "../pages/Auth/Login/login";
import Registration from "../pages/Auth/Registration/registration";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: rootLayout,
    children: [
      {
        index: true,
        Component: home
      },

    ]
  },
  {
    path: '/',
    Component: authLayout,
    children: [
      {
        path: 'login',
        Component: login
      },
      {
        path: 'register',
        Component: Registration

      }
    ]
  },
]);