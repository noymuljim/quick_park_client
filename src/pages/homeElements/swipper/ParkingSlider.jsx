import "swiper/css";
import "swiper/css/free-mode";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

const parkingLines = [
  "Find. Park. Go.",
  "Park Smarter",
  "Parking Made Easy",
  "Find Your Spot",
  "Park Without Stress",
  "Drive In. Park Easy.",
  "Smart Parking",
];

const ParkingSlider = () => {
  return (
    <div className="relative w-full overflow-hidden bg-black py-4">

      {/* Left fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-black to-transparent" />

      {/* Right fade */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-black to-transparent" />

      <Swiper
        modules={[Autoplay, FreeMode]}
        slidesPerView="auto"
        spaceBetween={60}
        loop={true}
        allowTouchMove={false}

        freeMode={{
          enabled: true,
          momentum: false,
        }}

        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}

        speed={3000}
        className="[&_.swiper-wrapper]:!ease-linear"
      >
        {parkingLines.map((line, index) => (
          <SwiperSlide key={index} className="!w-auto">
            <span className="whitespace-nowrap text-lg font-medium text-white">
              {line}
            </span>
          </SwiperSlide>
        ))}

        {/* Duplicate for seamless loop */}
        {parkingLines.map((line, index) => (
          <SwiperSlide
            key={`duplicate-${index}`}
            className="!w-auto"
          >
            <span className="whitespace-nowrap text-lg font-medium text-white">
              {line}
            </span>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ParkingSlider;