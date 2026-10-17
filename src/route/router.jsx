import { createBrowserRouter } from "react-router";
import rootLayout from "../layout/rootLayout";
import home from "../pages/Home/home";
import authLayout from "../layout/authLayout";
import login from "../pages/Auth/Login/login";
import Registration from "../pages/Auth/Registration/registration";
import formLayout from "../layout/formLayout";
import PrivateRoute from "./PrivateRoute";
import PartnerForm from "../pages/partnerForm/partnerForm";
import DashboardLayout from "../layout/dashboardLayout";
import AdminRoute from "./AdminRoute";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import PartnersApplication from "../pages/Dashboard/PartnersApplication/PartnersApplication";
import ManageMyApply from "../pages/Dashboard/ManageMyApply/ManageMyApply";
import ManageAdmin from "../pages/Dashboard/ManageAdmin/ManageAdmin";
import BookNow from "../pages/BookNow/BookNow";
import PaymentSuccess from "../pages/BookNow/PaymentSuccess";
import PaymentFaild from "../pages/BookNow/PaymentFaild";


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
        path:'/becomePartner',
        element:<PrivateRoute><PartnerForm /> </PrivateRoute>,
         loader: () => fetch('/serviceCenters.json').then(res => res.json())

      },
      {
        path:'/bookNow',
        element:<PrivateRoute><BookNow></BookNow></PrivateRoute>
      }
    ]
  },
 {
  path:'dashboard',
  element:<PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
  children:[
      {
        index: true,
        Component:DashboardHome,
      },
      {
        path:'manageAdmin',
        element: <AdminRoute><ManageAdmin></ManageAdmin></AdminRoute>
      },
      {
        path:'PartnersApplication',
        element:<AdminRoute><PartnersApplication></PartnersApplication></AdminRoute>
      },
      {
        path:'ManageMyApply',
        Component: ManageMyApply
      },
      {
        path:'payment-success',
        Component:PaymentSuccess
      },
      {
        path:'payment-cancelleds',
        Component:PaymentFaild
      }
  ]
 }
]);