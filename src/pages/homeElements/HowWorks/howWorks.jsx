import {
    IoLocation,
    IoCard,
    IoTicket,
    IoCarSport,
} from "react-icons/io5";

import img from "../../../assets/t.jpg";

const steps = [
    {
        icon: <IoLocation />,
        title: "Location",
        description: "Enter your location and find available parking spots.",
    },
    {
        icon: <IoCard />,
        title: "Pay",
        description: "Pay securely and get a QR code for instant access.",
    },
    {
        icon: <IoTicket />,
        title: "Reserve",
        description: "Select and reserve your parking spot in seconds.",
    },
    {
        icon: <IoCarSport />,
        title: "Park",
        description: "Park and enjoy your day — no more wasted time.",
    },
];

const HowWorks = () => {
    return (
        <section className="">

            <div className="mb-12 space-y-4 text-center ">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[3px] text-orange-300">
                    Simple Process
                </p>

                <h2 className="text-3xl font-bold text-orange-400 md:text-5xl">
                    How It Works
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-gray-400">
                    Simple, fast, and stress-free parking in just a few easy steps.
                </p>
            </div>

            <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row">

                <div className="flex w-full flex-col justify-center gap-4 lg:w-1/2">

                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="group flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                          
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-2xl text-orange-500 transition duration-300 group-hover:bg-orange-500 group-hover:text-white">
                                {step.icon}
                            </div>

                           
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {step.title}
                                </h3>

                                <p className="mt-1 max-w-md text-sm leading-6 text-gray-500">
                                    {step.description}
                                </p>
                            </div>

                            
                            <span className="ml-auto hidden text-sm font-semibold text-gray-300 sm:block">
                                0{index + 1}
                            </span>
                        </div>
                    ))}
                </div>

              
                <div className="relative w-full overflow-hidden rounded-3xl lg:w-1/2">

                    <img
                        src={img}
                        alt="Easy parking"
                        className="h-[450px] w-full object-cover transition duration-700 hover:scale-105"
                    />

                   
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="rounded-2xl bg-white/20 p-5 backdrop-blur-md">
                            <p className="text-sm font-medium text-orange-300">
                                Parking made simple
                            </p>

                            <h3 className="mt-1 text-2xl font-bold text-white">
                                Find. Reserve. Park.
                            </h3>

                            <button className="mt-4 rounded-full bg-orange-400 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-300">
                                Find Parking →
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HowWorks;