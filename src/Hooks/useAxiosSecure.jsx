import axios from "axios";
import useAuth from "./useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000'
})


const useAxiosSecure = () => {
const navigate=useNavigate()
    const { user ,LogOut} = useAuth();
        

    useEffect(() => {
        const reqInterceptor = axiosSecure.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${user?.accessToken}`
            return config;
        })
        //response
        const resInterceptor = axiosSecure.interceptors.response.use(response => {


            return response;
        }, (error) => {
            console.log(error);
               const statusCode = error.status;
                if (statusCode === 401 || statusCode === 403) {
                    LogOut()
                        .then(() => {
                            navigate('/login')
                        })
                }

            return Promise.reject(error)
        })
        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);

        }
    }, [user,LogOut, navigate])






    return axiosSecure;
};

export default useAxiosSecure;