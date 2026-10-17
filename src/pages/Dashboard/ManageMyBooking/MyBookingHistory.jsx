import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";
import { FiCalendar, FiMapPin } from "react-icons/fi";



const MyBookingHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["my-booking-history", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/my-bookings?email=${encodeURIComponent(user.email)}&status=checked-out`
            );
            return res.data;
        }
    });

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleString("en-BD", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold md:text-3xl">
                    My Booking History
                </h1>
                <p className="mt-2 text-base-content/60">
                    View your completed parking bookings and payment details.
                </p>
            </div>

            <div className="mb-5 flex flex-wrap gap-4">
                <div className="rounded-lg border border-base-300 bg-base-100 p-4">
                    <p className="text-sm text-base-content/60">
                        Completed Bookings
                    </p>
                    <p className="text-2xl font-bold">
                        {bookings.length}
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Parking Lot</th>
                            <th>Vehicle</th>
                            <th>Vehicle Number</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Amount</th>
                            <th>Transaction ID</th>
                            <th>Tracking ID</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="py-12 text-center">
                                    <FiCalendar className="mx-auto mb-3 text-3xl text-base-content/40" />
                                    <p className="font-semibold">
                                        No booking history found
                                    </p>
                                    <p className="mt-1 text-sm text-base-content/60">
                                        Your checked-out bookings will appear here.
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking, index) => (
                                <tr key={booking._id}>
                                    <th>{index + 1}</th>

                                    <td>
                                        <div className="flex items-center gap-2 font-semibold">
                                            <FiMapPin className="shrink-0 text-primary" />
                                            {booking.lotName || "N/A"}
                                        </div>
                                    </td>

                                    <td>{booking.V_type || "N/A"}</td>

                                    <td>{booking.V_number || "N/A"}</td>

                                    <td>{formatDate(booking.startTime)}</td>

                                    <td>{formatDate(booking.endTime)}</td>

                                    <td className="font-semibold">
                                        ৳{Number(
                                            booking.amount ?? booking.totalPrice ?? 0
                                        ).toLocaleString("en-BD")}
                                    </td>

                                    <td>
                                        <span className="text-xs">
                                            {booking.transactionId || "N/A"}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="font-mono text-xs">
                                            {booking.trackingId || "N/A"}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="flex flex-col gap-1">
                                            <span className="badge badge-success badge-sm">
                                                Paid
                                            </span>
                                            <span className="badge badge-ghost badge-sm">
                                                Checked-out
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyBookingHistory;
