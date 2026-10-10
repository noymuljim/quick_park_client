import { createBrowserRouter } from "react-router";
import rootLayout from "../layout/rootLayout";
import home from "../pages/Home/home";
import authLayout from "../layout/authLayout";
import login from "../pages/Auth/Login/login";
import Registration from "../pages/Auth/Registration/registration";
import formLayout from "../layout/formLayout";
import PrivateRoute from "./PrivateRoute";
import PartnerForm from "../pages/partnerForm/partnerForm";
import UserManagement from "../pages/Dashboard/UserManagement/userManagement";
import DashboardLayout from "../layout/dashboardLayout";
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
  {
    path:'/',
    Component:formLayout,
    children:[
      {
        path:'becomePartner',
        element:<PrivateRoute><PartnerForm /> </PrivateRoute>,
         loader: () => fetch('/serviceCenters.json').then(res => res.json())

      }
    ]
  },
 {
  path:'dashboard',
  element:<PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
  children:[
      {
        index: true,
        Component: UserManagement
      }
  ]
 }
]);