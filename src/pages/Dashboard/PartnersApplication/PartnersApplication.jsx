
import { useQuery } from "@tanstack/react-query";
import { FiUsers, FiClock, FiCheckCircle, FiXCircle, FiMail, FiPhone, FiEye, FiCalendar, FiUser, FiMapPin, FiDollarSign, FiCreditCard, } from "react-icons/fi";
import { FaRegHandshake, FaRegTrashAlt, FaUserCheck } from "react-icons/fa";
import { useRef, useState } from "react";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";
import Swal from "sweetalert2";

// Leaflet marker icon
const parkingMarkerIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="rounded-xl border border-base-300 bg-base-100 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm text-base-content/60">
            {Icon && <Icon className="text-primary" size={16} />}
            <span>{label}</span>
        </div>

        <p className="text-base font-semibold text-base-content">
            {value}
        </p>
    </div>
);

const PartnersApplication = () => {
    const axiosSecure = useAxiosSecure();

    const { data: partners = [], isLoading, isError, refetch } = useQuery({
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

    const statCards = [
        {
            title: "All Applications",
            count: partners.length,
            icon: FiUsers,
            color: "text-primary bg-primary/10",
            hoverColor: "group-hover:bg-primary group-hover:text-black",
        },
        {
            title: "Pending Applications",
            count: pendingPartners.length,
            icon: FiClock,
            color: "text-warning bg-warning/10",
            hoverColor: "group-hover:bg-warning group-hover:text-black",
        },
        {
            title: "Approved Partners",
            count: approvedPartners.length,
            icon: FiCheckCircle,
            color: "text-success bg-success/10",
            hoverColor: "group-hover:bg-success group-hover:text-white",
        },
        {
            title: "Rejected Applications",
            count: rejectedPartners.length,
            icon: FiXCircle,
            color: "text-error bg-error/10",
            hoverColor: "group-hover:bg-error group-hover:text-white",
        },
    ];

    const statusStyle = {
        approved: "bg-success/10 text-success",
        rejected: "bg-error/10 text-error",
        pending: "bg-warning/10 text-warning",
    };

    const [selectedPartner, setSelectedPartner] = useState(null);
    const partnerModalRef = useRef(null);

    const openPartnersInfoModal = (partner) => {
        setSelectedPartner(partner);
        partnerModalRef.current?.showModal();
    };


    //approve/reject
    const updatePartnerStatus = (partner, status) => {
        const updateInfo = {
            status,
            email: partner.email,
        };

        axiosSecure.patch(`/partner/${partner._id}`, updateInfo)
            .then(async (res) => {
                if (res.data.success || res.data.result?.matchedCount > 0 ||
                    res.data.matchedCount > 0) {

                    // Update modal immediately
                    setSelectedPartner((prev) =>
                        prev && prev._id === partner._id
                            ? { ...prev, status }
                            : prev
                    );

                    // Refresh the partner list
                    await refetch();

                    Swal.fire({
                        target: partnerModalRef.current,
                        toast: true,
                        position: "center",
                        icon: "success",
                        title: `Application ${status} successfully`,
                        showConfirmButton: false,
                        timer: 2500,
                        customClass: {
                            container: "swal-above-modal",
                        },
                    });
                }
            })

    };

    const handleApproval = (partner) => {
        updatePartnerStatus(partner, "approved");
    };

    const handleRejection = (partner) => {
        updatePartnerStatus(partner, "rejected");
    };


    return (
        <div className="min-h-screen bg-base-100 p-4 text-base-content transition-colors duration-300 md:p-8">
            <div className="mx-auto max-w-7xl space-y-7">

                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-base-content md:text-4xl">
                        Partners Applications
                    </h1>

                    <p className="mt-2 text-sm text-base-content/60 md:text-base">
                        Review and manage partnership requests from land owners.
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                className="group flex items-center justify-between rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                            >
                                <div>
                                    <p className="text-sm font-medium text-base-content/70">
                                        {card.title}
                                    </p>

                                    <h2 className="mt-2 text-3xl font-bold text-base-content">
                                        {card.count}
                                    </h2>
                                </div>

                                <div
                                    className={`rounded-2xl p-4 transition-all duration-300 ${card.color} ${card.hoverColor}`}
                                >
                                    <Icon size={28} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Applications Table */}
                <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
                    {/* Table Header */}
                    <div className="flex flex-col gap-2 border-b border-base-300 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-base-content">
                                All Partner Applications
                            </h2>

                            <p className="mt-1 text-sm text-base-content/60">
                                Review applicant information and current status.
                            </p>
                        </div>
                    </div>

                    {/* Responsive Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left">
                            <thead className="bg-base-200/70">
                                <tr className="text-xs uppercase tracking-wider text-base-content/60">
                                    <th className="px-6 py-4 font-semibold">
                                        #
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Name
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Contact Information
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Applied On
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-center font-semibold">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-base-300">
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-12 text-center text-base-content/60"
                                        >
                                            <Loading />
                                        </td>
                                    </tr>
                                ) : isError ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-12 text-center text-error"
                                        >
                                            Failed to load partner applications.
                                            Please try again.
                                        </td>
                                    </tr>
                                ) : partners.length > 0 ? (
                                    partners.map((partner, index) => (
                                        <tr
                                            key={partner._id}
                                            className="transition-colors hover:bg-primary/5"
                                        >
                                            <td className="px-6 py-5 text-sm text-base-content/60">
                                                {index + 1}
                                            </td>

                                            <td className="px-6 py-5">
                                                <p className="font-semibold text-base-content">
                                                    {partner.name}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="space-y-2 text-sm text-base-content/70">
                                                    <p className="flex items-center gap-2">
                                                        <FiMail
                                                            size={15}
                                                            className="shrink-0 text-base-content/40"
                                                        />
                                                        {partner.email}
                                                    </p>

                                                    <p className="flex items-center gap-2">
                                                        <FiPhone
                                                            size={15}
                                                            className="shrink-0 text-base-content/40"
                                                        />
                                                        {partner.phone}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 text-sm text-base-content/60">
                                                <div className="flex items-center gap-2">
                                                    <FiCalendar
                                                        size={15}
                                                        className="shrink-0 text-base-content/40"
                                                    />

                                                    {formatDate(partner.createdAt)}
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[partner.status] ||
                                                        "bg-base-200 text-base-content"
                                                        }`}
                                                >
                                                    {partner.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openPartnersInfoModal(partner)
                                                    }
                                                    className="btn btn-sm rounded-full border border-primary/30 bg-primary/10 text-base-content transition hover:border-primary hover:bg-primary hover:text-black"
                                                >
                                                    <FiEye size={17} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-14 text-center"
                                        >
                                            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                <FaRegHandshake size={26} />
                                            </div>

                                            <h3 className="mt-4 font-semibold text-base-content">
                                                No applications found
                                            </h3>

                                            <p className="mt-1 text-sm text-base-content/60">
                                                Partner applications will appear
                                                here when submitted.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <dialog
                ref={partnerModalRef}
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box w-11/12 max-w-3xl rounded-2xl p-0">
                    {selectedPartner && (
                        <>
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-base-300 p-6">
                                <div>
                                    <h3 className="text-2xl text-base-content">
                                        {selectedPartner.name}'s application detail info
                                    </h3>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        partnerModalRef.current?.close()
                                    }
                                    className="btn btn-circle btn-ghost btn-sm text-red-500"
                                    aria-label="Close modal"
                                >
                                    <FiXCircle size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="max-h-[70vh]  overflow-y-auto p-6">

                                <section>
                                    <div className="flex items-center gap-4 space-y-3">
                                        <div>
                                            <h4 className="flex items-center gap-2 text-lg font-semibold">
                                                <FiMapPin className="text-primary" />
                                                Location
                                            </h4>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-center">

                                                <InfoItem
                                                    icon={FiMapPin}
                                                    label="Region"
                                                    value={selectedPartner.region}
                                                />


                                                <InfoItem
                                                    icon={FiMapPin}
                                                    label="District"
                                                    value={selectedPartner.district}
                                                />



                                                <a
                                                    href={`https://www.google.com/maps?q=${selectedPartner.latitude},${selectedPartner.longitude}`}

                                                    className="inline-flex items-center gap-2 text-sm font-semibold border rounded-2xl p-1 bg-red-200 text-red-500 hover:underline animate-pulse"
                                                >
                                                    <FiMapPin size={16} />
                                                    Open in Google Maps
                                                </a>

                                            </div>


                                        </div>

                                    </div>



                                    <div className="overflow-hidden rounded-xl border border-base-300">
                                        <MapContainer
                                            key={`${selectedPartner._id}-${selectedPartner.latitude}-${selectedPartner.longitude}`}
                                            center={[
                                                Number(selectedPartner.latitude),
                                                Number(selectedPartner.longitude),
                                            ]}
                                            zoom={16}
                                            scrollWheelZoom={true}
                                            style={{
                                                height: "350px",
                                                width: "100%",
                                            }}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />

                                            <Marker
                                                position={[
                                                    Number(selectedPartner.latitude),
                                                    Number(selectedPartner.longitude),
                                                ]}
                                                icon={parkingMarkerIcon}
                                            >
                                                <Popup>
                                                    <div className="text-sm">
                                                        <p className="font-semibold">
                                                            {selectedPartner.lotName}
                                                        </p>

                                                        <p>
                                                            {selectedPartner.district},{" "}
                                                            {selectedPartner.region}
                                                        </p>

                                                        <p className="mt-1">
                                                            Latitude:{" "}
                                                            {selectedPartner.latitude}
                                                        </p>

                                                        <p>
                                                            Longitude:{" "}
                                                            {selectedPartner.longitude}
                                                        </p>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>



                                </section>

                                {/* Lot Photo and Name */}
                                <section className="overflow-hidden rounded-xl border border-base-300">

                                    <img
                                        src={selectedPartner.lotPhoto}
                                        alt={selectedPartner.lotName}
                                        className="h-56 w-full object-cover"
                                    />

                                    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                                        <div>
                                            <h4 className="font-semibold text-base-content">
                                                Lot name: {selectedPartner.lotName}
                                            </h4>

                                            <p className="mt-1 flex items-center gap-1 text-sm text-base-content/60">
                                                <FiCalendar
                                                    size={15}
                                                    className="shrink-0 text-primary"
                                                />
                                                {formatDate(selectedPartner.createdAt)}
                                            </p>
                                        </div>

                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[selectedPartner.status] ||
                                                "bg-base-200 text-base-content"
                                                }`}
                                        >
                                            {selectedPartner.status || "Unknown"}
                                        </span>
                                    </div>
                                </section>

                                {/* Personal Information */}
                                <section>
                                    <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                        <FiUser className="text-primary" />
                                        Personal Information
                                    </h4>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <InfoItem
                                            icon={FiUser}
                                            label="Full Name"
                                            value={selectedPartner.name}
                                        />

                                        <InfoItem
                                            icon={FiMail}
                                            label="Email Address"
                                            value={selectedPartner.email}
                                        />

                                        <InfoItem
                                            icon={FiPhone}
                                            label="Phone Number"
                                            value={selectedPartner.phone}
                                        />

                                        <InfoItem
                                            icon={FiCreditCard}
                                            label="National ID (NID)"
                                            value={selectedPartner.nid}
                                        />
                                    </div>
                                </section>



                                {/* Hourly Pricing */}
                                <section>
                                    <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                        <FiDollarSign className="text-primary" />
                                        Hourly Pricing
                                    </h4>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="rounded-xl border border-base-300 p-4">
                                            <p className="text-sm text-base-content/60">
                                                Car Parking
                                            </p>

                                            <p className="mt-2 text-2xl font-bold text-primary">
                                                ৳
                                                {selectedPartner.hourlyPrice_Car ?? "—"}

                                                <span className="ml-1 text-sm font-normal text-base-content/60">
                                                    / hour
                                                </span>
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-base-300 p-4">
                                            <p className="text-sm text-base-content/60">
                                                Motorcycle Parking
                                            </p>

                                            <p className="mt-2 text-2xl font-bold text-primary">
                                                ৳
                                                {selectedPartner.hourlyPrice_Motorcycle ??
                                                    "—"}

                                                <span className="ml-1 text-sm font-normal text-base-content/60">
                                                    / hour
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </section>
                                <section>

                                    <button onClick={() => handleApproval(selectedPartner)}
                                        className='btn btn-sm'><FaUserCheck /> Approve
                                    </button>

                                    <button onClick={() => handleRejection(selectedPartner)}
                                        className='btn btn-sm'><FaRegTrashAlt /> Reject
                                    </button>
                                </section>
                            </div>
                        </>
                    )}
                </div>

            </dialog>
        </div>
    );
};

export default PartnersApplication;
