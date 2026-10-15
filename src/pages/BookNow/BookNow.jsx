
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../components/Loading/Loading";
import { FiMapPin } from "react-icons/fi";
import { useForm } from "react-hook-form";

const BookNow = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const axiosSecure = useAxiosSecure();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const vehicle = watch("vehicle");
    const startTime = watch("startTime");
    const endTime = watch("endTime");

    const { data: lots = [], isLoading } = useQuery({
        queryKey: ["approved-partners"],
        queryFn: async () => {
            const res = await axiosSecure.get("/approved-partners");
            return res.data;
        },
    });

    const lot = lots.find((item) => item._id === id);

    const hourlyRate = Number(
        vehicle === "Car"
            ? lot?.hourlyPrice_Car
            : lot?.hourlyPrice_Motorcycle
    ) || 0;

    const hours =
        startTime && endTime && new Date(endTime) > new Date(startTime)
            ? Math.ceil(
                (new Date(endTime) - new Date(startTime)) / 3600000
            )
            : 0;

    const totalPrice = hours * hourlyRate;

    if (isLoading) return <Loading />;



    const handleBooking = (data) => {
        if (new Date(data.endTime) <= new Date(data.startTime)) {
            alert("End time must be after start time.");
            return;
        }

        const bookingData = {
            lotId: lot._id,
            lotName: lot.lotName,
            vehicle: data.vehicle,
            startTime: data.startTime,
            endTime: data.endTime,
            hours,
            hourlyRate,
            totalPrice,
        };

        console.log(bookingData);
        // Send bookingData to your booking API here.
    };

    const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

    return (
        <div className="min-h-screen bg-base-200 py-10 px-4">
            <div className="text-center">
                <h1 className="text-secondary text-2xl font-bold">
                    Book your space
                </h1>
                <p className="text-gray-400 mb-5">
                    You need just a moment to book and the empty space is yours.
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
                    <div className="flex flex-wrap justify-between items-center gap-3">
                        <div>
                            <h1 className="text-2xl font-bold">{lot.lotName}</h1>
                            <p className="text-base-content/70">
                                {lot.district}, {lot.region}
                            </p>
                        </div>

                        <a
                            href={`https://www.google.com/maps?q=${lot.latitude},${lot.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold border rounded-2xl p-2 bg-orange-200 text-orange-700 animate-pulse"
                        >
                            <FiMapPin size={16} />
                            Open in Google Maps
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-base-200 p-4 rounded-xl">
                            <p>Car</p>
                            <p className="text-xl font-bold">
                                ৳{lot.hourlyPrice_Car}/hour
                            </p>
                        </div>

                        <div className="bg-base-200 p-4 rounded-xl">
                            <p>Motorcycle</p>
                            <p className="text-xl font-bold">
                                ৳{lot.hourlyPrice_Motorcycle}/hour
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="label">Select Vehicle</label>
                        <select
                            {...register("vehicle", { required: true })}
                            className="select select-bordered w-full"
                        >
                            <option value="Car">Car</option>
                            <option value="Motorcycle">Motorcycle</option>
                        </select>
                         {errors.vehicle?.type === 'required' &&
                                <p className='text-red-500'>Select one</p>}
                    </div>


{/* ----------time */}
                    <div>
                        <label className="label">Start Date & Time</label>
                        <input
                            type="datetime-local"
                            {...register("startTime", {
                                required: "Please select a start time.",
                                validate: (value) =>
                                    value >= now || "Start time cannot be in the past.",
                            })}
                            min={now}
                            className="input input-bordered w-full"
                        />
                        {errors.startTime && (
                            <p className="text-error text-sm mt-1">
                                {errors.startTime.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="label">End Date & Time</label>
                        <input
                            type="datetime-local"
                            {...register("endTime", {
                                required: "Please select an end time.",
                                validate: (value) =>
                                    !startTime ||
                                    new Date(value) > new Date(startTime) ||
                                    "End time must be after start time.",
                            })}
                            min={startTime || now}
                            className="input input-bordered w-full"
                        />
                        {errors.endTime && (
                            <p className="text-error text-sm mt-1">
                                {errors.endTime.message}
                            </p>
                        )}
                    </div>

                    <div className="bg-base-200 p-5 rounded-xl space-y-2">
                        <div className="flex justify-between">
                            <span>Duration</span>
                            <span>{hours} hour(s)</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Hourly rate</span>
                            <span>৳{hourlyRate}</span>
                        </div>

                        <div className="divider my-1"></div>

                        <div className="flex justify-between text-xl font-bold">
                            <span>Total</span>
                            <span>৳{totalPrice}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full rounded-xl"
                    >
                        Proceed to Payment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookNow;
