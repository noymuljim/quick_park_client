import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import Loading from "../components/Loading/Loading";

const PrivateRoute = ({children}) => {
    const location=useLocation()
    const { user, loading } = useAuth();

    if (loading) {
        return <div>
            <Loading></Loading>
        </div>
    }
    if (!user) {
        return <Navigate state={location.pathname}  to="/login"></Navigate>;
    }

    return children;
};

export default PrivateRoute;