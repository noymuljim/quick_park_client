import Banner from "../homeElements/banner/Banner";
import ParkingSlider from "../homeElements/swipper/ParkingSlider";
import FindParking from "../homeElements/FindParking/findParking";
import HowWorks from "../homeElements/HowWorks/howWorks";
import Reviews from "../homeElements/Reviews/reviews";
import FAQ from "../homeElements/FAQ/faq";
import { useState } from "react";
import ParkingPartner from "../homeElements/parkingPartner/parkingPartner";
import Stat from "../homeElements/Stat/Stat";

const reviewsPromise = fetch('/reviews.json').then(res => res.json())

const Home = () => {
    const [target, setTarget] = useState(null);
    return (
        <div>
            <Banner onSearch={setTarget}></Banner>
            <ParkingSlider></ParkingSlider>
<Stat></Stat>
            <div className="max-w-7xl mx-auto">
                
                <FindParking target={target} />

                <HowWorks />
                <ParkingPartner></ParkingPartner>
                <Reviews reviewsPromise={reviewsPromise}></Reviews>
                <FAQ></FAQ>


            </div>
        </div>
    );
};

export default Home;