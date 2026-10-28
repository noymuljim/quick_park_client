import Forbidden from "../components/Forbidden/Forbidden";
import Loading from "../components/Loading/Loading";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";


const PartnerRoute = ({children}) => {
    const { loading } = useAuth()
    const { role, roleLoading } = useRole()


    if (loading || roleLoading) {
        return <div>
           <Loading></Loading>
        </div>
    }
    if (role !== 'partner') {
        return <Forbidden></Forbidden>
    }

    return children
};

export default PartnerRoute;