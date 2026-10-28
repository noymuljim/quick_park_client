import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";
import { FiMapPin, FiSearch, FiX } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import { MdDirectionsBike } from "react-icons/md";
import { Link, NavLink } from "react-router";

// Fly map to a target. Must live inside MapContainer.
const FlyTo = ({ target }) => {
    const map = useMap();

    useEffect(() => {
        if (target && Number.isFinite(target.lat) && Number.isFinite(target.lng)) {
            map.flyTo([target.lat, target.lng], 14, { duration: 1.5 });
        }
    }, [target, map]);

    return null;
};

const PHOTON = "https://photon.komoot.io/api/";
const BD_BBOX = "88.0,20.5,92.7,26.7"; // Bangladesh bounds

// Photon feature -> simple place object
const toPlace = (f) => {
    const p = f.properties;
    const title =
        p.name ||
        [p.housenumber, p.street].filter(Boolean).join(" ") ||
        p.district ||
        p.city ||
        "Unnamed place";

    const subtitle = [
        ...new Set(
            [p.street, p.district, p.city, p.state]
                .filter(Boolean)
                .filter((part) => part !== title)
        ),
    ].join(", ");

    return {
        title,
        subtitle,
        label: [title, subtitle].filter(Boolean).join(", "),
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
    };
};

// Remove duplicate labels from suggestion list
const uniqueByLabel = (places) => {
    const seen = new Set();
    return places.filter((p) => {
        if (seen.has(p.label)) return false;
        seen.add(p.label);
        return true;
    });
};

