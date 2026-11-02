import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {BarChart,Bar,XAxis,YAxis,  CartesianGrid,Tooltip,Legend,ResponsiveContainer} from "recharts";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";

const TZ = "Asia/Dhaka";
const DAY = 24 * 60 * 60 * 1000;

const AdminOverview = () => {
    const axiosSecure = useAxiosSecure();
    const [now] = useState(() => Date.now());

    const { data: earnings = {}, isLoading } = useQuery({
        queryKey: ["admin-earnings"],
        queryFn: async () => {
            const res = await axiosSecure.get("/admin-earnings");
            return res.data;
        },
    });

    const { data: growth = {}, isLoading: growthLoading } = useQuery({
        queryKey: ["admin-user-growth"],
        queryFn: async () => {
            const res = await axiosSecure.get("/admin-user-growth");
            return res.data;
        },
    });

    if (isLoading || growthLoading) return <Loading />;

    const daily = growth.daily || [];

    // last 7 days, missing day = 0
    const chartData = Array.from({ length: 7 }, (_, i) => {
        const t = now - (6 - i) * DAY;
        const key = new Date(t).toLocaleDateString("en-CA", { timeZone: TZ });
        const get = (role) =>
            daily.find((d) => d.date === key && d.role === role)?.count || 0;

        return {
            day: new Date(t).toLocaleDateString("en-US", { weekday: "short", timeZone: TZ }),
            Users: get("user"),
            Partners: get("partner"),
        };
    });

    const stats = [
        { title: "Total Earnings", value: `৳${earnings.totalEarnings?.toLocaleString("en-BD") || 0}` },
        { title: "Paid Bookings", value: earnings.totalPayments || 0 },
        { title: "Total Users", value: growth.totalUsers || 0 },
        { title: "Total Partners", value: growth.totalPartners || 0 },
    ];

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold mb-6">Admin Overview</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((item) => (
                    <div
                        key={item.title}
                        className="card bg-base-100 shadow-md border border-base-300"
                    >
                        <div className="card-body">
                            <p className="text-base-content/60 text-sm">{item.title}</p>
                            <h3 className="text-2xl font-bold">{item.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card bg-base-100 shadow-md border border-base-300 mt-6">
                <div className="card-body">
                    <h3 className="text-lg font-semibold">New Signups (Last 7 Days)</h3>

                    <div className="w-full h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" />
                                <YAxis allowDecimals={false} width="auto" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Users" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Partners" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;