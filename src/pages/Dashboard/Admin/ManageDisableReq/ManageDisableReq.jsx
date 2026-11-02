import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Loading from "../../../../components/Loading/Loading";


const ManageDisableRequests = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();


    const { data: requests = [], isLoading } = useQuery({
        queryKey: ["disableRequests"],
        queryFn: async () => {
            const res = await axiosSecure.get("/admin/disable-requests");
            return res.data;
        },
    });

    // Update request
    const updateMutation = useMutation({
        mutationFn: async ({ id, action }) => {
            const res = await axiosSecure.patch(`/admin/disable-request/${id}`,
                { action }
            );
            return res.data;
        },

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["disableRequests"],
            });

            queryClient.invalidateQueries({
                queryKey: ["approved-partners"],
            });

            Swal.fire({
                icon: "success",
                title: "Success!",
                text: data.message,
            });
        },

        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Failed!",
                text: error.response?.data?.message || "Something went wrong",
            });
        },
    });

    const handleUpdate = (id, action) => {
        Swal.fire({
            title: `Are you sure?`,
            text: `You want to ${action} this disable request?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Yes, ${action}`,
        }).then((result) => {
            if (result.isConfirmed) {
                updateMutation.mutate({ id, action });
            }
        });
    };

    if (isLoading) return <Loading></Loading>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-5">
                Manage Disable Requests
            </h2>

            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Lot</th>
                            <th>Partner</th>
                            <th>Location</th>
                            <th>Request Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {requests.map((request) => (
                            <tr key={request._id}>
                                <td>
                                    <div className="font-semibold">
                                        {request.lotName}
                                    </div>
                                </td>

                                <td>
                                    <div>{request.name}</div>
                                    <div className="text-sm opacity-60">
                                        {request.email}
                                    </div>
                                </td>

                                <td>
                                    {request.district}, {request.region}
                                </td>

                                <td>
                                    {request.disableRequestedAt
                                        ? new Date(
                                            request.disableRequestedAt
                                        ).toLocaleDateString("en-GB")
                                        : "—"}
                                </td>

                                <td>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleUpdate(
                                                    request._id,
                                                    "approve"
                                                )
                                            }
                                            disabled={updateMutation.isPending}
                                            className="btn btn-sm btn-success"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleUpdate(
                                                    request._id,
                                                    "reject"
                                                )
                                            }
                                            disabled={updateMutation.isPending}
                                            className="btn btn-sm btn-error"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {requests.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-8">
                                    No pending disable requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageDisableRequests;