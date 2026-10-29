import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";


const Stat = () => {
    const axiosSecure = useAxiosSecure();

    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ["stats"],
        queryFn: async () => {
            const res = await axiosSecure.get("/stats");
            return res.data;
        },
    });
    if (isLoading) return <Loading></Loading>


    return (
        <div className="bg-secondary py-10 flex text-center ">

            <div className="flex-1 border-r-2 border-primary">
                <h1 className="text-primary font-bold text-6xl">{stats.totalActiveUsers}</h1>
                <p className="text-primary ">Total users</p>
            </div>
            <div  className="flex-1">
                <h1 className="text-primary font-bold text-6xl">{stats.totalTrustedPartners}</h1>
                <p className="text-primary ">Total partners</p>
            </div>

        </div>
    );
};

export default Stat;
