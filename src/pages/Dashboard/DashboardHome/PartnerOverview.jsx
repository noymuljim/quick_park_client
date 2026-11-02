import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";
import { FaCalendarAlt, FaMoneyBillWave, FaWallet } from "react-icons/fa";

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;

    return (
        <div className="bg-base-100 border border-base-300 rounded-lg shadow-md p-3 text-sm">
            <p className="font-semibold">{label}</p>
            <p className="text-primary">Bookings: {d.bookings}</p>
            <p className="text-base-content/70">
                Earnings: ৳{d.earnings?.toLocaleString("en-BD") || 0}
            </p>
        </div>
    );
};

const PartnerOverview = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: revenue = {}, isLoading } = useQuery({
        queryKey: ["partner-revenue", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/partner-earnings/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    const { data: weekly = [], isLoading: chartLoading } = useQuery({
        queryKey: ["partner-weekly-bookings", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/partner-weekly-bookings/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    if (isLoading || chartLoading) return <Loading />;

    const stats = [
        {
            title: "Total Revenue",
            amount: revenue.totalEarnings,
            icon: <FaWallet />,
            description: "Your lifetime earnings",
        },
        {
            title: "This Month",
            amount: revenue.monthlyEarnings,
            icon: <FaCalendarAlt />,
            description: "Your monthly earnings",
        },
        {
            title: "Today's Earnings",
            amount: revenue.todayEarnings,
            icon: <FaMoneyBillWave />,
            description: "Your earnings today",
        },
    ];

    // Fill last 7 days, missing day = 0
    const chartData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const key = d.toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
        const found = weekly.find((w) => w.date === key);
        return {
            day: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "Asia/Dhaka" }),
            bookings: found?.bookings || 0,
            earnings: found?.earnings || 0,
        };
    });

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold mb-6">Partner Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="card bg-base-100 shadow-md border border-base-300"
                    >
                        <div className="card-body">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-base-content/60 text-sm">{item.title}</p>
                                    <h2 className="text-2xl font-bold mt-2">
                                        ৳{item.amount?.toLocaleString("en-BD") || 0}
                                    </h2>
                                </div>
                                <div className="text-3xl text-primary">{item.icon}</div>
                            </div>
                            <p className="text-xs text-base-content/50 mt-2">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Last 7 days bookings chart */}
            <div className="card bg-base-100 shadow-md border border-base-300 mt-6">
                <div className="card-body">
                    <h3 className="text-lg font-semibold">Last 7 Days Bookings</h3>
                    <p className="text-xs text-base-content/50 mb-2">
                        Daily bookings for your lots
                    </p>

                    <div className="w-full h-72 text-primary">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" />
                                <YAxis allowDecimals={false} width="auto" />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                                />
                                <Bar
                                    dataKey="bookings"
                                    fill="currentColor"
                                    radius={[6, 6, 0, 0]}
                                    barSize={32}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerOverview;