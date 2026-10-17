
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../components/Loading/Loading";
import { FiMapPin } from "react-icons/fi";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";

const BookNow = () => {
    const { user } = useAuth()
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



    // Calculate price per minute
    const pricePerMinute = Number(
        vehicle === "Car"
            ? lot?.price_Car
            : lot?.price_Motorcycle
    ) || 0;

    // Calculate total minutes
    const totalMinutes =
        startTime && endTime && new Date(endTime) > new Date(startTime)
            ? Math.ceil(
                (new Date(endTime) - new Date(startTime)) / 60000
            )
            : 0;
    const duration = `${Math.floor(totalMinutes / 60)} h ${totalMinutes % 60} min`;
    // Calculate total price
    const totalPrice = totalMinutes * pricePerMinute;

    if (isLoading) return <Loading />;



    const handleBooking = async (data) => {
        if (new Date(data.endTime) <= new Date(data.startTime)) {
            alert("End time must be after start time.");
            return;
        }

        const bookingData = {
            lotId: lot._id,
            lotName: lot.lotName,
            vehicle: data.vehicle,
            V_number: data.V_number,
            V_type:data.vehicle,
            startTime: data.startTime,
            endTime: data.endTime,
            location: lot.district,
            totalMinutes,
            pricePerMinute,
            totalPrice,
            user_email: user?.email
        };

     
       
        const res = await axiosSecure.post("/create-checkout-session",bookingData);
        window.location.href = res.data.url;
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
                            className="inline-flex items-center gap-2 text-sm font-semibold border rounded-2xl p-2 bg-green-200 text-green-700 animate-pulse"
                        >
                            <FiMapPin size={16} />
                            Open in Google Maps
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-base-200 via-amber-500/10 to-orange-500/20 p-5 rounded-xl space-y-2 border border-base-300 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10">
                            <p>Car</p>
                            <p className="text-xl font-bold">
                                ৳{lot.price_Car} / <span className="text-sm">min</span>
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-base-200 via-amber-500/10 to-orange-500/20 p-5 rounded-xl space-y-2 border border-base-300 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10">
                            <p>Motorcycle</p>
                            <p className="text-xl font-bold">
                                ৳{lot.price_Motorcycle} /<span className="text-sm">min</span>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div>
                            <label className="label">Vehicle's number plate</label>
                            <input {...register('V_number', { required: true })}
                                type="text"
                                placeholder="Enter your Vegicle's number"
                                className="select select-bordered w-full"
                            />
                            {errors.V_number?.type === 'required' &&
                                <p className='text-red-500'>Vehicle number is required</p>}
                        </div>
                    </div>


                    {/* ----------time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Start Date & Time</label>
                            <input
                                type="datetime-local"
                                {...register("startTime", {
                                    required: true,

                                })}
                                min={now}
                                className="input input-bordered w-full"
                            />
                            {errors.startTime?.type === 'required' &&
                                <p className='text-red-500'>Select one</p>}

                        </div>

                        <div>
                            <label className="label">End Date & Time</label>
                            <input
                                type="datetime-local"
                                {...register("endTime", {
                                    required: true,
                                    validate: (value) =>
                                        !startTime ||
                                        new Date(value) > new Date(startTime) ||
                                        "End time must be after start time.",
                                })}
                                min={startTime || now}
                                className="input input-bordered w-full"
                            />
                            {errors.endTime?.type === 'required' &&
                                <p className='text-red-500'>Select one</p>}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-base-200 via-amber-500/10 to-orange-500/20 p-5 rounded-xl space-y-2 border border-base-300 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10">
                        <div className="flex justify-between">
                            <span>Duration</span>
                            <span>{duration}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>For {vehicle} rate per min</span>
                            <span>৳{pricePerMinute}</span>
                        </div>

                        <div className="divider my-1"></div>

                        <div className="flex justify-between text-xl font-bold">
                            <span>Total</span>
                            <span>৳{totalPrice}</span>
                        </div>
                    </div>
                    {/* pay--------------- */}
                    <button
                        type="submit"
                        className="btn btn-primary w-full rounded-xl"
                    >
                        Book & pay
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookNow;
