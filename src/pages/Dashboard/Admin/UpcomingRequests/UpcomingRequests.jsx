import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Loading from "../../../../components/Loading/Loading";


const UpcomingRequests = () => {

    const queryClient = useQueryClient();

    // check in confirm
    const confirmMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.patch(
                `/payments/check-in-confirm/${id}`
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["upcoming-check-in"]
            });
        }
    });
    // check out confirm
    const confirmCheckoutMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.patch(
                `/payments/check-out-confirm/${id}`
            );
            return res.data;
        },

        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries({
                    queryKey: ["upcoming-check-in"]
                });
            }
        }
    });



    const axiosSecure = useAxiosSecure();
    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["upcoming-check-in"],
        queryFn: async () => {
            const res = await axiosSecure.get("/payments?status=check-in req");
            return res.data;
        }
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
                                <td colSpan={7} className="py-10 text-center">
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
                                            {booking.status === "check-in req" && (
                                                <button onClick={() => confirmMutation.mutate(booking._id)}

                                                    className="btn rounded-full bg-green-500 hover:bg-green-700">Confirm check-in
                                                </button>
                                            )}

                                            {/* checkout btn */}

                                            {booking.status === "check-out req" && (
                                                <button
                                                    onClick={() => confirmCheckoutMutation.mutate(booking._id)}

                                                    className="btn rounded-full bg-red-500">Check out Confirm</button>
                                            )}

                                            {booking.status === "check-out confirm" && (
                                                <span>Check out done</span>
                                            )}





                                        </div>

                                        {/*  */}

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