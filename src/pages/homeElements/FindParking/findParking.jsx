import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";
import {  FiMapPin } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import { MdDirectionsBike } from "react-icons/md";
import { Link } from "react-router";


const FindParking = () => {
    const axiosSecure = useAxiosSecure();

    const { data: lots = [], isLoading } = useQuery({
        queryKey: ["approved-partners"],
        queryFn: async () => {
            const res = await axiosSecure.get("/approved-partners");
            return res.data;
        },
    });

    const approvedLots = lots.filter((lot) =>
        lot.status === "approved" &&
        Number.isFinite(Number(lot.latitude)) &&
        Number.isFinite(Number(lot.longitude))
    );

    if (isLoading)
        return <Loading></Loading>;

    return (
        <div className="my-12">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-orange-400 md:text-5xl">
                    Find Your Parking
                </h2>
                <p className="mt-3 text-gray-400">
                    Find your area, book easy.
                </p>
            </div>

            <MapContainer
                center={[23.8103, 90.4125]}
                zoom={7}
                scrollWheelZoom={true}
                className="h-[500px] w-full"
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {approvedLots.map((lot) => (
                    <Marker
                        key={lot._id}
                        position={[
                            Number(lot.latitude),
                            Number(lot.longitude),
                        ]}
                    >
                        <Popup>
                            <div className="w-[260px] overflow-hidden rounded-xl bg-white text-gray-800">


                                <img
                                    src={lot.lotPhoto}
                                    alt={lot.lotName}
                                    className="h-24 w-full rounded-lg object-cover"
                                />

                                <div className="space-y-2 p-2">


                                    <div>
                                        <h3 className="text-base font-bold leading-tight text-gray-900">
                                            {lot.lotName}
                                        </h3>

                                        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                            <FiMapPin className="shrink-0 text-primary" />
                                            {[lot.district, lot.region].filter(Boolean).join(", ")}
                                        </p>
                                    </div>

                                    {/* Hourly Prices */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="rounded-lg bg-orange-50 p-2">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <FaCar />
                                                Car / min
                                            </div>
                                            <p className="mt-1 font-bold text-primary">
                                                ৳{lot.price_Car}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-blue-50 p-2">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <MdDirectionsBike />
                                                Bike / min
                                            </div>
                                            <p className="mt-1 font-bold text-blue-600">
                                                ৳{lot.price_Motorcycle}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Book Now Button */}

                                    <Link to={`/bookNow?id=${lot._id}`}
                                        className="btn btn-primary hover:bg-amber-600 rounded-xl bg-primary !text-white w-full">
                                        Book Now
                                       
                                    </Link>



                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default FindParking;