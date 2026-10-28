import Loading from "../../../components/Loading/Loading";
import useRole from "../../../Hooks/useRole";
import AdminOverview from "./AdminOverview";
import PartnerOverview from "./PartnerOverview";
import UserOverview from "./UserOverview";

const DashboardHome = () => {
    const { roleLoading, role } = useRole()
    if (roleLoading) {
        return <Loading></Loading>

    }

      if(role=== 'admin'){
        return <AdminOverview></AdminOverview>
    }
    else if( role=== 'partner'){
        return<PartnerOverview></PartnerOverview>
    }
    else{
        return<UserOverview></UserOverview>
    }
};

export default DashboardHome;