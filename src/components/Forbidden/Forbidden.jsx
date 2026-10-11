
import { Link, useNavigate } from "react-router";
import anim from "../../assets/forbidden403.svg";
import { FaArrowLeft, FaHome, FaLock } from "react-icons/fa";

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-gray-100 px-4 py-12">

            
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-red-100/50 blur-3xl" />

            <div className="relative z-10 w-full max-w-5xl">
                <div className="grid items-center gap-8 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-xl shadow-gray-200/50 backdrop-blur-xl sm:p-10 md:grid-cols-2 md:gap-12 md:p-14">

                    {/* Illustration */}
                    <div className="order-2 flex items-center justify-center md:order-1">
                        <img
                            src={anim}
                            className="w-full max-w-sm object-contain drop-shadow-sm"
                        />
                    </div>

                    {/* Text content */}
                    <div className="order-1 text-center md:order-2 md:text-left">

                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                            <FaLock size={13} />
                            <span>403 · Access Restricted</span>
                        </div>

                        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                            Access
                            <span className="block mt-2 text-orange-500">
                                Denied!
                            </span>
                        </h1>

                        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-gray-500 md:mx-0">
                            Oops! You don't have permission to access this page.
                            Please check your account permissions or return to
                            a page you can access.
                        </p>

                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">

                            <button
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md active:scale-95"
                            >
                                <FaArrowLeft size={14} />
                                Go Back
                            </button>

                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-500/25 transition duration-200 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-orange-500/40 active:scale-95"
                            >
                                <FaHome size={16} />
                                Back to Home
                            </Link>

                        </div>

                        <div className="mt-8 border-t border-gray-100 pt-5">
                            <p className="text-sm text-gray-400">
                                Need access? Contact your administrator.
                            </p>
                        </div>
                    </div>
                </div>

              
                <p className="mt-6 text-center text-xs tracking-wide text-gray-400">
                    © {new Date().getFullYear()} Quick Park. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Forbidden;
