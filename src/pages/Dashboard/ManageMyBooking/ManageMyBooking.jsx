
import { useQuery } from "@tanstack/react-query";

import { FiMapPin, FiCalendar, FiCreditCard, FiHash, FiAlertCircle, FiCheckCircle, FiArrowRight, FiTruck } from "react-icons/fi";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";

const ManageMyBooking = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["my-bookings", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/my-bookings?email=${encodeURIComponent(user.email)}&status=checked-in`
            );
            return res.data;
        }
    });

    if (isLoading) {
        return <Loading />;
    }

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "N/A";

        return new Date(dateTime).toLocaleString("en-BD", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    return (
        <div className="min-h-screen bg-base-200/40 px-4 py-8 md:px-8">
            <div className="">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold md:text-4xl">
                        My Bookings
                    </h1>
                    <p className="mt-2 text-base-content/60">
                        View your parking reservations and payment details.
                    </p>
                </div>



                {/* Booking List */}
                {bookings.length === 0 ? (
                    <div className="card border border-base-300 bg-base-100 shadow-sm">
                        <div className="card-body items-center py-16 text-center">
                            <FiCalendar
                                size={48}
                                className="mb-3 text-base-content/30"
                            />
                            <h2 className="text-xl font-bold">
                                No Bookings Yet
                            </h2>
                            <p className="text-base-content/60">
                                Your parking reservations will appear here.
                            </p>
                        </div>
                    </div>
                ) : (

                    <div className="w-full">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="group overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                              
                                <div className="h-1 bg-gradient-to-r from-primary via-amber-400 to-transparent" />

                                <div className="p-5 sm:p-6">

                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <FiMapPin size={23} />
                                            </div>

                                            <div className="min-w-0">
                                               

                                                <h2 className=" break-words text-lg font-bold sm:text-xl">
                                                    {booking.lotName}
                                                </h2>

                                                <p className="mt-1 text-xs text-base-content/50">
                                                    Booking ID: {booking._id}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`badge badge-sm shrink-0 gap-1 py-3 capitalize ${booking.paymentStatus === "paid"
                                                    ? "badge-success"
                                                    : booking.paymentStatus === "pending"
                                                        ? "badge-warning"
                                                        : booking.paymentStatus === "failed"
                                                            ? "badge-error"
                                                            : "badge-ghost"
                                                }`}
                                        >
                                            {booking.paymentStatus === "paid" && (
                                                <FiCheckCircle size={12} />
                                            )}
                                            {booking.paymentStatus}
                                        </span>
                                    </div>

                                    <div className="my-5 border-t border-base-300" />

                                    {/* Booking time */}
                                    <div className="rounded-xl bg-base-200/50 p-4">
                                        <div className="mb-4 flex items-center gap-2">
                                            <FiCalendar className="text-primary" size={17} />
                                            <h3 className="text-sm font-semibold">
                                                Booking Schedule
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-3 items-center gap-3">
                                            <div className="min-w-0">
                                                <p className="mb-1 text-xs text-base-content/50">
                                                    START
                                                </p>
                                                <p className="text-sm font-bold">
                                                    {formatDateTime(booking.startTime)}
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-center gap-1 text-primary ">
                                                <FiArrowRight className="animate-[moveHorizontal_1s_ease-in-out_infinite]" size={19} />
                                                <span className="text-[10px] font-medium">
                                                    PARKING
                                                </span>
                                            </div>

                                            <div className="min-w-0 text-right">
                                                <p className="mb-1 text-xs text-base-content/50">
                                                    END
                                                </p>
                                                <p className="text-sm font-bold">
                                                    {formatDateTime(booking.endTime)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vehicle information */}
                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        <div className="rounded-xl border border-base-300 p-3">
                                            <div className="mb-2 flex items-center gap-2 text-base-content/50">
                                                <FiTruck size={16} />
                                                <span className="text-xs">Vehicle Type</span>
                                            </div>
                                            <p className="font-semibold">
                                                {booking.V_type || "N/A"}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-base-300 p-3">
                                            <div className="mb-2 flex items-center gap-2 text-base-content/50">
                                                <FiHash size={16} />
                                                <span className="text-xs">Vehicle Number</span>
                                            </div>
                                            <p className="break-all font-semibold">
                                                {booking.V_number || "N/A"}
                                            </p>
                                        </div>
                                    </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
       {/* Price summary */}
                                    <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-dotted border-primary p-4">
                                        <div>
                                            <p className="text-xs text-base-content/60">
                                                Total Amount
                                            </p>
                                            <p className="mt-1 text-2xl font-extrabold tracking-tight text-primary">
                                                ৳{Number(
                                                    booking.amount ?? booking.totalPrice ?? 0
                                                ).toLocaleString("en-BD")}
                                            </p>
                                            <p className="mt-1 text-xs text-base-content/50">
                                                {booking.paymentStatus === "paid"
                                                    ? "Payment completed"
                                                    : "Booking payment"}
                                            </p>
                                        </div>

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <FiCreditCard size={23} />
                                        </div>
                                    </div>

                                    {/* Payment information */}
                                    {(booking.transactionId ||
    
                                        booking.paidAt) && (
                                            <div className="border border-dotted border-primary p-2 mt-5 rounded-2xl space-y-3">
                                                {booking.transactionId && (
                                                    <div className="flex items-start gap-3">
                                                        <FiCheckCircle
                                                            className="mt-0.5 shrink-0 text-success"
                                                            size={17}
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs text-base-content/50">
                                                                Transaction ID
                                                            </p>
                                                            <p className="mt-1 break-all text-sm font-medium">
                                                                {booking.transactionId}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                              

                                                {booking.paidAt && (
                                                    <p className="text-xs text-base-content/50">
                                                        Paid on {formatDateTime(booking.paidAt)}
                                                    </p>
                                                )}
                                            </div>
                                        )}

</div>
                                 

                                
                                    {booking.paymentStatus === "pending" && (
                                        <div className="mt-4 flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-sm text-warning">
                                            <FiAlertCircle className="mt-0.5 shrink-0" size={17} />
                                            <p>
                                                Your payment is pending. Complete payment to confirm
                                                your parking reservation.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                )}
            </div>
        </div>
    );
};

export default ManageMyBooking;
