import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";


const AdminOverview = () => {
    const axiosSecure = useAxiosSecure();

    const { data: earnings = {}, isLoading } = useQuery({
        queryKey: ["admin-earnings"],
        queryFn: async () => {
            const res = await axiosSecure.get("/admin-earnings");
            return res.data;
        }
    });

    if (isLoading) {
        return <Loading></Loading>
    }

    return (
        <div>
            <h1>earning={earnings.totalEarnings}</h1>
        </div>
    );
};

export default AdminOverview;