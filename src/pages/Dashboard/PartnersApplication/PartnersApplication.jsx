
import { useQuery } from "@tanstack/react-query";
import { FiUsers, FiClock, FiCheckCircle, FiXCircle, FiMail, FiPhone, FiEye, FiCalendar } from "react-icons/fi";
import { FaRegHandshake } from "react-icons/fa";
import { NavLink } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PartnersApplication = () => {
    const axiosSecure = useAxiosSecure();

    const { data: partners = [], isLoading, isError } = useQuery({
        queryKey: ["partners"],
        queryFn: async () => {
            const res = await axiosSecure.get("/partners");
            return res.data;
        },
    });

    const pendingPartners = partners.filter(
        (partner) => partner.status === "pending"
    );

    const approvedPartners = partners.filter(
        (partner) => partner.status === "approved"
    );

    const rejectedPartners = partners.filter(
        (partner) => partner.status === "rejected"
    );

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-7xl space-y-7">


                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800 md:text-4xl">
                        Partners Applications
                    </h1>

                    <p className="mt-2 text-sm text-slate-500 md:text-base">
                        Review and manage partnership requests from land owners.
                    </p>
                </div>

                {/* Partner Statistics */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                    {/* All Applications */}
                    <div className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                All Applications
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                {partners.length}
                            </h2>

                        </div>

                        <div className="rounded-2xl bg-orange-50 p-4 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
                            <FiUsers size={28} />
                        </div>
                    </div>

                    {/* Pending Applications */}
                    <div className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Pending Applications
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                {pendingPartners.length}
                            </h2>

                        </div>

                        <div className="rounded-2xl bg-amber-50 p-4 text-amber-500 transition group-hover:bg-amber-500 group-hover:text-white">
                            <FiClock size={28} />
                        </div>
                    </div>

                    {/* Approved Applications */}
                    <div className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Approved Partners
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                {approvedPartners.length}
                            </h2>


                        </div>

                        <div className="rounded-2xl bg-green-50 p-4 text-green-500 transition group-hover:bg-green-500 group-hover:text-white">
                            <FiCheckCircle size={28} />
                        </div>
                    </div>

                    {/* Rejected Applications */}
                    <div className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Rejected Applications
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                {rejectedPartners.length}
                            </h2>
                        </div>

                        <div className="rounded-2xl bg-violet-50 p-4 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                            <FiXCircle size={28} />
                        </div>
                    </div>
                </div>

                {/* Applications Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* Table Header */}
                    <div className="flex flex-col gap-2 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">
                                All Partner Applications
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Review applicant information and current status.
                            </p>
                        </div>


                    </div>

                    {/* Responsive Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left">

                            <thead className="bg-slate-50">
                                <tr className="text-xs uppercase tracking-wider text-slate-500">
                                    <th className="px-6 py-4 font-semibold">#</th>
                                    <th className="px-6 py-4 font-semibold">Name</th>
                                    <th className="px-6 py-4 font-semibold">Contact Information</th>
                                    <th className="px-6 py-4 font-semibold">Applied On</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 text-center font-semibold">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-12 text-center text-slate-500"
                                        >
                                            <span className="loading loading-spinner loading-md mr-2 text-orange-500"></span>
                                            Loading partner applications...
                                        </td>
                                    </tr>
                                ) : isError ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-12 text-center text-red-500"
                                        >
                                            Failed to load partner applications.
                                            Please try again.
                                        </td>
                                    </tr>
                                ) : partners.length > 0 ? (
                                    partners.map((partner, index) => (
                                        <tr
                                            key={partner._id}
                                            className="transition-colors hover:bg-orange-50/40"
                                        >

                                            <td className="px-6 py-5 text-sm text-slate-500">
                                                {index + 1}
                                            </td>


                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">


                                                    <div>
                                                        <p className="font-semibold text-slate-800">{partner.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                           
                                            <td className="px-6 py-5">
                                                <div className="space-y-2 text-sm text-slate-600">
                                                    <p className="flex items-center gap-2">
                                                        <FiMail
                                                            size={15}
                                                            className="shrink-0 text-slate-400"
                                                        />
                                                        {partner.email}
                                                    </p>

                                                    <p className="flex items-center gap-2">
                                                        <FiPhone
                                                            size={15}
                                                            className="shrink-0 text-slate-400"
                                                        />
                                                        {partner.phone}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Application Date */}
                                            <td className="px-6 py-5 text-sm text-slate-500">
                                                <div className="flex items-center gap-2">
                                                    <FiCalendar
                                                        size={15}
                                                        className="shrink-0 text-slate-400"
                                                    />

                                                    {partner.createdAt
                                                        ? new Date(
                                                            partner.createdAt
                                                        ).toLocaleDateString(
                                                            "en-GB",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            }
                                                        )
                                                        : "—"}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-5">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${partner.status === "approved"
                                                            ? "bg-green-100 text-green-700"
                                                            : partner.status === "rejected"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-amber-100 text-amber-700"
                                                        }`}
                                                >
                                                    {partner.status}
                                                </span>
                                            </td>

                                            {/* Action */}
                                            <td className="px-6 py-5 text-center">
                                                <NavLink to="/" className="btn btn-sm rounded-3xl hover:bg-amber-500 bg-amber-100 text-secondary border ">
                                                    <FiEye size={17} />
                                                    View
                                                </NavLink>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-14 text-center"
                                        >
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                                                <FaRegHandshake size={26} />
                                            </div>

                                            <h3 className="mt-4 font-semibold text-secondary">
                                                No applications found
                                            </h3>

                                            <p className="mt-1 text-sm text-secondary">
                                                Partner applications will appear here when submitted.
                                            </p>
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

export default PartnersApplication;