import { Link } from "react-router";
import { FiXCircle, FiRefreshCw, FiArrowLeft } from "react-icons/fi";

const PaymentFaild = () => {
    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-base-200/40 px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border border-base-300 bg-base-100 p-8 text-center shadow-lg sm:p-10">

              
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-error/10">
                    <FiXCircle className="text-error" size={48} />
                </div>

               
                <h1 className="mt-6 text-2xl font-extrabold sm:text-3xl">
                    Payment Failed!
                </h1>

                <p className="mt-3 leading-7 text-base-content/60">
                    We couldn't process your payment.Please check your payment
                    details and try again.
                </p>

               
                <div className="mt-8 flex flex-col gap-3">
                    <Link
                        to="dashboard/ManageMyBooking"
                        className="btn btn-primary w-full"
                    >
                        <FiRefreshCw size={18} />
                        Try Again
                    </Link>

                    <Link
                        to="/"
                        className="btn btn-outline w-full"
                    >
                        <FiArrowLeft size={18} />
                        Back to Home
                    </Link>
                </div>

              
            </div>
        </div>
    );
};

export default PaymentFaild;