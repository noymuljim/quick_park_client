import { Link, NavLink } from "react-router";
import Logo from "../../../components/logo/Logo";
import useAuth from "../../../Hooks/useAuth";
import userLogo from "../../../assets/u.jpg";
import { IoMenu } from "react-icons/io5";
import { FiLogOut, FiLayout } from "react-icons/fi";

const Navbar = () => {
    const { user, LogOut } = useAuth();

    const handleLogout = () => {
        LogOut()
            .then((result) => console.log(result.user))
            .catch((error) => console.log(error));
    };

    const closeMenu = () => document.activeElement?.blur();

    const linkClass = ({ isActive }) =>
        `flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-secondary bg-base-100 font-semibold transition-all duration-300 ${
            isActive
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "text-base-content/80 hover:bg-base-content/10 hover:text-base-content"
        }`;

    const links = (
        <li>
            <NavLink
                to="/dashboard"
                end
                onClick={closeMenu}
                className={linkClass}
            >
                <FiLayout size={16} />
                Dashboard
            </NavLink>
        </li>
    );

    return (
        <header className="pointer-events-none sticky top-0 z-[2000] -mb-20 w-full px-3 pt-3 sm:px-5 sm:pt-4">
            <nav className="pointer-events-auto mx-auto flex w-full max-w-7xl items-center justify-between rounded-full  bg-black/20 px-3 py-3 text-white shadow-none backdrop-blur-md sm:px-6">

            
                <div className="flex items-center gap-2">
                    {user && (
                        <div className="dropdown dropdown-bottom lg:hidden">
                            <button
                                tabIndex={0}
                                className="btn btn-circle btn-ghost"
                                aria-label="Open navigation menu"
                            >
                                <IoMenu size={23} />
                            </button>

                            <ul
                                tabIndex={-1}
                                className="menu dropdown-content z-50 mt-3 w-56 rounded-2xl border border-base-content/10 bg-base-100 p-3 text-base-content shadow-xl"
                            >
                                {links}
                            </ul>
                        </div>
                    )}

                    <Logo />
                </div>

               
                <div className="flex items-center gap-2 sm:gap-3">
                    {user ? (
                        <>
                            <ul className="menu menu-horizontal hidden p-0 lg:flex">
                                {links}
                            </ul>

                            <div className="hidden h-8 w-px bg-base-content/15 sm:block" />

                            <button
                                onClick={handleLogout}
                                className="group flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-black transition-all duration-300 hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20 sm:px-5"
                            >
                                <FiLogOut size={16} />
                                <span>Log Out</span>
                            </button>

                            <div className="rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-0.5">
                                <div className="h-9 w-9 overflow-hidden rounded-full bg-base-200">
                                    <img
                                        src={user.photoURL || userLogo}
                                        alt="User profile"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-black transition-all duration-300 hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20"
                        >
                            Log in
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;