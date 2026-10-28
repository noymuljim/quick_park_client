
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Loading from "../../../../components/Loading/Loading";
import {
    FiMapPin,
    FiCalendar,
    FiClock,
    FiCreditCard,
    FiHash,
} from "react-icons/fi";

const AllBookingsHistory = () => {
    const axiosSecure = useAxiosSecure();

    const { data: AllBookings = [], isLoading } = useQuery({
        queryKey: ["all-booking-history"],
        queryFn: async () => {
            const res = await axiosSecure.get("/All-Booking-History");
            return res.data;
        },
    });

    if (isLoading) return <Loading />;

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleString("en-BD", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusStyle = (status) => {
        const value = status?.toLowerCase();

        if (value === "paid") {
            return "bg-green-100 text-green-700 border-green-200";
        }

        if (value?.includes("requested")) {
            return "bg-amber-100 text-amber-700 border-amber-200";
        }

        if (value === "unpaid" || value === "payment pending") {
            return "bg-red-100 text-red-700 border-red-200";
        }

        if (value === "completed" || value === "confirmed") {
            return "bg-blue-100 text-blue-700 border-blue-200";
        }

        return "bg-base-200 text-base-content border-base-300";
    };

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-secondary font-bold text-3xl">
                            All Users History
                        </h1>
                        <p className="text-base-content/60 mt-2">
                            View all users' parking bookings and payment details.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-base-100 border border-base-300 rounded-2xl p-4 shadow-sm">
                        <div className="bg-orange-500/10 text-orange-500 p-3 rounded-xl">
                            <FiCalendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-base-content/60">
                                Total Bookings
                            </p>
                            <p className="text-2xl font-bold">
                                {AllBookings.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Booking Table */}
                <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden">

                    {AllBookings.length === 0 ? (
                        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
                            <FiCalendar
                                size={45}
                                className="text-base-content/30 mb-4"
                            />
                            <h2 className="text-xl font-semibold">
                                No booking history found
                            </h2>
                            <p className="mt-2 text-base-content/60">
                                Parking bookings will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr className="bg-base-200 text-base-content/70 text-xs uppercase">
                                        <th>#</th>
                                        <th>Parking Lot</th>
                                        <th>User Email</th>
                                        <th>Vehicle</th>
                                        <th>Location</th>
                                        <th>Booking Date</th>
                                        <th>Expires At</th>
                                        <th>Price / Minute</th>
                                        <th>Booking Status</th>
                                        <th>Payment</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {AllBookings.map((booking, i) => (
                                        <tr key={booking._id} className="hover">
                                            <th className="text-base-content/50">
                                                {i + 1}
                                            </th>

                                            {/* Parking Lot */}
                                            <td>
                                                <div className="flex items-center gap-3 min-w-52">
                                                    <img
                                                        src={booking.lotPhoto}
                                                        alt={booking.lotName}
                                                        className="w-14 h-14 object-cover rounded-xl"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-base-content">
                                                            {booking.lotName}
                                                        </p>
                                                        <p className="text-xs text-base-content/50 flex items-center gap-1 mt-1">
                                                            <FiHash size={12} />
                                                            {booking.lotId?.slice(-8) || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* User Email */}
                                            <td>
                                                <span className="font-medium">
                                                    {booking.user_email || "N/A"}
                                                </span>
                                            </td>

                                            {/* Vehicle */}
                                            <td>
                                                <p className="font-semibold">
                                                    {booking.V_type || "N/A"}
                                                </p>
                                                <p className="text-xs text-base-content/60 mt-1">
                                                    {booking.V_number || "N/A"}
                                                </p>
                                            </td>

                                            {/* Location */}
                                            <td>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <FiMapPin className="text-orange-500 shrink-0" />
                                                    {booking.location || "N/A"}
                                                </span>
                                            </td>

                                            {/* Booking Date */}
                                            <td>
                                                <div className="min-w-36">
                                                    <p className="text-xs text-base-content/50 mb-1">
                                                        Created
                                                    </p>
                                                    <p className="text-sm font-medium">
                                                        {formatDate(booking.createdAt)}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Expiry */}
                                            <td>
                                                <div className="min-w-36">
                                                    <p className="text-xs text-base-content/50 mb-1">
                                                        Expires
                                                    </p>
                                                    <p className="text-sm font-medium">
                                                        {formatDate(booking.expiresAt)}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Price */}
                                            <td>
                                                <div className="flex items-center gap-1.5 whitespace-nowrap font-bold">
                                                    <FiCreditCard className="text-orange-500" />
                                                    ৳{Number(
                                                        booking.pricePerMinute || 0
                                                    ).toLocaleString("en-BD")}
                                                </div>
                                                <p className="text-xs text-base-content/50 mt-1">
                                                    per minute
                                                </p>
                                            </td>

                                            {/* Booking Status */}
                                            <td>
                                                <span
                                                    className={`badge border capitalize whitespace-nowrap ${getStatusStyle(
                                                        booking.status
                                                    )}`}
                                                >
                                                    {booking.status || "Unknown"}
                                                </span>
                                                {booking.checkInRequestedAt && (
                                                    <p className="text-xs text-base-content/50 mt-2">
                                                        <FiClock className="inline mr-1" />
                                                        {formatDate(
                                                            booking.checkInRequestedAt
                                                        )}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Payment Status */}
                                            <td>
                                                <span
                                                    className={`badge border capitalize ${getStatusStyle(
                                                        booking.paymentStatus
                                                    )}`}
                                                >
                                                    {booking.paymentStatus || "Unknown"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Footer */}
                    {AllBookings.length > 0 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 p-4 border-t border-base-300 text-sm text-base-content/60">
                            <p>
                                Total {AllBookings.length} booking records
                            </p>
                            <p className="flex items-center gap-2">
                                <FiCreditCard className="text-orange-500" />
                                Currency: BDT (৳)
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllBookingsHistory;
