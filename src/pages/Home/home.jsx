import Banner from "../homeElements/banner/Banner";
import ParkingSlider from "../homeElements/swipper/ParkingSlider";
import FindParking from "../homeElements/FindParking/findParking";
import HowWorks from "../homeElements/HowWorks/howWorks";
import Reviews from "../homeElements/Reviews/reviews";
import MobileApp from "../homeElements/MobileApp/mobileApp"
import FAQ from "../homeElements/FAQ/faq";
import { useState } from "react";

const reviewsPromise = fetch('/reviews.json').then(res=> res.json())

const Home = () => {
      const [target, setTarget] = useState(null);
    return (
        <div>
            <Banner onSearch={setTarget}></Banner>
            <ParkingSlider></ParkingSlider>
             <FindParking target={target} />
            <div className="max-w-7xl mx-auto">
               
                <HowWorks />
                <MobileApp/>
                <Reviews reviewsPromise={reviewsPromise}></Reviews>
                <FAQ></FAQ>
                

            </div>
        </div>
    );
};

export default Home;