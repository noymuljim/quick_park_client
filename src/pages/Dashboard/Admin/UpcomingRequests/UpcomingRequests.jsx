import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth"; 
import Loading from "../../../../components/Loading/Loading";
import Swal from "sweetalert2";


const UpcomingRequests = () => {

    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();   
    const { user } = useAuth();            
    const email = user?.email;              

    // check in confirm
    const confirmMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.patch(`/check-in-confirm/${id}?email=${email}`); 
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["partner-upcoming-check-in", email]  
            });
            Swal.fire({
                icon: "success",
                title: "Check-in confirmed!",
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

        }
    });
    //payment req
    const checkOut_paymentRequest = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.patch(`/check-out-confirm/payment-request/${id}?email=${email}`); 
            return res.data;
        },

        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries({
                    queryKey: ["partner-upcoming-check-in", email] 
                });
                Swal.fire({
                    icon: "success",
                    title: "payment request sent!",
                    confirmButtonText: "OK",
                });
            }
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "payment request Failed!",
                text:
                    error.response?.data?.message ||
                    "Something went wrong. Please try again.",
                confirmButtonText: "OK",
            });

        }

    });
    //complete session
    const complete_session = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.patch(`/complete-session/${id}?email=${email}`); 
            return res.data;
        },

        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries({
                    queryKey: ["partner-upcoming-check-in", email]  
                });
                Swal.fire({
                    icon: "success",
                    title: "Session complete!",
                    confirmButtonText: "OK",
                });
            }
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Session Failed!",
                text:
                    error.response?.data?.message ||
                    "Something went wrong. Please try again.",
                confirmButtonText: "OK",
            });

        }
    });

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["partner-upcoming-check-in", email],   
        enabled: !!email,                                 
        queryFn: async () => {
            const res = await axiosSecure.get(`/partner/upcoming-requests?email=${email}`); 
            return res.data;
        },
        refetchInterval: 5000,
    });

    if (isLoading) {
        return <Loading />;
    }


    return (
        <div className="p-4 md:p-8">
            <h1 className="mb-2 text-3xl font-bold">
                Upcoming requests
            </h1>
            <p className="mb-6 text-base-content/60">
                Manage users' requests.
            </p>

            <div className="overflow-x-auto rounded-xl border border-base-300">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Vehicle</th>
                            <th>Vehicle Number</th>
                            <th>Transaction Id</th>
                            <th>Amount</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings.length === 0 ? (
                            <tr>
                                <td className="py-10 text-center"> 
                                    No requests found.
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking, index) => (
                                <tr key={booking._id}>
                                    <th>{index + 1}</th>

                                    <td >
                                        <div>
                                            {booking.V_type || "N/A"}
                                        </div>
                                    </td>

                                    <td className="font-semibold">
                                        {booking.V_number || "N/A"}
                                    </td>

                                    <td>
                                        {booking.transactionId || "N/A"}
                                    </td>

                                    <td>
                                        ৳{Number(
                                            booking.amount ?? booking.totalPrice ?? 0
                                        ).toLocaleString("en-BD")}
                                    </td>

                                    <td>
                                        <span className="badge badge-success">
                                            {booking.paymentStatus}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="badge badge-warning">
                                            {booking.status}
                                        </span>
                                    </td>

                                    <td>
                                        <div>
                                            {booking.status === "check-in requested" && (
                                                <button onClick={() => confirmMutation.mutate(booking._id)}

                                                    className="btn rounded-full bg-green-500 hover:bg-green-700">Confirm check-in
                                                </button>
                                            )}



                                            {booking.status === "check-out requested" && (
                                                <button
                                                    onClick={() => checkOut_paymentRequest.mutate(booking._id)}

                                                    className="btn rounded-full bg-red-500">Confirm and pay req</button>
                                            )}
                                            {booking.status === "payment verifying" && (
                                                <button
                                                    onClick={() => complete_session.mutate(booking._id)}

                                                    className="btn rounded-full bg-red-500">Complete</button>
                                            )}

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

export default UpcomingRequests;