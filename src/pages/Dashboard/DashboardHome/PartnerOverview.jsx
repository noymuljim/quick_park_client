import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";
import { FaCalendarAlt, FaMoneyBillWave, FaWallet } from "react-icons/fa";


const PartnerOverview = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: revenue = {}, isLoading } = useQuery({
        queryKey: ["partner-revenue", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/partner-earnings/${user.email}`
            );
            return res.data;
        },
        enabled: !!user?.email,
    });

    if (isLoading) return <Loading />;

    const stats = [
        {
            title: "Total Revenue",
            amount: revenue.totalEarnings,
            icon: <FaWallet />,
            description: "Your lifetime earnings"
        },
        {
            title: "This Month",
            amount: revenue.monthlyEarnings,
            icon: <FaCalendarAlt />,
            description: "Your monthly earnings"
        },
        {
            title: "Today's Earnings",
            amount: revenue.todayEarnings,
            icon: <FaMoneyBillWave />,
            description: "Your earnings today"
        }
    ];

    return (
        <div className="p-4 md:p-6">

            <h2 className="text-2xl font-bold mb-6">
                Partner Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="card bg-base-100 shadow-md border border-base-300"
                    >
                        <div className="card-body">

                            <div className="flex justify-between items-center">

                                <div>
                                    <p className="text-base-content/60 text-sm">
                                        {item.title}
                                    </p>

                                    <h2 className="text-2xl font-bold mt-2">
                                        ৳{item.amount?.toLocaleString("en-BD") || 0}
                                    </h2>
                                </div>

                                <div className="text-3xl text-primary">
                                    {item.icon}
                                </div>

                            </div>

                            <p className="text-xs text-base-content/50 mt-2">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default PartnerOverview;