import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";


const AdminOverview = () => {
    const axiosSecure = useAxiosSecure();

    const { data: earnings = {}, isLoading } = useQuery({
        queryKey: ["admin-earnings"],
        queryFn: async () => {
            const res = await axiosSecure.get("/admin-earnings");
            return res.data;
        }
    });

    if (isLoading) {
        return <p className="text-center py-10">Loading overview...</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Total Earnings */}
            <div className="rounded-xl bg-base-100 p-6 shadow">
                <p className="text-sm text-base-content/60">
                    Total Earnings
                </p>

                <h2 className="mt-2 text-3xl font-bold text-primary">
                    ৳{earnings.totalEarnings?.toLocaleString("en-BD") || 0}
                </h2>
            </div>

            {/* Total Payments */}
            <div className="rounded-xl bg-base-100 p-6 shadow">
                <p className="text-sm text-base-content/60">
                    Total Successful Payments
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                    {earnings.totalPayments || 0}
                </h2>
            </div>

        </div>
    );
};

export default AdminOverview;