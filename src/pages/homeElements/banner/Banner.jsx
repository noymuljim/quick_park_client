import { NavLink } from "react-router";
import vid from "../../../assets/heroanim.mp4";

const Banner = () => {
    return (
        <section className="relative min-h-screen w-full overflow-hidden">

            {/* Background Video */}
            <video
                src={vid}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70"></div>

            {/* Content */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-5 text-center text-white">
                <div>
                    <h1 className="text-5xl font-bold leading-tight sm:text-6xl md:text-7xl lg:text-8xl">
                        Find Your Easy
                        <span className="block">
                            <span className="text-orange-400">Parking</span> Spot
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base text-gray-200 sm:text-lg md:text-xl">
                        Easy, fast and smart parking at your fingertips.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                        <button className="rounded-lg bg-white px-7 py-3 font-semibold text-black transition hover:bg-gray-200">
                            Find Parking
                        </button>

                       <NavLink to="/becomePartner" className="rounded-xl border border-amber-500 px-7 py-3 font-semibold transition hover:bg-amber-500 text-white"
                       > Become a Partner</NavLink>
                       
                    </div>
                </div>
            </div>

        </section>
    );
};

export default Banner;