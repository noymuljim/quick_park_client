import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";


const useRole = () => {
    const axiosSecure = useAxiosSecure()
    const { user } = useAuth()
    const { data: role = "user", isLoading:roleLoading } = useQuery({
        queryKey: ['user-role', user?.email],
        queryFn:async()=>{
            const res=await axiosSecure.get(`/users/${user.email}/role`)
            return res.data.role;
        }
    })


    return {roleLoading,role}
};

export default useRole;