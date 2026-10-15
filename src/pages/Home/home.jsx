import Banner from "../homeElements/banner/Banner";
import ParkingSlider from "../homeElements/swipper/ParkingSlider";
import FindParking from "../homeElements/FindParking/findParking";
import HowWorks from "../homeElements/HowWorks/howWorks";
import Reviews from "../homeElements/Reviews/reviews";
import MobileApp from "../homeElements/MobileApp/mobileApp"
import FAQ from "../homeElements/FAQ/faq";
const reviewsPromise = fetch('/reviews.json').then(res=> res.json())

const home = () => {
    return (
        <div>
            <Banner></Banner>
            <ParkingSlider></ParkingSlider>
             <FindParking />
            <div className="max-w-7xl mx-auto">
               
                <HowWorks />
                <MobileApp/>
                <Reviews reviewsPromise={reviewsPromise}></Reviews>
                <FAQ></FAQ>
                

            </div>
        </div>
    );
};

export default home;