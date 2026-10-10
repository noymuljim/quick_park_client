import { Outlet } from "react-router";
import Navbar from "../pages/shared/navbar/navbar";
import Footer from "../pages/shared/footer/footer"

const formLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default formLayout;