
import { useSearchParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../components/Loading/Loading";
import { FiMapPin } from "react-icons/fi";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";

const BookNow = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const navigate = useNavigate();

    const axiosSecure = useAxiosSecure();
    const [bookingLoading, setBookingLoading] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            vehicle: "Car",
        },
    });

    const vehicle = watch("vehicle");

    const { data: lots = [], isLoading } = useQuery({
        queryKey: ["approved-partners"],
        queryFn: async () => {
            const res = await axiosSecure.get("/approved-partners");
            return res.data;
        },
    });

    const lot = lots.find((item) => item._id === id);

    const pricePerMinute = Number(
        vehicle === "Car"
            ? lot?.price_Car
            : lot?.price_Motorcycle
    ) || 0;

    if (isLoading) return <Loading />;

    if (!lot) {
        return (
            <div className="p-10 text-center">
                Parking lot not found.
            </div>
        );
    }



    const handleBooking = async (data) => {

        const bookingData = {
            lotId: lot._id,
            lotName: lot.lotName,
            lotPhoto: lot.lotPhoto,
            location: lot.district,        
            V_type: data.vehicle,
            V_number: data.V_number,
            pricePerMinute,
            user_email: user.email,
        };

        try {
            setBookingLoading(true);

            await axiosSecure.post("/bookings", bookingData);

            Swal.fire({
                icon: "success",
                title: "Booking Reserved!",
                text: "Your booking has been created successfully.",
                confirmButtonText: "Go to Dashboard",
            }).then(() => {
                navigate("/dashboard/ManageMyBooking");
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Booking Failed",
                text:
                    error.response?.data?.message ||
                    "Unable to create your booking. Please try again.",
            });
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 py-10 px-4">
            <div className="text-center">
                <h1 className="text-secondary text-2xl font-bold">
                    Book your space
                </h1>

                <p className="text-base-content/60 mb-5">
                    Reserve your parking space and manage your booking
                    from your dashboard.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(handleBooking)}
                className="max-w-3xl mx-auto bg-base-100 rounded-2xl shadow-lg overflow-hidden"
            >
                <img
                    src={lot.lotPhoto}
                    alt={lot.lotName}
                    className="w-full h-64 object-cover"
                />

                <div className="p-6 space-y-5">
                    {/* Parking lot information */}
                    <div className="flex flex-wrap justify-between items-center gap-3">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {lot.lotName}
                            </h1>

                            <p className="text-base-content/70">
                                {lot.district}, {lot.region}
                            </p>
                        </div>

                        <a
                            href={`https://www.google.com/maps?q=${lot.latitude},${lot.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold border rounded-2xl p-2 bg-green-200 text-green-700"
                        >
                            <FiMapPin size={16} />
                            Open in Google Maps
                        </a>
                    </div>

                    {/* Parking prices */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-base-200 p-5 rounded-xl border border-base-300">
                            <p>Car</p>

                            <p className="text-xl font-bold">
                                ৳{lot.price_Car} / min
                            </p>
                        </div>

                        <div className="bg-base-200 p-5 rounded-xl border border-base-300">
                            <p>Motorcycle</p>

                            <p className="text-xl font-bold">
                                ৳{lot.price_Motorcycle} / min
                            </p>
                        </div>
                    </div>

                    {/* Vehicle information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">
                                Select Vehicle
                            </label>

                            <select
                                {...register("vehicle", {
                                    required: true,
                                })}
                                className="select select-bordered w-full"
                            >
                                <option value="Car">Car</option>
                                <option value="Motorcycle">
                                    Motorcycle
                                </option>
                            </select>

                            {errors.vehicle && (
                                <p className="text-red-500">
                                    Select a vehicle.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="label">
                                Vehicle's number plate
                            </label>

                            <input
                                {...register("V_number", {
                                    required: "Vehicle number is required.",
                                })}
                                type="text"
                                placeholder="Enter vehicle number"
                                className="input input-bordered w-full"
                            />

                            {errors.V_number && (
                                <p className="text-red-500">
                                    {errors.V_number.message}
                                </p>
                            )}
                        </div>
                    </div>


                    {/* Booking summary */}
                    <div className="bg-base-200 p-5 rounded-xl border border-base-300 space-y-3">
                        <div className="flex justify-between">
                            <span>Vehicle</span>
                            <span>{vehicle}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Rate per minute</span>
                            <span>৳{pricePerMinute}</span>
                        </div>

                        <p className="text-sm text-red-400">
                            Your reservation expires 10 minutes after
                            your selected booking start time.
                        </p>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={bookingLoading}
                        className="btn btn-primary w-full rounded-xl"
                    >
                        {bookingLoading
                            ? "Creating Booking..."
                            : "Book Now"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookNow;
