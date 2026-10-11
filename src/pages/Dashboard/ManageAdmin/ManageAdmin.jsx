
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
        const roleInfo = { role: role }
        axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
            .then(res => {
                console.log(res.data)
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
            })
    }

    const handleMakeAdmin = (user) => {
        handleManageAdmin(user, 'admin')
    }
    const handleRemoveAdmin = (user) => {
        handleManageAdmin(user, 'user')
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-7xl space-y-7">

                {/* Page Header */}
                <div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-800 md:text-4xl">
                        Manage Users
                    </h1>

                    <p className="mt-2 text-sm text-slate-500 md:text-base">
                        View and manage all registered users in your system.
                    </p>
                </div>

                {/* at a glance */}

                {/* User Statistics */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                    {/* All Users */}
                    <div className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                All Users
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                {users.length}
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Total registered users
                            </p>
                        </div>

                        <div className="rounded-2xl bg-orange-50 p-4 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
                            <FiUsers size={28} />
                        </div>
                    </div>

                    {/* partner */}
                    <div className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                All Partners
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                {users.filter(user => user.role === "partner").length}
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Total registered partners
                            </p>
                        </div>

                        <div className="rounded-2xl bg-green-50 p-4 text-green-500 transition group-hover:bg-green-500 group-hover:text-white">

                            <FaRegHandshake size={28} />

                        </div>
                    </div>
                    {/* Admin Users */}
                    <div className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Administrators
                            </p>

                            <h2 className="mt-2 break-all text-lg font-bold text-slate-800">
                                {users.find(user => user.role === "admin")?.email || "No admin found"}
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Users with admin privileges
                            </p>
                        </div>

                        <div className="rounded-2xl bg-violet-50 p-4 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                            <FiShield size={28} />
                        </div>
                    </div>

                </div>

                {/* Users Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* Responsive Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left">
                            <thead className="bg-slate-50">
                                <tr className="text-xs uppercase tracking-wider text-slate-500">
                                    <th className="px-6 py-4 font-semibold">#</th>
                                    <th className="px-6 py-4 font-semibold">User</th>
                                    <th className="px-6 py-4 font-semibold">Email</th>
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold">Make as Admin</th>
                                    <th className="px-6 py-4 font-semibold">Other Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center text-slate-500"
                                        >
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr
                                            key={user._id}
                                            className="transition-colors hover:bg-orange-50/40"
                                        >
                                            <td className="px-6 py-5 text-sm text-slate-500">
                                                {index + 1}
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle h-12 w-12">
                                                            <img
                                                                src={user.photoURL}
                                                                alt="Avatar Tailwind CSS Component" />
                                                        </div>
                                                    </div>

                                                    <span className="font-semibold text-slate-800">
                                                        {user.displayName}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 text-sm text-slate-600">
                                                {user.email}
                                            </td>

                                            <td className="px-6 py-5">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.role === "admin"
                                                        ? "bg-violet-100 text-violet-700"
                                                        : user.role === "partner"
                                                            ? "bg-amber-100 text-amber-700"
                                                            : "bg-blue-100 text-blue-700"
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
                                                        className="group inline-flex h-10 w-10 items-center justify-center
                       rounded-xl border border-red-200 bg-red-50
                       text-red-600 shadow-sm
                       transition-all duration-200 ease-in-out
                       hover:-translate-y-0.5 hover:border-red-300
                       hover:bg-red-600 hover:text-white hover:shadow-md
                       active:scale-95
                       focus:outline-none focus:ring-2
                       focus:ring-red-400 focus:ring-offset-2"
                                                    >
                                                        <GrUserAdmin size={18} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleMakeAdmin(user)}
                                                        title="Make Admin"
                                                        aria-label={`Make ${user.displayName} an admin`}
                                                        className="group inline-flex h-10 w-10 items-center justify-center
                       rounded-xl border border-orange-200 bg-orange-50
                       text-orange-600 shadow-sm
                       transition-all duration-200 ease-in-out
                       hover:-translate-y-0.5 hover:border-orange-500
                       hover:bg-orange-500 hover:text-white hover:shadow-md
                       active:scale-95
                       focus:outline-none focus:ring-2
                       focus:ring-orange-400 focus:ring-offset-2"
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
                                            className="px-6 py-14 text-center text-slate-500"
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
