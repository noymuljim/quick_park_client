import { useNavigate } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading/Loading";
import { FiCalendar, FiHash, FiMapPin } from "react-icons/fi";

const UserOverview = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["my-booking", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-booking?email=${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
        refetchInterval: 5000,
    });

    if (isLoading) return <Loading />;

    const currentSession = bookings.find(
        (booking) =>
            booking.status === "check-in confirm" ||
            booking.status === "payment pending"
    );

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleString("en-BD", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className="min-h-screen bg-base-200/40 p-4 md:p-6 lg:p-8">

            {/* Page Header */}
            <div className="mb-8">


                <h1 className="text-2xl font-extrabold md:text-3xl">
                    Welcome back, {user?.displayName || "User"}!
                </h1>

                <p className="mt-2 text-sm text-base-content/60">
                    Keep track of your current parking session.
                </p>
            </div>

            {/* Section Header */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">


                {currentSession && (
                    <span className="flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
                        Active Session
                    </span>
                )}
            </div>

            {currentSession ? (
                <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">

                    {/* Parking Image */}
                    <div className="relative h-56 sm:h-72 lg:h-80">
                        <img
                            src={currentSession.lotPhoto}
                            alt={currentSession.lotName}
                            className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">


                            <h3 className="text-2xl font-extrabold text-white md:text-3xl">
                                {currentSession.lotName}
                            </h3>


                            <p className="mt-2 flex items-center gap-2 text-sm text-white/80">
                                <FiMapPin />
                                Your current parking location
                            </p>
                        </div>
                    </div>


                    <div className="p-5 md:p-7">


                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 pb-5">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
                                    Booking Status
                                </p>
                                <span className="mt-2 inline-flex rounded-lg bg-info/10 px-3 py-2 text-sm font-bold capitalize text-info">
                                    {currentSession.status}
                                </span>
                            </div>

                            <div className="text-right">
                                <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
                                    Booking ID
                                </p>
                                <p className="mt-2 flex items-center gap-1 text-sm font-semibold">
                                    <FiHash className="text-primary" />
                                    {currentSession._id}
                                </p>
                            </div>
                        </div>


                        <div className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-2 lg:grid-cols-3">


                            <div className="rounded-xl bg-base-200/60 p-4">
                               

                                <p className="text-xs font-medium text-base-content/50">
                                    Vehicle Type
                                </p>

                                <p className="mt-1 text-lg font-bold capitalize">
                                    {currentSession.V_type ||
                                        currentSession.vehicle ||
                                        "N/A"}
                                </p>
                            </div>


                            <div className="rounded-xl bg-base-200/60 p-4">
                              

                                <p className="text-xs font-medium text-base-content/50">
                                    Vehicle Number
                                </p>

                                <p className="mt-1 break-all text-lg font-bold">
                                    {currentSession.V_number || "N/A"}
                                </p>
                            </div>


                            <div className="rounded-xl bg-base-200/60 p-4 sm:col-span-2 lg:col-span-1">
                               

                                <p className="text-xs font-medium text-base-content/50">
                                    Check-in Confirmed At
                                </p>

                                <p className="mt-1 text-base font-bold">
                                    {formatDate(
                                        currentSession.checkInConfirmedAt
                                    )}
                                </p>
                            </div>
                        </div>


                        {currentSession.status === "payment pending" && (
                            <div className="mb-5 flex flex-col justify-between gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 sm:flex-row sm:items-center">
                                <div>
                                    <p className="font-bold text-warning">
                                        Payment Required
                                    </p>
                                    <p className="mt-1 text-sm text-base-content/70">
                                        Your parking session has ended. Please complete your payment.
                                    </p>
                                </div>

                                <span className="badge badge-warning">
                                    Payment Pending
                                </span>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-base-300 pt-5">
                            <p className="flex items-center gap-2 text-xs text-base-content/50">
                                <FiCalendar />
                                Booked: {formatDate(currentSession.createdAt)}
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/dashboard/ManageMyBooking")
                                }
                                className="btn btn-primary w-full rounded-3xl btn-sm"
                            >
                                View Booking Details
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-100 px-5 py-12 text-center">

                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <FiMapPin size={36} />
                    </div>

                    <h3 className="text-xl font-bold">
                        No Active Parking Session
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-base-content/50">
                        You don't have any active parking session right now.
                        Find a parking spot and book your next session!
                    </p>

                    <button
                        onClick={() => navigate("/")}
                        className="btn btn-primary mt-6"
                    >
                        Find Parking
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserOverview;
