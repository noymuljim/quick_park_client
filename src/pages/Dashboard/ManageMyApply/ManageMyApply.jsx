
import { useQuery } from "@tanstack/react-query";
import {FiMail,FiPhone,FiMapPin,FiCalendar,FiClock,FiCheckCircle,FiXCircle} from "react-icons/fi";
import { FaCarSide, FaMotorcycle } from "react-icons/fa";

import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";

const ManageMyApply = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const {data: myApplication = [],isLoading} = useQuery({
        queryKey: ["myApplication", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/application/my?email=${encodeURIComponent(user.email)}`
            );
            return res.data;
        },
    });

    // date
    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusStyle = (status) => {
        if (status?.toLowerCase() === "approved") {
            return "border-success/30 bg-success/10 text-success";
        } else if (status?.toLowerCase() === "rejected") {
            return "border-error/30 bg-error/10 text-error";
        } else {
            return "border-warning/30 bg-warning/10 text-warning";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "approved":
                return <FiCheckCircle />;
            case "rejected":
                return <FiXCircle />;
            default:
                return <FiClock />;
        }
    };

    return (
        <div className="min-h-screen bg-base-100 p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
                <div className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">

                    {/* Header */}
                    <div className="border-b border-base-300 p-5 md:p-7">
                        <h2 className="text-xl font-bold text-base-content md:text-2xl">
                            My Application Status
                        </h2>
                    </div>

                    {/* Loading */}
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loading />
                        </div>
                    ) : myApplication.length === 0 ? (
                        <div className="py-12 text-center">
                            <FaCarSide className="mx-auto text-4xl text-primary" />

                            <h3 className="mt-3 font-bold text-base-content">
                                No applications found
                            </h3>

                            <p className="mt-1 text-sm text-base-content/60">
                                Your applications will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full min-w-[950px]">
                                <thead className="bg-base-200 text-xs uppercase text-base-content/60">
                                    <tr>
                                        <th className="px-6 py-5">Applicant</th>
                                        <th className="px-6 py-5">Parking Lot</th>
                                        <th className="px-6 py-5">Location</th>
                                        <th className="px-6 py-5">Hourly Rates</th>
                                        <th className="px-6 py-5">Applied On</th>
                                        <th className="px-6 py-5">Status</th>
                                        <th className="px-6 py-5">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-base-300">
                                    {myApplication.map((a) => (
                                        <tr
                                            key={a._id}
                                            className="transition-colors hover:bg-base-200/60"
                                        >
                                            {/* Applicant */}
                                            <td className="px-6 py-5">
                                                <p className="font-bold text-base-content">
                                                    {a.name}
                                                </p>

                                                <p className="mt-2 flex items-center gap-2 text-sm text-base-content/60">
                                                    <FiMail />
                                                    {a.email}
                                                </p>

                                                <p className="mt-1 flex items-center gap-2 text-sm text-base-content/60">
                                                    <FiPhone />
                                                    {a.phone}
                                                </p>
                                            </td>

                                            {/* Parking Lot */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl text-primary">
                                                        p
                                                    </div>

                                                    <span className="font-bold text-base-content/80">
                                                        {a.lotName}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Location */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-start gap-2">
                                                    <FiMapPin className="mt-1 text-primary" />

                                                    <div>
                                                        <p className="font-medium text-base-content/80">
                                                            {a.district}
                                                        </p>

                                                        <p className="mt-1 text-sm text-base-content/50">
                                                            {a.region}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Hourly Rates */}
                                            <td className="px-6 py-5">
                                                <div className="space-y-3 text-sm text-base-content/70">
                                                    <p className="flex items-center gap-2">
                                                        <FaCarSide className="text-base-content/50" />
                                                        ৳{a.hourlyPrice_Car}/hr
                                                    </p>

                                                    <p className="flex items-center gap-2">
                                                        <FaMotorcycle className="text-base-content/50" />
                                                        ৳{a.hourlyPrice_Motorcycle}/hr
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Applied On */}
                                            <td className="px-6 py-5">
                                                <p className="flex items-center gap-2 whitespace-nowrap text-sm text-base-content/70">
                                                    <FiCalendar className="text-base-content/50" />
                                                    {formatDate(a.createdAt)}
                                                </p>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-5">
                                                <span
                                                    className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-semibold capitalize ${getStatusStyle(a.status)}`}
                                                >
                                                    {getStatusIcon(a.status)}
                                                    {a.status}
                                                </span>
                                            </td>

                                            {/* Delete */}
                                            <td className="px-6 py-5">
                                                <button className="btn">
                                                    delet
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ManageMyApply;
