import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { FiMapPin, FiCalendar, FiAlertCircle, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";
import { FaArrowCircleRight } from "react-icons/fa";

const ManageMyBooking = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();



    // ckeck in req
    const queryClient = useQueryClient();
    const checkInMutation = useMutation({
        mutationFn: async (bookingId) => {
            const res = await axiosSecure.patch(
                `/payments/check-in-request/${bookingId}`
            );
            return res.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["my-bookings", user?.email]
            });
        }
    });

    const handleCheckIn = (bookingId) => {
        checkInMutation.mutate(bookingId);
    };
    // check out req

      const checkOutMutation = useMutation({
        mutationFn: async (bookingId) => {
            const res = await axiosSecure.patch(
                `/payments/check-in-request/${bookingId}`
            );
            return res.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["my-bookings", user?.email]
            });
        }
    });

    const handleCheckOut= (bookingId) => {
        checkOutMutation.mutate(bookingId);
    };

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["my-bookings", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/my-bookings?email=${encodeURIComponent(user.email)}&status=waiting`
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
            <div>


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

                            >
                                <div className="flex justify-between mb-10 items-center gap-2">
                                    <div>
                                        <div className="flex gap-3 items-center">
                                            <h1 className="text-3xl font-bold md:text-4xl">LIVE status of your booking</h1>
                                            <FaArrowCircleRight className="animate-[moveHorizontal_1s_ease-in-out_infinite]" size={19} />
                                        </div>
                                        <h1 className="text-primary">To active your booking please click to check In first</h1>

                                    </div>
                                     
                                     <div className="flex items-center gap-4">
                                        <div>
                                       {booking.status === "waiting" && (
                                         <button onClick={()=>handleCheckIn(booking._id)} 
                                         disabled={booking.status ==="check-in req"}
                                         className="btn rounded-full bg-green-500 hover:bg-green-700">Check In now</button>
                                       )}

                                       {/* checkout btn */}

                                       {booking.status === "check-in confirm" && (
                                         <button onClick={()=>handleCheckOut(booking._id)} 
                                         disabled={booking.status ==="check-out req"}
                                         className="btn rounded-full bg-red-500">Check out now</button>
                                       )}

                                     </div>

                                     <div>
                                       <h1>{booking.status}</h1>
                                     </div>
                                     </div>


                                </div>


                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                                    {/* Vehicle Type */}
                                    <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition hover:shadow-md">


                                        <p className="text-sm font-medium text-base-content/60">
                                            Vehicle Type
                                        </p>

                                        <p className="mt-2 truncate text-xl font-bold capitalize">
                                            {booking.V_type || "N/A"}
                                        </p>


                                    </div>

                                    {/* Vehicle Number */}
                                    <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition hover:shadow-md">


                                        <p className="text-sm font-medium text-base-content/60">
                                            Vehicle Number
                                        </p>

                                        <p className="mt-2 break-all text-xl font-bold">
                                            {booking.V_number || "N/A"}
                                        </p>


                                    </div>

                                    {/* Total Amount */}
                                    <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition hover:shadow-md">


                                        <p className="text-sm font-medium text-base-content/60">
                                            Total Amount
                                        </p>

                                        <p className="mt-2 text-2xl font-extrabold tracking-tight text-secondary">
                                            ৳{Number(
                                                booking.amount ?? booking.totalPrice ?? 0
                                            ).toLocaleString("en-BD")}
                                        </p>


                                    </div>

                                    {/* Paid At */}
                                    <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition hover:shadow-md">
                                        <p className="text-sm font-medium text-base-content/60">
                                            Paid At
                                        </p>
                                        <p className="mt-2 text-lg font-bold leading-7">
                                            {booking.paidAt
                                                ? formatDateTime(booking.paidAt)
                                                : "Not paid yet"}
                                        </p>
                                    </div>


                                </div>

                                <div className="rounded-2xl mt-4 flex justify-between border border-base-300 bg-base-100 p-5 shadow-sm transition hover:shadow-md">
                                    <div>
                                        <p className="text-sm font-medium text-base-content/60">
                                            Transaction Id
                                        </p>
                                        <p className="mt-2 text-lg font-bold leading-7">
                                            {booking.transactionId}
                                        </p>
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






                                <div className=" my-4 group overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

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

                            </div>
                        ))}
                    </div>

                )}
            </div>
        </div>
    );
};

export default ManageMyBooking;
