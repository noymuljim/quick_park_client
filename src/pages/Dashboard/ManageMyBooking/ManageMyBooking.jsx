
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiMapPin, FiCalendar, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { FaArrowCircleRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";
import Swal from "sweetalert2";

const ManageMyBooking = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();



    // Check-in request
    const checkInMutation = useMutation({
        mutationFn: async (bookingId) => {
            const res = await axiosSecure.patch(`/booking/check-in-request/${bookingId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["my-bookings", user?.email],
            });
            Swal.fire({
                icon: "success",
                title: "Check-in Requested!",
                text: "Your check-in request has been submitted successfully.please wait for confirmation",
                confirmButtonText: "OK",
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Check-in Failed!",
                text:
                    error.response?.data?.message ||
                    "Something went wrong. Please try again.",
                confirmButtonText: "OK",
            });
        },
    });


    // Check-out request
    const checkOutMutation = useMutation({
        mutationFn: async (bookingId) => {
            const res = await axiosSecure.patch(`/booking/check-out-request/${bookingId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["my-bookings", user?.email],
            });
             Swal.fire({
                icon: "success",
                title: "Check-out Requested!",
                text: "Your check-out request has been submitted successfully.please wait for confirmation",
                confirmButtonText: "OK",
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Check-out Failed!",
                text:
                    error.response?.data?.message ||
                    "Something went wrong. Please try again.",
                confirmButtonText: "OK",
            });
        },
    });

    // Get bookings
    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["my-booking", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-booking?email=${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
        refetchInterval: 5000,
    });



    // // swal2 when session is complete
    const [dismissedBookingIds, setDismissedBookingIds] = useState([]);

    useEffect(() => {
        const completedBooking = bookings.find((booking) =>
            booking.status === "complete session" &&
            !sessionStorage.getItem(`completed-${booking._id}`)
        );

        if (!completedBooking) return;


        sessionStorage.setItem(`completed-${completedBooking._id}`, "true");

        Swal.fire({
            icon: "success",
            title: "Thank You!",
            text: `Your parking session at ${completedBooking.lotName} is complete. You can leave now. Have a safe journey!`,
            confirmButtonText: "OK",
            allowOutsideClick: false,
        }).then(() => {
            setDismissedBookingIds((previousIds) => [
                ...previousIds,
                completedBooking._id,
            ]);
        });
    }, [bookings]);

    const visibleBookings = bookings.filter(
        (booking) =>
            booking.status !== "complete session" &&
            !dismissedBookingIds.includes(booking._id)
    );


    //time formating
    const formatDateTime = (dateTime) => {
        if (!dateTime) return "N/A";

        return new Date(dateTime).toLocaleString("en-BD", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    // Countdown component
    const BookingCountdown = ({ expiresAt, status }) => {
        const calculateTimeLeft = () => {
            const difference =
                new Date(expiresAt).getTime() - Date.now();

            return Math.max(0, difference);
        };

        const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

        useEffect(() => {
            if (status !== "waiting for check-in") return;

            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft());
            }, 1000);

            return () => clearInterval(timer);
        }, [expiresAt, status]);

        if (status !== "waiting for check-in") {
            return (
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-medium text-secondary">
                        BOOKING STATUS
                    </span>
                    <span className="badge badge-info badge-sm capitalize">
                        {status}
                    </span>


                </div>
            );
        }

        const totalSeconds = Math.floor(timeLeft / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return (
            <div className="flex flex-col items-center gap-1 text-primary">
                <span className="text-sm font-bold tabular-nums text-red-500">
                    {timeLeft > 0
                        ? `${minutes}:${String(seconds).padStart(2, "0")}`
                        : "Expired"}
                </span>

                <span className="text-[10px] font-medium text-secondary">
                    TIME LEFT
                </span>
            </div>
        );
    };

    //payment
    const handlePayment = async (bookingId) => {
    try {
        const res = await axiosSecure.post("/create-checkout-session", {
            bookingId,
        });

        if (res.data.success) {
            window.location.href = res.data.url;
        } else {
            Swal.fire("Payment Failed", res.data.message, "error");
        }
    } catch (error) {
        console.log("Payment error:", error.response?.data);

        Swal.fire(
            "Payment Failed",
            error.response?.data?.message || error.message,
            "error"
        );
    }
};
    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-base-200/40 px-4 md:px-8">
            <div>
                {/* Booking List */}
                {visibleBookings.length === 0 ? (
                    <div className="flex min-h-[70vh] items-center justify-center p-4">
                        <div className="card-body items-center py-16 text-center">
                            <FiCalendar
                                size={48}
                                className="mb-3 text-base-content/30"
                            />

                            <h2 className="text-xl font-bold">
                                No booking Yet, or booking expired!
                            </h2>

                            <p>Please create a new booking slot.</p>

                            <Link to="/" className="btn btn-primary">
                                Book Now
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="w-full">
                        {visibleBookings.map((booking) => {

                            const startTime = booking.checkInConfirmedAt
                                ? new Date(booking.checkInConfirmedAt).getTime()
                                : NaN;

                            const endTime = booking.paymentRequestedAt
                                ? new Date(booking.paymentRequestedAt).getTime()
                                : NaN;

                            const totalMinutes =
                                Number.isFinite(startTime) &&
                                    Number.isFinite(endTime) &&
                                    endTime >= startTime
                                    ? Math.ceil(
                                        (endTime - startTime) / (1000 * 60)
                                    )
                                    : 0;

                            const pricePerMinute = Number(
                                booking.pricePerMinute ?? 0
                            );

                            const totalAmount =
                                totalMinutes * pricePerMinute;

                            return (
                                <div key={booking._id}>
                                    {/* Header */}
                                    <div className="mb-10 flex items-center justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h1 className="text-3xl font-bold md:text-4xl">
                                                    LIVE status of your booking
                                                </h1>

                                                <FaArrowCircleRight
                                                    className="animate-[moveHorizontal_1s_ease-in-out_infinite]"
                                                    size={19}
                                                />
                                            </div>

                                            <h1 className="text-primary">
                                                To activate your booking,
                                                please click Check In first.
                                            </h1>
                                        </div>

                                        <div>
                                            <h1 className="badge badge-info text-secondary">
                                                {booking.status}
                                            </h1>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                        {/* Vehicle Information */}
                                        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition hover:shadow-md">
                                            <p className="text-sm font-medium text-base-content/60">
                                                Vehicle Information
                                            </p>

                                            <div className="mt-3 space-y-3">
                                                <div>
                                                    <p className="text-xs text-base-content/50">
                                                        Vehicle Type
                                                    </p>

                                                    <p className="mt-1 text-lg font-bold capitalize">
                                                        {booking.V_type ||
                                                            booking.vehicle ||
                                                            "N/A"}
                                                    </p>
                                                </div>

                                                <div className="border-t border-base-300 pt-3">
                                                    <p className="text-xs text-base-content/50">
                                                        Vehicle Number
                                                    </p>

                                                    <p className="mt-1 break-all text-lg font-bold">
                                                        {booking.V_number ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Information */}
                                        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition hover:shadow-md">
                                            <p className="text-sm font-medium text-base-content/60">
                                                Payment Information
                                            </p>

                                            <div className="mt-3 space-y-3">
                                                <div>
                                                    <p className="text-xs text-green-500">
                                                        Total Amount to Pay
                                                    </p>

                                                    <p className="mt-1 text-2xl font-extrabold tracking-tight text-secondary">
                                                        ৳
                                                        {totalAmount.toLocaleString(
                                                            "en-BD"
                                                        )}
                                                    </p>

                                                    <p className="text-xs text-base-content/60">
                                                        Rate: ৳
                                                        {pricePerMinute}
                                                        /minute
                                                    </p>


                                                </div>

                                                <div className=" flex justify-between">
                                                    <div className="border-t border-base-300 pt-3">
                                                        <p className="text-xs text-base-content/50">
                                                            check-in confirmed at
                                                        </p>

                                                        <p className="mt-1 text-sm leading-7">
                                                            {booking.checkInConfirmedAt
                                                                ? formatDateTime(
                                                                    booking.checkInConfirmedAt
                                                                )
                                                                : "Not checked in yet"}
                                                        </p>
                                                    </div>

                                                    <div className="border-t border-base-300 pt-3">
                                                        <p className="text-xs text-base-content/50">
                                                            check-out & pay req at
                                                        </p>

                                                        <p className="mt-1 text-sm leading-7">
                                                            {booking.paymentRequestedAt
                                                                ? formatDateTime(
                                                                    booking.paymentRequestedAt
                                                                )
                                                                : "Not pay or checked out yet"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="mt-1 text-xs text-primary">
                                                    Parking Duration:{" "}
                                                    {totalMinutes} minutes
                                                </p>

                                            </div>
                                        </div>

                                        {/* Transaction Information */}
                                        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition hover:shadow-md">
                                            <p className="text-sm font-medium text-base-content/60">
                                                Transaction Information
                                            </p>

                                            <div className="mt-3 space-y-3">
                                                <div className="flex items-center justify-between gap-3 pt-3">
                                                    <p className="text-sm text-base-content/60">
                                                        Payment Status
                                                    </p>

                                                    <span
                                                        className={`badge badge-sm shrink-0 gap-1 py-3 capitalize ${booking.paymentStatus ===
                                                            "paid"
                                                            ? "badge-success"
                                                            : booking.paymentStatus ===
                                                                "pending"
                                                                ? "badge-warning"
                                                                : booking.paymentStatus ===
                                                                    "failed"
                                                                    ? "badge-error"
                                                                    : "badge-ghost"
                                                            }`}
                                                    >
                                                        {booking.paymentStatus ===
                                                            "paid" && (
                                                                <FiCheckCircle
                                                                    size={12}
                                                                />
                                                            )}

                                                        {booking.paymentStatus ||
                                                            "unpaid"}
                                                    </span>
                                                </div>

                                                <div className="mt-6 border-t border-base-300 pt-4">
                                                    <p className="text-xs text-base-content/50">
                                                        Transaction ID
                                                    </p>

                                                    <p className="mt-1 break-all text-base font-bold leading-7">
                                                        {booking.transactionId ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Booking Details */}
                                    <div className="group my-4 overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                        <div className="h-1 bg-gradient-to-r from-primary via-amber-400 to-transparent" />

                                        <div className="p-5 sm:p-6">
                                            {/* Header */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex min-w-0 items-start gap-3">
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                        <FiMapPin size={23} />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <h2 className="break-words text-lg font-bold sm:text-xl">
                                                            {booking.lotName}
                                                        </h2>

                                                        <p className="mt-1 text-xs text-base-content/50">
                                                            Booking ID:{" "}
                                                            {booking._id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="my-5 border-t border-base-300" />

                                            {/* Booking Schedule */}
                                            <div className="rounded-xl bg-base-200/50 p-4">
                                                <div className="mb-4 flex items-center gap-2">
                                                    <FiCalendar
                                                        className="text-primary"
                                                        size={17}
                                                    />

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
                                                            {formatDateTime(
                                                                booking.createdAt
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col items-center gap-1 text-primary">
                                                        <BookingCountdown
                                                            expiresAt={
                                                                booking.expiresAt
                                                            }
                                                            status={
                                                                booking.status
                                                            }
                                                        />
                                                    </div>

                                                    <div className="min-w-0 text-right">
                                                        <p className="mb-1 text-xs text-base-content/50">
                                                            EXPIRES
                                                        </p>

                                                        <p className="text-sm font-bold">
                                                            {formatDateTime(
                                                                booking.expiresAt
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {booking.status ===
                                                "waiting for check-in" && (
                                                    <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-warning/10 p-3 text-center text-sm text-secondary">
                                                        <FiAlertCircle
                                                            className="shrink-0"
                                                            size={17}
                                                        />

                                                        <p>
                                                            Please complete the
                                                            Check in action before
                                                            it expires.
                                                        </p>
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    {/* Booking Actions */}
                                    <div>
                                        {booking.status === "waiting for check-in" && (
                                            <button
                                                disabled={checkInMutation.isPending
                                                }
                                                onClick={() =>
                                                    checkInMutation.mutate(
                                                        booking._id
                                                    )
                                                }
                                                className="btn btn-primary w-full"
                                            >
                                                Check In
                                            </button>
                                        )}

                                        {booking.status ===
                                            "check-in confirm" && (
                                                <button
                                                    disabled={
                                                        checkOutMutation.isPending
                                                    }
                                                    onClick={() =>
                                                        checkOutMutation.mutate(
                                                            booking._id
                                                        )
                                                    }
                                                    className="btn btn-primary w-full"
                                                >
                                                    Check Out
                                                </button>
                                            )}

                                        {booking.status ===
                                            "payment pending" && (
                                                <button
                                                    onClick={() => handlePayment(booking._id)}
                                                    className="btn btn-primary w-full"
                                                >
                                                    Pay Now
                                                </button>
                                            )}

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageMyBooking;
