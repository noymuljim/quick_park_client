
import { useQuery } from "@tanstack/react-query";
import { FiShield, FiUsers } from "react-icons/fi";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { GrUserAdmin } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import Swal from "sweetalert2";
import { FaRegHandshake } from "react-icons/fa";

const ManageAdmin = () => {
    const axiosSecure = useAxiosSecure();

    const { data: users = [], refetch, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");
            return res.data;
        },
    });

    const handleManageAdmin = (user, role) => {
        const roleInfo = { role: role };

        axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
            .then(res => {
                console.log(res.data);

                if (res.data.modifiedCount) {
                    refetch();

                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `${user.displayName} is ${role} Now!`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
    };

    const handleMakeAdmin = (user) => {
        handleManageAdmin(user, 'admin');
    };

    const handleRemoveAdmin = (user) => {
        handleManageAdmin(user, 'user');
    };

    return (
        <div className="min-h-screen bg-base-100 p-4 text-base-content md:p-8">
            <div className="mx-auto max-w-7xl space-y-7">

                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-base-content md:text-4xl">
                        Manage Admin
                    </h1>

                    <p className="mt-2 text-sm text-base-content/60 md:text-base">
                        View and manage all registered users in your system.
                    </p>
                </div>

                {/* User Statistics */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                    {/* All Users */}
                    <div className="group flex items-center justify-between rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
                        <div>
                            <p className="text-sm font-medium text-base-content/60">
                                All Users
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-base-content">
                                {users.length}
                            </h2>

                            <p className="mt-2 text-sm text-base-content/50">
                                Total registered users
                            </p>
                        </div>

                        <div className="rounded-2xl bg-primary/10 p-4 text-primary transition group-hover:bg-primary group-hover:text-primary-content">
                            <FiUsers size={28} />
                        </div>
                    </div>

                    {/* Partners */}
                    <div className="group flex items-center justify-between rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-success/50 hover:shadow-lg">
                        <div>
                            <p className="text-sm font-medium text-base-content/60">
                                All Partners
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-base-content">
                                {users.filter(user => user.role === "partner").length}
                            </h2>

                            <p className="mt-2 text-sm text-base-content/50">
                                Total registered partners
                            </p>
                        </div>

                        <div className="rounded-2xl bg-success/10 p-4 text-green-500 transition group-hover:bg-success group-hover:text-white">
                            <FaRegHandshake size={28} />
                        </div>
                    </div>

                    {/* Admin Users */}
                    <div className="group flex items-center justify-between rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg">
                        <div>
                            <p className="text-sm font-medium text-base-content/60">
                                Administrators
                            </p>

                            <h2 className="mt-2 break-all text-lg font-bold text-base-content">
                                {users.find(user => user.role === "admin")?.email || "No admin found"}
                            </h2>

                            <p className="mt-2 text-sm text-base-content/50">
                                Users with admin privileges
                            </p>
                        </div>

                        <div className="rounded-2xl bg-secondary/10 p-4 text-secondary transition group-hover:bg-purple-400 group-hover:text-secondary-content">
                            <FiShield size={28} />
                        </div>
                    </div>

                </div>

                {/* Users Table */}
                <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">

                    {/* Responsive Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left">

                            <thead className="bg-base-200">
                                <tr className="text-xs uppercase tracking-wider text-base-content/60">
                                    <th className="px-6 py-4 font-semibold">#</th>
                                    <th className="px-6 py-4 font-semibold">User</th>
                                    <th className="px-6 py-4 font-semibold">Email</th>
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold">Make as Admin</th>
                                    <th className="px-6 py-4 font-semibold">Other Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-base-300">
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center text-base-content/60"
                                        >
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr
                                            key={user._id}
                                            className="transition-colors hover:bg-base-200/60"
                                        >
                                            <td className="px-6 py-5 text-sm text-base-content/60">
                                                {index + 1}
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle h-12 w-12">
                                                            <img
                                                                src={user.photoURL}
                                                                alt="Avatar Tailwind CSS Component"
                                                            />
                                                        </div>
                                                    </div>

                                                    <span className="font-semibold text-base-content">
                                                        {user.displayName}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 text-sm text-base-content/70">
                                                {user.email}
                                            </td>

                                            <td className="px-6 py-5">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                        user.role === "admin"
                                                            ? "bg-secondary/10 text-base-content"
                                                            : user.role === "partner"
                                                                ? "bg-primary/15 text-primary"
                                                                : "bg-info/10 text-info"
                                                    }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-center">
                                                {user.role === "admin" ? (
                                                    <button
                                                        onClick={() => handleRemoveAdmin(user)}
                                                        title="Remove Admin Role"
                                                        aria-label={`Remove admin role from ${user.displayName}`}
                                                        className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-error/30 bg-error/10 text-error shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-error hover:bg-error hover:text-error-content hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus:ring-offset-base-100"
                                                    >
                                                        <GrUserAdmin size={18} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleMakeAdmin(user)}
                                                        title="Make Admin"
                                                        aria-label={`Make ${user.displayName} an admin`}
                                                        className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-content hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100"
                                                    >
                                                        <RiAdminFill size={18} />
                                                    </button>
                                                )}
                                            </td>

                                            <td className="px-6 py-5">
                                                {/* Other actions go here */}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-14 text-center text-base-content/60"
                                        >
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ManageAdmin;
