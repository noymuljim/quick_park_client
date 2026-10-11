import { useForm, useWatch } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
    useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";


const LocationMarker = ({ position, setPosition }) => {

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;

            const newPosition = [lat, lng];

            setPosition(newPosition);

            console.log("Latitude:", lat);
            console.log("Longitude:", lng);
        },
    });

    if (!position) {
        return null;
    }

    return (
        <Marker position={position}>
            <Popup>
                <div className="text-sm">
                    <p className="mb-1 font-semibold text-gray-900">
                        Selected Parking Location
                    </p>

                    <p className="text-gray-600">
                        Latitude: {position[0].toFixed(6)}
                    </p>

                    <p className="text-gray-600">
                        Longitude: {position[1].toFixed(6)}
                    </p>
                </div>
            </Popup>
        </Marker>
    );
};




const FlyToLocation = ({ target }) => {

    const map = useMap();

    useEffect(() => {
        if (target) {
            map.flyTo(target, 17, { duration: 2 });
        }
    }, [target, map]);

    return null;
};




const PartnerForm = () => {

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();


    const { user } = useAuth();
    const serviceCenters = useLoaderData();
    const axiosSecure = useAxiosSecure();


    const regionsDuplicate = serviceCenters.map((c) => c.region);
    const regions = [...new Set(regionsDuplicate)];

    const riderRegion = useWatch({
        control,
        name: "region",
    });


    const districtsByRegion = (region) => {

        const regionDistricts = serviceCenters.filter(
            (c) => c.region === region
        );

        const districts = regionDistricts.map(
            (d) => d.district
        );

        return districts;
    };




    const [position, setPosition] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [flyTarget, setFlyTarget] = useState(null);


    const handleSearch = async () => {

        const q = searchQuery.trim();

        if (!q) return;

        setSearching(true);
        setSearchResults([]);

        try {

            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=bd&q=${encodeURIComponent(q)}`
            );

            const data = await res.json();

            if (data.length === 0) {

                Swal.fire({
                    icon: "info",
                    title: "No results",
                    text: "Try a different place name.",
                    confirmButtonColor: "#f97316",
                });
            }

            setSearchResults(data);

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Search failed",
                text: "Could not search location. Try again.",
                confirmButtonColor: "#f97316",
            });

        } finally {

            setSearching(false);
        }
    };


    const handleSelectResult = (place) => {

        const coords = [
            parseFloat(place.lat),
            parseFloat(place.lon),
        ];

        setPosition(coords);
        setFlyTarget(coords);
        setSearchResults([]);
        setSearchQuery(place.display_name);
    };


    const handlePartner = (data) => {

        if (!position) {

            Swal.fire({
                icon: "warning",
                title: "Location Required",
                text: "Please select your parking location on the map.",
                confirmButtonText: "Select Location",
                confirmButtonColor: "#f97316",
                background: "#ffffff",
                color: "#1f2937",
            });

            return;
        }




        const partnerData = {
            ...data,

            latitude: position[0],
            longitude: position[1],
        };


        console.log("Partner Data:", partnerData);




        axiosSecure
            .post("/partners", partnerData)

            .then((res) => {

                console.log(res.data);


                if (res.data.insertedId) {

                    Swal.fire({
                        icon: "success",
                        title: "Application Submitted!",
                        text: "Your application has been submitted successfully. You will be notified within 24 hours.",
                        position: "center",
                        showConfirmButton: false,
                        timer: 2500,
                        timerProgressBar: true,
                        background: "#ffffff",
                        color: "#1f2937",

                        customClass: {
                            popup: "rounded-3xl shadow-2xl",
                            title: "text-2xl font-bold",
                        },
                    });
                }
            })

            .catch((error) => {

                console.error(error);

                Swal.fire({
                    icon: "error",
                    title: "Something went wrong!",
                    text: "Your application could not be submitted. Please try again.",
                    confirmButtonColor: "#f97316",
                });
            });
    };



    return (

        <div className="min-h-screen py-12">

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">



                <div className="mb-10 text-center">

                    <h1 className="text-3xl font-bold text-secondary md:text-4xl">
                        List Your Parking Lot
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-primary">
                        Turn your available parking space into a profitable
                        opportunity by partnering with Quick Park.
                    </p>

                </div>



                <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-xl sm:p-8 md:p-10">


                    <form
                        onSubmit={handleSubmit(handlePartner)}
                        className="space-y-8"
                    >



                        <div>

                            <h2 className="mb-1 text-xl font-semibold text-gray-900">
                                Personal Information
                            </h2>

                            <p className="mb-6 text-sm text-gray-500">
                                Provide your personal information for verification.
                            </p>


                            <div className="grid gap-6 md:grid-cols-2">


                                {/* Name */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>

                                    <input
                                        {...register("name", {
                                            required: true,
                                        })}
                                        type="text"
                                        value={user?.displayName || ""}
                                        readOnly
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-orange-400"
                                    />

                                    {errors?.name && (
                                        <p className="mt-1 text-sm text-red-500">
                                            Name is required
                                        </p>
                                    )}

                                </div>


                                {/* Email */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>

                                    <input
                                        {...register("email", {
                                            required: true,
                                        })}
                                        type="email"
                                        value={user?.email || ""}
                                        readOnly
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-orange-400"
                                    />

                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">
                                            Email is required
                                        </p>
                                    )}

                                </div>


                                {/* Phone */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>

                                    <input
                                        {...register("phone", {
                                            required: true,
                                        })}
                                        type="tel"
                                        placeholder="01XXXXXXXXX"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400"
                                    />

                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-500">
                                            Phone number is required
                                        </p>
                                    )}

                                </div>


                                {/* NID */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        NID Number
                                    </label>

                                    <input
                                        {...register("nid", {
                                            required: true,
                                        })}
                                        type="text"
                                        placeholder="Enter your NID number"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400"
                                    />

                                    {errors.nid && (
                                        <p className="mt-1 text-sm text-red-500">
                                            NID number is required
                                        </p>
                                    )}

                                </div>


                                {/* Region */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Region
                                    </label>

                                    <select
                                        {...register("region", {
                                            required: true,
                                        })}
                                        defaultValue=""
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-orange-400"
                                    >

                                        <option value="" disabled>
                                            Pick a region
                                        </option>

                                        {regions.map((r, index) => (

                                            <option
                                                key={index}
                                                value={r}
                                            >
                                                {r}
                                            </option>

                                        ))}

                                    </select>


                                    {errors.region && (
                                        <p className="mt-1 text-sm text-red-500">
                                            Region is required
                                        </p>
                                    )}

                                </div>


                                {/* District */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        District
                                    </label>

                                    <select
                                        {...register("district", {
                                            required: true,
                                        })}
                                        defaultValue=""
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-orange-400"
                                    >

                                        <option value="" disabled>
                                            Pick a district
                                        </option>

                                        {districtsByRegion(riderRegion).map(
                                            (r, index) => (

                                                <option
                                                    key={index}
                                                    value={r}
                                                >
                                                    {r}
                                                </option>

                                            )
                                        )}

                                    </select>


                                    {errors.district && (
                                        <p className="mt-1 text-sm text-red-500">
                                            District is required
                                        </p>
                                    )}

                                </div>

                            </div>

                        </div>


                        <div className="h-px bg-gray-100" />




                        <div>

                            <h2 className="mb-1 text-xl font-semibold text-gray-900">
                                Parking Lot Information
                            </h2>

                            <p className="mb-6 text-sm text-gray-500">
                                Tell us about the parking space you want to list.
                            </p>

                            {/* lot name */}
                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Lot Name
                                </label>

                                <input
                                    {...register("lotName", {
                                        required: true,
                                    })}
                                    type="text"
                                    placeholder="your parking space name"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-orange-400"
                                />

                                {errors?.lotName && (
                                    <p className="mt-1 text-sm text-red-500">
                                        Lot name is required
                                    </p>
                                )}

                            </div>

                            <div className="grid gap-6 md:grid-cols-2">



                                <div className="md:col-span-2">

                                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                        Select Parking Location
                                    </h3>


                                    {/* Search bar */}

                                    <div className="relative mb-3">

                                        <div className="flex gap-2">

                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(e.target.value)
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleSearch();
                                                    }
                                                }}
                                                placeholder="Search location e.g. Dhanmondi, Dhaka"
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400"
                                            />

                                            <button
                                                type="button"
                                                onClick={handleSearch}
                                                disabled={searching}
                                                className="rounded-xl bg-orange-500 px-6 font-medium text-white transition hover:bg-orange-600 disabled:opacity-60"
                                            >
                                                {searching ? "..." : "Search"}
                                            </button>

                                        </div>


                                        {searchResults.length > 0 && (

                                            <ul className="absolute left-0 right-0 top-full z-[1000] mt-2 max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">

                                                {searchResults.map((place) => (

                                                    <li
                                                        key={place.place_id}
                                                        onClick={() =>
                                                            handleSelectResult(place)
                                                        }
                                                        className="cursor-pointer border-b border-gray-100 px-4 py-3 text-sm text-gray-700 last:border-0 hover:bg-orange-50"
                                                    >
                                                        {place.display_name}
                                                    </li>

                                                ))}

                                            </ul>
                                        )}

                                    </div>


                                    {/* Map */}

                                    <div className="h-[500px] w-full overflow-hidden rounded-2xl border border-gray-200">

                                        <MapContainer
                                            className="h-full w-full"
                                            center={[23.8103, 90.4125]}
                                            zoom={7}
                                            scrollWheelZoom={true}
                                        >

                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />


                                            <FlyToLocation target={flyTarget} />


                                            <LocationMarker
                                                position={position}
                                                setPosition={setPosition}
                                            />

                                        </MapContainer>

                                    </div>

                                </div>




                                <div className="md:col-span-2">

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Parking Lot Photo
                                    </label>

                                    <input
                                        {...register("lotPhoto", {
                                            required: true,
                                        })}
                                        type="file"
                                        accept="image/*"
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500
                                        file:mr-4 file:h-full file:border-0
                                        file:bg-orange-500 file:px-5
                                        file:text-sm file:font-medium
                                        file:text-white
                                        hover:file:bg-orange-600
                                        focus:border-orange-400 focus:outline-none
                                        focus:ring-2 focus:ring-orange-400/20"
                                    />

                                    {errors.lotPhoto && (
                                        <p className="mt-1 text-sm text-red-500">
                                            Parking lot photo is required
                                        </p>
                                    )}

                                    <p className="mt-2 text-xs text-gray-400">
                                        Upload a clear photo of your parking lot.
                                    </p>

                                </div>





                            </div>

                        </div>
                        {/* pricing for car*/}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                                <h1 className="font-bold text-black">Car (Hourly Pricing) </h1>

                                <div>


                                    <div className="relative ">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-gray-500">
                                            ৳
                                        </span>


                                        <input
                                            {...register("hourlyPrice_Car", {
                                                required: true,
                                                min: 60,
                                            })}
                                            type="number"
                                            min="60"
                                            placeholder="e.g. 60"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-9 pr-14 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
                                        />


                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                            / hour
                                        </span>

                                    </div>


                                    {errors.hourlyPrice && (
                                        <p className="mt-1 text-sm text-red-500">
                                            Please enter a valid hourly price
                                        </p>
                                    )}

                                </div>
                            </div>
                            <div>
                                <h1 className="font-bold text-black">Motorcycle (Hourly Pricing)</h1>

                                <div>

                                    <div className="relative ">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-gray-500">
                                            ৳
                                        </span>


                                        <input
                                            {...register("hourlyPrice_Motorcycle", {
                                                required: true,
                                                min: 60,
                                            })}
                                            type="number"
                                            min="60"
                                            placeholder="e.g. 60"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-9 pr-14 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
                                        />


                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                            / hour
                                        </span>

                                    </div>


                                    {errors.hourlyPrice && (
                                        <p className="mt-1 text-sm text-red-500">
                                            Please enter a valid hourly price
                                        </p>
                                    )}

                                </div>
                            </div>
                        </div>



                        <div className="flex justify-end pt-2">

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-orange-500 px-8 py-3.5 font-semibold text-white transition hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 md:w-auto"
                            >
                                Submit Application
                            </button>

                        </div>

                    </form>

                </div>


                <p className="mt-6 text-center text-sm text-gray-400">
                    Your information will be securely reviewed by the Quick Park team.
                </p>

            </div>

        </div>
    );
};


export default PartnerForm;