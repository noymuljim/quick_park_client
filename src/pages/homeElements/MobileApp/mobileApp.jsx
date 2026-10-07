import { AiFillDollarCircle } from "react-icons/ai";
import { FaKey, FaMoneyBillAlt } from "react-icons/fa";

const items = [
    {
        icon: <AiFillDollarCircle />,
        title: "Turn Your Empty Space into Passive Income",
        subTitle: "Get paid for unused parking spots"
    },
    {
        icon: <FaKey />,
        title: "Full Control Over Pricing & Availability",
        subTitle: "Set your own rates"
    },
    {
        icon: <FaMoneyBillAlt />,
        title: "Instant Payouts & Easy Management",
        subTitle: "Get paid fast with hassle-free control"
    }
]
const mobileApp = () => {
    return (
        <div className="my-24">
            <div className="mb-16 space-y-4 text-center">
                <h1 className="text-3xl font-bold text-orange-400 md:text-5xl">
                    Become a Parking Partner
                </h1>
                <p className="mx-auto mt-3 max-w-xl text-gray-400">
                    Earn Money with Your Space!
                </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    {items.map((item, index) => (
        <div
            key={index}
            className="group flex items-center gap-5 rounded-2xl border border-gray-100 bg-gray-500 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-2xl text-orange-500 transition duration-300 group-hover:bg-orange-500 group-hover:text-white">
                {item.icon}
            </div>

            <div>
                <h3 className="text-lg font-bold text-white">
                    {item.title}
                </h3>

                <p className="mt-1 max-w-md text-sm leading-6 text-white">
                    {item.subTitle}
                </p>
            </div>
        </div>
    ))}
</div>
        </div>
    );
};

export default mobileApp;