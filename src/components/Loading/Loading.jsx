
import car from "../../assets/Car.svg";

const Loading = () => {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">

            <img
                src={car}
               
                className=" w-32"
            />

            <h2 className="text-xl font-bold text-secondary">
                Getting things ready
            </h2>

            <p className="mt-2 text-sm text-gray-500">
                Please wait a moment...
            </p>

            <div className="mt-5 flex gap-2">
                <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500" />
            </div>

        </div>
    );
};

export default Loading;
