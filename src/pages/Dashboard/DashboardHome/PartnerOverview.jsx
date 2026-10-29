import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";

const PartnerOverview = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: revenue = {}, isLoading } = useQuery({
        queryKey: ["partner-revenue", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/partner-earnings/${user.email}`
            );
            return res.data;
        },
        enabled: !!user?.email,
    });

    if (isLoading) {
        return <Loading></Loading>;
    }

    return (
       <div>
        <h1>revenue={revenue.totalEarnings}</h1>
       </div>
    );
};

export default PartnerOverview;