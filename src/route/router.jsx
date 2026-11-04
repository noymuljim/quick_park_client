import { createBrowserRouter } from "react-router";
import rootLayout from "../layout/rootLayout";
import Home from "../pages/Home/home";
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
import ManageMyBooking from "../pages/Dashboard/ManageMyBooking/ManageMyBooking";
import UpcomingRequests from "../pages/Dashboard/Admin/UpcomingRequests/UpcomingRequests";
import MyBookingHistory from "../pages/Dashboard/MyBookingHistory/MyBookingHistory";
import PartnerRoute from "./PartnerRoute";
import AdminOverview from "../pages/Dashboard/DashboardHome/AdminOverview";
import PartnerOverview from "../pages/Dashboard/DashboardHome/PartnerOverview";
import ManageDisableReq from "../pages/Dashboard/Admin/ManageDisableReq/ManageDisableReq";
import UserRoute from "./UserRoute";
import UserOverview from "../pages/Dashboard/DashboardHome/UserOverview";
import Profile from "../pages/Dashboard/Profile/Profile";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: rootLayout,
    children: [
      {
        index: true,
        Component: Home
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
    path: '/',
    Component: formLayout,
    children: [
      {
        path: '/becomePartner',
        element: <PrivateRoute><PartnerForm /> </PrivateRoute>,
        loader: () => fetch('/serviceCenters.json').then(res => res.json())

      },
      {
        path: '/bookNow',
        element: <PrivateRoute><BookNow></BookNow></PrivateRoute>
      }
    ]
  },
  {
    path: 'dashboard',
    element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: 'manageAdmin',
        element: <AdminRoute><ManageAdmin></ManageAdmin></AdminRoute>
      },
      {
        path: 'Profile',
        element: <Profile></Profile>
      },
      {
        path: 'PartnersApplication',
        element: <AdminRoute><PartnersApplication></PartnersApplication></AdminRoute>
      },

      {
        path: 'UpcomingRequests',
        element: <PartnerRoute><UpcomingRequests></UpcomingRequests></PartnerRoute>
      },
     
    
      {
        path:'adminOverview',
        element:<AdminRoute><AdminOverview></AdminOverview></AdminRoute>
      },
      {
        path:'ManageDisableReq',
        element:<AdminRoute><ManageDisableReq></ManageDisableReq></AdminRoute>
      },
      {
        path:'partnerOverview',
        element:<PartnerRoute><PartnerOverview></PartnerOverview></PartnerRoute>
      },
      {
        path:'userOverview',
        element:<UserRoute><UserOverview></UserOverview></UserRoute>
      },
      {
        path: 'ManageMyApply',
        Component: ManageMyApply
      },
      {
        path: 'ManageMyBooking',
        Component: ManageMyBooking
      },
      {
        path: 'MyBookingHistory',
        Component: MyBookingHistory
      },
      {
        path: 'payment-success',
        Component: PaymentSuccess
      },
      {
        path: 'payment-cancelleds',
        Component: PaymentFaild
      }
    ]
  }
]);