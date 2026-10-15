
import { NavLink, Outlet } from "react-router";
import useRole from "../Hooks/useRole";
import L from "../assets/logo.png"
import { MdVerifiedUser } from "react-icons/md";
import { FaRegHandshake } from "react-icons/fa";
import { FaArrowsLeftRight, FaUserPen } from "react-icons/fa6";
import { FiHome } from "react-icons/fi";

const DashboardLayout = () => {
    const { role } = useRole();

    const linkStyle = ({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200
        ${
            isActive
                ? "bg-primary text-black"
                : "text-base-content/70 hover:bg-primary/10 hover:text-primary"
        }`;

    return (
        <div className="drawer lg:drawer-open min-h-screen bg-base-100">
            <input
                id="my-drawer-4"
                type="checkbox"
                className="drawer-toggle"
            />

            {/* Main content */}
            <div className="drawer-content">
                <nav className="navbar sticky top-0 z-30 min-h-16 border-b border-base-300 bg-base-100 px-4 sm:px-6">
                    <label
                        htmlFor="my-drawer-4"
                        aria-label="open sidebar"
                        className="btn btn-square btn-ghost rounded-xl text-xl"
                    >
                      <FaArrowsLeftRight />
                    </label>

                    <div className="ml-3 text-lg font-extrabold tracking-tight">
                        Dashboard
                        <span className="ml-1 text-primary">.</span>
                    </div>
                </nav>

                {/* Page content */}
                <div className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </div>

            {/* Sidebar - original drawer system preserved */}
            <div className="drawer-side is-drawer-close:overflow-visible">
                <label
                    htmlFor="my-drawer-4"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                />

                <div className="flex min-h-full flex-col items-start border-r border-base-300 bg-base-100 is-drawer-close:w-16 is-drawer-open:w-64">

                    {/* Sidebar title */}
                    <div className="flex h-16 w-full items-center gap-3 border-b border-base-300 px-4">
                        <div className=" size-9 shrink-0 bg-white rounded-xl">
                           <img src={L} alt="" />
                        </div>

                        <span className="text-lg font-extrabold is-drawer-close:hidden">
                            Quick<span className="text-primary pl-1">P</span>ark
                        </span>
                    </div>

                    <ul className="menu w-full grow gap-2 p-3">
                        {/* Homepage */}
                        <li>
                            <NavLink
                                to="/"
                                end
                                className={linkStyle}
                                data-tip="Homepage"
                            >
                                <FiHome className="shrink-0 text-lg" />
                                <span className="is-drawer-close:hidden">
                                    Homepage
                                </span>
                            </NavLink>
                        </li>

                        {/* User and partner */}
                        {(role === "partner" || role === "user") && (
                            <li>
                                <NavLink to="/dashboard/ManageMyApply"
                                    className={linkStyle}
                                    data-tip="Manage my apply"
                                >
                                    <FaUserPen className="shrink-0 text-lg" />
                                    <span className="is-drawer-close:hidden">
                                        Manage my apply
                                    </span>
                                </NavLink>
                            </li>
                        )}

                        {/* Admin */}
                        {role === "admin" && (
                            <>
                                <li>
                                    <NavLink
                                        to="/dashboard/manageAdmin"
                                        className={linkStyle}
                                        data-tip="Manage admin"
                                    >
                                        <MdVerifiedUser className="shrink-0 text-lg" />
                                        <span className="is-drawer-close:hidden">
                                            Manage admin
                                        </span>
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/dashboard/PartnersApplication"
                                        className={linkStyle}
                                        data-tip="Partners application"
                                    >
                                        <FaRegHandshake className="shrink-0 text-lg" />
                                        <span className="is-drawer-close:hidden">
                                            Partners application
                                        </span>
                                    </NavLink>
                                </li>
                            </>
                        )}

                       
                      
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
