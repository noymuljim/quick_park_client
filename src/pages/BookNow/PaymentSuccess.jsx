import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { FiCheckCircle } from "react-icons/fi";


const PaymentSuccess = () => {
    const [paymentInfo, setPaymentInfo] = useState({});
    const [searchParams] = useSearchParams();

    const sessionId = searchParams.get("session_id");
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        if (sessionId) {
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
                .then(res => {
                    setPaymentInfo({
                        transactionId: res.data.paymentInfo?.transactionId
                    });
                });
        }
    }, [sessionId, axiosSecure]);

    return (
        <div className="flex min-h-[70vh] items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl  p-8 text-center ">

                <FiCheckCircle className="mx-auto mb-4 text-success" size={60} />

                <h1 className="mb-2 text-2xl font-bold">
                    Payment Successful!
                </h1>

                <p className="mb-6 text-base-content/60">
                    Your payment has been completed successfully.
                </p>

                <div className="mb-6 rounded-lg bg-base-200 p-4">
                    <p className="mb-1 text-sm text-base-content/60">
                        Transaction ID
                    </p>
                    <p className="text-sm ">
                        {paymentInfo.transactionId || "Loading..."}
                    </p>
                </div>

                <Link to="/dashboard/ManageMyBooking"
                    className="btn btn-primary text-secondary mt-5 w-full rounded-full">View My Bookings</Link>


            </div>
        </div>
    );
};

export default PaymentSuccess;