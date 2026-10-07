import { Outlet } from "react-router";
import Navbar from "../pages/shared/navbar/navbar";
import Footer from "../pages/shared/footer/footer";

const rootLayout = () => {
    return (
        <div >
            <Navbar />
           
             <Outlet />
          
            <Footer />
        </div>
    );
};

export default rootLayout;

