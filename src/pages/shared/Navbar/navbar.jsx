import { Link, NavLink } from "react-router";
import Logo from "../../../components/logo/Logo";
import useAuth from "../../../Hooks/useAuth";
import userLogo from "../../../assets/u.jpg"

const Navbar = () => {
    const { user, LogOut } = useAuth();
    const handleLogout = () => {
        LogOut()
            .then(result => {
                console.log(result.user);
            })
            .catch(error => {
                console.log(error)
            })
    }



    const links = <>

        <li><NavLink to="/dashboard" className="border-2 border-amber-500 rounded-xl">Dashboard</NavLink></li>

    </>
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <section className="mx-auto flex w-full max-w-7xl items-center">

                {/* Left - Logo + Mobile Menu */}
                <div className="navbar-start">
                    <div className="dropdown">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost lg:hidden"
                        >
                            <svg
                                aria-label="Menu"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </div>

                        <ul
                            tabIndex={-1}
                            className="menu menu-sm dropdown-content z-1 mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
                        >
                            {links}
                        </ul>
                    </div>

                    <Logo />
                </div>




                <div className="navbar-end">

                    {
                        user ? (
                            <div className="flex items-center gap-3">

                                <div className="hidden lg:flex">
                                    <ul className="menu menu-horizontal px-1">
                                        {links}
                                    </ul>
                                </div>
                                {/* Logout Button */}
                                <button onClick={handleLogout} className="btn bg-amber-500 rounded-xl rounded-3xl
">
                                    Log Out
                                </button>
                                {/* User Image */}
                                <div className="w-9 h-9 border-2 border-gray-300
                             rounded-full overflow-hidden">
                                    <img
                                        src={user.photoURL ? user.photoURL : userLogo}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        ) : (

                            <div className="flex items-center">

                                <Link to="/login" className="btn bg-amber-500 rounded-xl rounded-3xl
">
                                    Log in
                                </Link>
                            </div>
                        )
                    }
                </div>

            </section>
        </div>
    );
};

export default Navbar;