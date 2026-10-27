import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import { FiSearch, FiMapPin } from "react-icons/fi";
import vid from "../../../assets/heroanim.mp4";

const PHOTON = "https://photon.komoot.io/api/";
const BD_BBOX = "88.0,20.5,92.7,26.7"; // Bangladesh bounds

const toPlace = (f) => {
    const p = f.properties;
    const label = [
        ...new Set(
            [p.name, p.street, p.district, p.city, p.state].filter(Boolean)
        ),
    ].join(", ");

    return {
        label,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
    };
};

const Banner = ({ onSearch }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const skipFetch = useRef(false);
    const wrapperRef = useRef(null);

    // Debounced suggestions
    useEffect(() => {
        if (skipFetch.current) {
            skipFetch.current = false;
            return;
        }

        const q = query.trim();
        if (q.length < 3) return;

        const ctrl = new AbortController();
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `${PHOTON}?q=${encodeURIComponent(q)}&limit=6&bbox=${BD_BBOX}`,
                    { signal: ctrl.signal }
                );
                const data = await res.json();
                setSuggestions(data.features.map(toPlace));
                setOpen(true);
            } catch (err) {
                if (err.name !== "AbortError") setSuggestions([]);
            }
        }, 350);

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
        if (place.label !== query) skipFetch.current = true;
        setQuery(place.label);
        setSuggestions([]);
        setOpen(false);
        setError("");

        // ts forces re-trigger when same place searched twice
        onSearch({ lat: place.lat, lng: place.lng, ts: Date.now() });

        document
            .getElementById("find-parking")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;

        // Suggestions already loaded → take first
        if (suggestions.length) {
            goTo(suggestions[0]);
            return;
        }

        setLoading(true);
        setError("");
        try {
            const res = await fetch(
                `${PHOTON}?q=${encodeURIComponent(q)}&limit=1&bbox=${BD_BBOX}`
            );
            const data = await res.json();

            if (!data.features.length) {
                setError("Location not found. Try another name.");
                return;
            }
            goTo(toPlace(data.features[0]));
        } catch {
            setError("Search failed. Check connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative min-h-screen w-full overflow-hidden">
            <video
                src={vid}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/70"></div>

            <div className="relative z-10 flex min-h-screen items-center justify-center px-5 text-center text-white">
                <div>
                    <h1 className="text-5xl font-bold leading-tight sm:text-6xl md:text-7xl lg:text-8xl">
                        Find Your Easy
                        <span className="block">
                            <span className="text-orange-400">Parking</span> Spot
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base text-gray-200 sm:text-lg md:text-xl">
                        Easy, fast and smart parking at your fingertips.
                    </p>

                    <div className="mt-8 flex flex-col items-center justify-center gap-4">
                        <div
                            ref={wrapperRef}
                            className="relative w-full max-w-xl"
                        >
                            <form
                                onSubmit={handleSubmit}
                                className="flex items-center overflow-hidden rounded-xl bg-white shadow-lg"
                            >
                                <FiSearch className="ml-4 shrink-0 text-xl text-gray-500" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setQuery(value);
                                        if (value.trim().length < 3) {
                                            setSuggestions([]);
                                            setOpen(false);
                                        }
                                    }}
                                    onFocus={() =>
                                        suggestions.length && setOpen(true)
                                    }
                                    placeholder="Search location (e.g. Dhanmondi, Dhaka)"
                                    autoComplete="off"
                                    className="w-full bg-transparent px-3 py-3 text-black outline-none placeholder:text-gray-400"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-orange-400 px-6 py-3 font-semibold text-white transition hover:bg-orange-500 disabled:opacity-60"
                                >
                                    {loading ? "..." : "Search"}
                                </button>
                            </form>

                            {/* Suggestions */}
                            {open && suggestions.length > 0 && (
                                <ul className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl bg-white text-left text-gray-800 shadow-xl">
                                    {suggestions.map((s, i) => (
                                        <li key={`${s.lat}-${s.lng}-${i}`}>
                                            <button
                                                type="button"
                                                onClick={() => goTo(s)}
                                                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-orange-50"
                                            >
                                                <FiMapPin className="shrink-0 text-orange-400" />
                                                <span className="truncate text-sm">
                                                    {s.label}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {error && <p className="text-sm text-red-300">{error}</p>}

                        <NavLink
                            to="/becomePartner"
                            className="rounded-xl border border-amber-500 px-7 py-3 font-semibold text-white transition hover:bg-amber-500"
                        >
                            Become a Partner
                        </NavLink>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;