// `target` prop comes from banner search: { lat, lng } (new object each search)
const FindParking = ({ target: externalTarget }) => {
    const axiosSecure = useAxiosSecure();

    const { data: lots = [], isLoading } = useQuery({
        queryKey: ["approved-partners"],
        queryFn: async () => {
            const res = await axiosSecure.get("/approved-partners");
            return res.data;
        },
    });

    const approvedLots = lots.filter(
        (lot) =>
            lot.status === "approved" &&
            Number.isFinite(Number(lot.latitude)) &&
            Number.isFinite(Number(lot.longitude))
    );

    // Target from this component's own search
    const [localTarget, setLocalTarget] = useState(null);

    // Search state
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [suggesting, setSuggesting] = useState(false); // typing spinner
    const [loading, setLoading] = useState(false); // submit spinner
    const [error, setError] = useState("");

    const picked = useRef(""); // label user just chose, skip refetch for it
    const wrapperRef = useRef(null);
    const mapRef = useRef(null);

    // Debounced suggestions
    useEffect(() => {
        const q = query.trim();
        if (q.length < 3 || q === picked.current) return;

        const ctrl = new AbortController();
        const timer = setTimeout(async () => {
            setSuggesting(true);
            try {
                const res = await fetch(
                    `${PHOTON}?q=${encodeURIComponent(q)}&limit=6&bbox=${BD_BBOX}`,
                    { signal: ctrl.signal }
                );
                if (!res.ok) throw new Error("Bad response");
                const data = await res.json();
                setSuggestions(uniqueByLabel((data.features ?? []).map(toPlace)));
                setActiveIndex(-1);
                setOpen(true);
            } catch (err) {
                if (err.name !== "AbortError") setSuggestions([]);
            } finally {
                if (!ctrl.signal.aborted) setSuggesting(false);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            ctrl.abort();
        };
    }, [query]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const goTo = (place) => {
        picked.current = place.label;
        setQuery(place.label);
        setSuggestions([]);
        setOpen(false);
        setActiveIndex(-1);
        setSuggesting(false);
        setError("");

        // New object each time -> FlyTo re-runs even for same place
        setLocalTarget({ lat: place.lat, lng: place.lng });

        // On phones map sits below search, bring it into view
        if (window.matchMedia("(max-width: 767px)").matches) {
            mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    // Fetch best match for free text, then fly there
    const searchText = async (text) => {
        const q = text.trim();
        if (!q) return;

        setLoading(true);
        setError("");
        try {
            const res = await fetch(
                `${PHOTON}?q=${encodeURIComponent(q)}&limit=1&bbox=${BD_BBOX}`
            );
            if (!res.ok) throw new Error("Bad response");
            const data = await res.json();

            if (!data.features?.length) {
                setError("No place found. Try an area or road name.");
                return;
            }
            goTo(toPlace(data.features[0]));
        } catch {
            setError("Search failed. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        if (open && suggestions.length) {
            goTo(suggestions[activeIndex >= 0 ? activeIndex : 0]);
            return;
        }
        searchText(query);
    };

    const handleKeyDown = (e) => {
        if (!suggestions.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActiveIndex((i) => (i + 1) % suggestions.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
            setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        } else if (e.key === "Escape") {
            setOpen(false);
            setActiveIndex(-1);
        }
    };

    const clearSearch = () => {
        picked.current = "";
        setQuery("");
        setSuggestions([]);
        setOpen(false);
        setSuggesting(false);
        setError("");
    };

    if (isLoading) return <Loading></Loading>;

    const showSpinner = suggesting || loading;

    return (
        <div id="find-parking" className="my-12">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-orange-400 md:text-5xl">
                    Find Your Parking
                </h2>
                <p className="mt-3 text-gray-400">Find your area, book easy.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6">
                {/* Map */}
                <div ref={mapRef} className="order-2 md:order-1">
                    <MapContainer
                        center={[23.8103, 90.4125]}
                        zoom={11}
                        scrollWheelZoom={true}
                        className="h-[420px] rounded-2xl md:h-[600px]"
                    >
                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <FlyTo target={externalTarget} />
                        <FlyTo target={localTarget} />

                        {approvedLots.map((lot) => (
                            <Marker
                                key={lot._id}
                                position={[Number(lot.latitude), Number(lot.longitude)]}
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
                                                    {[lot.district, lot.region]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                </p>
                                            </div>

                                            {/* Prices */}
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

                                            {/* Book Now */}
                                            <Link
                                                to={`/bookNow?id=${lot._id}`}
                                                className="btn btn-primary hover:bg-amber-600 rounded-xl bg-primary !text-white w-full"
                                            >
                                                Book Now
                                            </Link>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* Search panel. z-[1000] keeps dropdown above Leaflet panes */}
                <div className="relative z-[1000] order-1 flex items-center justify-center md:order-2">
                    <div className="w-full max-w-xl px-1">
                        <h3 className="text-2xl font-semibold text-secondary md:text-3xl">
                            Where do you need to park?
                        </h3>
                        <p className="mt-2 text-sm text-gray-400">
                            Type an area, road or landmark. The map jumps there and
                            shows approved lots nearby.
                        </p>

                        {/* Search field */}
                        <div ref={wrapperRef} className="relative mt-6">
                            <form
                                onSubmit={handleSubmit}
                                role="search"
                                className="flex items-center rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 transition focus-within:ring-2 focus-within:ring-orange-400"
                            >
                                <FiSearch className="ml-3 shrink-0 text-xl text-gray-400" />

                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        picked.current = "";
                                        setQuery(value);
                                        setError("");
                                        if (value.trim().length < 3) {
                                            setSuggestions([]);
                                            setOpen(false);
                                            setSuggesting(false);
                                        }
                                    }}
                                    onFocus={() => suggestions.length && setOpen(true)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search location (e.g. Dhanmondi, Dhaka)"
                                    autoComplete="off"
                                    role="combobox"
                                    aria-expanded={open}
                                    aria-controls="parking-suggestions"
                                    aria-autocomplete="list"
                                    aria-label="Search location"
                                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base text-gray-900 outline-none placeholder:text-gray-400"
                                />

                                {showSpinner && (
                                    <span
                                        className="mr-2 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-gray-200 border-t-orange-400"
                                        aria-label="Searching"
                                    />
                                )}

                                {query && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        aria-label="Clear search"
                                        className="mr-1 shrink-0 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                                    >
                                        <FiX />
                                    </button>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !query.trim()}
                                    className="shrink-0 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Search
                                </button>
                            </form>

                            {/* Suggestions */}
                            {open && suggestions.length > 0 && (
                                <ul
                                    id="parking-suggestions"
                                    role="listbox"
                                    className="absolute inset-x-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl bg-white p-1.5 text-left text-gray-800 shadow-2xl ring-1 ring-black/5"
                                >
                                    {suggestions.map((s, i) => (
                                        <li
                                            key={`${s.lat}-${s.lng}-${i}`}
                                            role="option"
                                            aria-selected={i === activeIndex}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => goTo(s)}
                                                onMouseEnter={() => setActiveIndex(i)}
                                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                                                    i === activeIndex ? "bg-orange-50" : ""
                                                }`}
                                            >
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
                                                    <FiMapPin />
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block truncate text-sm font-medium text-gray-900">
                                                        {s.title}
                                                    </span>
                                                    {s.subtitle && (
                                                        <span className="block truncate text-xs text-gray-500">
                                                            {s.subtitle}
                                                        </span>
                                                    )}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {error && (
                            <p role="alert" className="mt-3 text-sm text-red-400">
                                {error}
                            </p>
                        )}

                        <p className="mt-10 text-sm text-primary">
                            {approvedLots.length > 0
                                ? `Till now total ${approvedLots.length} ${
                                      approvedLots.length === 1 ? "partner" : "partners"
                                  } added their free space on the map and starts passive earning.`
                                : "No approved parking lots yet."}
                        </p>

                        {/* Partner CTA */}
                        <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-medium text-white">Own a parking space?</p>
                                <p className="text-sm text-gray-400">
                                    List it and start earning.
                                </p>
                            </div>
                            <NavLink
                                to="/becomePartner"
                                className="shrink-0 rounded-xl bg-primary px-6 py-3 text-center font-semibold text-white transition hover:bg-amber-500"
                            >
                                Become a Partner
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindParking;
