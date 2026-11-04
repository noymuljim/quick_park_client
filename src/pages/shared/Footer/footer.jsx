import { Link } from "react-router";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

const socialClass =
    "w-10 h-10 rounded-full border border-neutral-content/15 bg-neutral-content/5 flex items-center justify-center transition duration-300 hover:-translate-y-1 hover:border-secondary hover:bg-secondary hover:text-secondary-content hover:shadow-lg hover:shadow-secondary/30";


const Footer = () => {
    return (
        <footer className="relative overflow-hidden bg-neutral text-white ">
            {/* Top accent line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

                    {/* Brand */}
                    <div className="flex flex-col items-center">
                        <h1 className="text-white font-bold text-2xl flex items-center justify-center gap-3">

                            Quick Park
                        </h1>

                        <p className="mt-5 text-sm opacity-70 leading-7 max-w-xs">
                            Smart parking made simple. Find, book and manage
                            your space without hassle.
                        </p>

                        <div className="flex justify-center gap-3 mt-7">

                            <a
                                href="https://linkedin.com/in/noymul-matin-jim-7a119332a"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className={`${socialClass} group`}
                            >
                                <FaLinkedinIn className="transition-colors duration-300 group-hover:text-blue-500" />
                            </a>

                            <a
                                href="https://github.com/noymuljim"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Github"
                                className={`${socialClass} group`}
                            >
                                <FaGithub className="transition-colors duration-300 group-hover:text-black" />
                            </a>

                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col ">
                        <h2 className="font-semibold text-lg mb-6 flex flex-col  gap-2">
                            Quick Links
                        </h2>

                        <div className="flex flex-col  gap-4 text-sm">
                            {[
                                { to: "/", label: "Home" },
                                { to: "/becomePartner", label: "Become Partner" },
                                { to: "/dashboard", label: "Dashboard" },
                            ].map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="opacity-70 transition duration-300 hover:-translate-y-0.5 hover:text-secondary hover:opacity-100"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col items-center">
                        <h2 className="font-semibold text-lg mb-6 flex flex-col items-center gap-2">
                            Get in Touch
                        </h2>

                        <div className="flex flex-col items-center gap-4 text-sm">
                            <p className="opacity-80">

                                Dhaka, Bangladesh
                            </p>

                            <p className=" opacity-80">

                                noymulmatinjim@gmail.com
                            </p>

                            <p className=" opacity-80">

                                01912863484
                            </p>
                        </div>
                    </div>

                </div>

                {/* Bottom */}
                <div className="mt-14 border-t border-neutral-content/10 pt-6">
                    <p className="text-center text-sm opacity-60">
                        © {new Date().getFullYear()} Quick Park. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
