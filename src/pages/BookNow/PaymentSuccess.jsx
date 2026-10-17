import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const PaymentSuccess = () => {
     const[paymentInfo,setPaymentInfo]=useState({})
       const[searchParams]=useSearchParams();
    const sessionId= searchParams.get('session_id')
    const axiosSecure=useAxiosSecure()
    console.log(sessionId)
    useEffect(()=>{
        if(sessionId){
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
            .then(res=>{
                console.log(res.data);
                setPaymentInfo({
                        transactionId:res.data.transactionId,
                       
                    })
            })
        }
    },[sessionId, axiosSecure])
    return (
        <div>
            <h1>success:{paymentInfo.transactionId}</h1>
        </div>
    );
};

export default PaymentSuccess;