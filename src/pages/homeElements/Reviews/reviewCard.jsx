import { FaQuoteLeft } from "react-icons/fa";

const reviewCard = ({ review }) => {
    const { userName, avatar, rating, review: tought } = review;
                      

    return (
        <div className="bg-gray-500 p-4 rounded-3xl space-y-4">
            <FaQuoteLeft className="text-amber-500"></FaQuoteLeft>
            <p>{tought}</p>
            <div className="border-b-1 border-dashed border-white "></div>

            <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-amber-500 p-1 ">
                    <img className="w-full h-full rounded-full"
                        src={avatar} alt="" />
                </div>

                <div>
                    <h2>{userName}</h2>
                    <p>{rating}✨</p>
                </div>
            </div>

        </div>
    );
};

export default reviewCard;