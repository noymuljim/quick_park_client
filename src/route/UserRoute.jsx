import Forbidden from "../components/Forbidden/Forbidden";
import Loading from "../components/Loading/Loading";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";


const UserRoute = ({children}) => {
    const { loading } = useAuth()
    const { role, roleLoading } = useRole()


    if (loading || roleLoading) {
        return <div>
           <Loading></Loading>
        </div>
    }
    if (role !== 'user') {
        return <Forbidden></Forbidden>
    }

    return children
};

export default UserRoute;