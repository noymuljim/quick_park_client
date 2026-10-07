import { use } from "react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import ReviewCard from "./reviewCard";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const Reviews = ({ reviewsPromise }) => {
    const reviews = use(reviewsPromise);

    return (
        <div className="my-24">

            <div className="mb-16 space-y-4 text-center">
                <h1 className="text-3xl font-bold text-orange-400 md:text-5xl">
                    Reviews
                </h1>

                <p className="mx-auto mt-3 max-w-xl text-gray-400">
                    Hear what our customers have to say about their
                    parking experience.
                </p>
            </div>

            <Swiper
                loop={true}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={1}
                breakpoints={{
                    768: {
                        slidesPerView: 3,
                    },
                }}
                coverflowEffect={{
                    rotate: 30,
                   
                    depth: 100,
                    scale: 0.60,
                    modifier: 1,
                    slideShadows: true,
                }}
                pagination={{
                    clickable: true,
                }}
                modules={[
                    EffectCoverflow,
                    Pagination,
                    Autoplay,
                ]}
                className="mySwiper"
            >
                {reviews.map((review) => (
                    <SwiperSlide key={review.id}>
                        <ReviewCard review={review} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Reviews;