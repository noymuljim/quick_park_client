
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";

const MyBookingHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["my-booking-history", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/My-Booking-History?email=${user.email}`
            );
            return res.data;
        },
        enabled: !!user?.email,
    });

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

    if (isLoading) return <Loading />;

    return (
        <div className="min-h-screen bg-base-200/40 p-4 md:p-8">
            <h1 className="mb-2 text-3xl font-bold">
               My Booking History
            </h1>

            <p className="mb-6 text-base-content/60">
                View all your previous parking sessions and booking details.
            </p>

            {bookings.length === 0 ? (
                <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
                    <h2 className="text-xl font-semibold">
                        No booking history found
                    </h2>
                    <p className="mt-2 text-base-content/60">
                        Your parking bookings will appear here.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100 shadow-sm">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Booking Date</th>
                                <th>Parking Lot</th>
                                <th>Vehicle</th>
                                <th>Vehicle Number</th>
                                <th>Duration</th>
                                <th>Total Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {bookings.map((booking, index) => {
                                const start = booking.checkInConfirmedAt
                                    ? new Date(booking.checkInConfirmedAt).getTime()
                                    : null;

                                const end = booking.paymentRequestedAt
                                    ? new Date(booking.paymentRequestedAt).getTime()
                                    : null;

                                const duration =
                                    start && end && end >= start
                                        ? Math.ceil(
                                              (end - start) / (1000 * 60)
                                          )
                                        : 0;

                                const price = Number(
                                    booking.pricePerMinute ?? 0
                                );

                                const total = duration * price;

                                return (
                                    <tr key={booking._id}>
                                        <th>{index + 1}</th>

                                        <td className="whitespace-nowrap">
                                            {formatDate(booking.createdAt)}
                                        </td>

                                        <td className="font-semibold">
                                            {booking.lotName || "N/A"}
                                        </td>

                                        <td>
                                            {booking.V_type ||
                                                booking.vehicle ||
                                                "N/A"}
                                        </td>

                                        <td>{booking.V_number || "N/A"}</td>

                                        <td>{duration} min</td>

                                        <td className="font-semibold">
                                            ৳{total.toLocaleString("en-BD")}
                                        </td>

                                        <td>
                                            <span
                                                className={`badge badge-sm ${
                                                    booking.paymentStatus === "paid"
                                                        ? "badge-success"
                                                        : "badge-warning"
                                                }`}
                                            >
                                                {booking.paymentStatus || "unpaid"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="badge badge-ghost badge-sm">
                                                {booking.status || "N/A"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyBookingHistory;
