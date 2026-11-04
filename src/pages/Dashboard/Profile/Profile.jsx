import useAuth from "../../../Hooks/useAuth";
import useRole from "../../../Hooks/useRole";


const Profile = () => {
    const { user, LogOut } = useAuth();
    const { role } = useRole();

    if (!user) return null;


    const handleLogout = () => {
        LogOut()
            .then((result) => console.log(result.user))
            .catch((error) => console.log(error));
    };

    return (
        <div className="w-full border-t border-base-300 p-3">
            <div className="dropdown dropdown-top w-full">
                {/* Profile button */}
                <div
                    tabIndex={0}
                    role="button"
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-primary/10"
                >
                    <div className="avatar shrink-0">
                        <div className="size-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                            <img
                                src={user.photoURL || "https://i.ibb.co/2kRq1Xc/default-avatar.png"}
                                alt={user.displayName || "User"}
                               
                            />
                        </div>
                    </div>

                    <div className="min-w-0 text-left is-drawer-close:hidden">
                        <p className="truncate text-sm font-bold">
                            {user.displayName || "No name"}
                        </p>
                        <p className="truncate text-xs capitalize text-base-content/60">
                            {role}
                        </p>
                    </div>
                </div>

               
                <div
                    tabIndex={0}
                    className="dropdown-content z-50 mb-2 w-64 rounded-2xl border border-base-300 bg-base-100 p-5 text-center shadow-lg"
                >
                    <div className="avatar mb-3">
                        <div className="w-20 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                            <img
                                src={user.photoURL || "https://i.ibb.co/2kRq1Xc/default-avatar.png"}
                                alt={user.displayName || "User"}
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </div>

                    <h3 className="text-lg font-extrabold">
                        {user.displayName || "No name"}
                    </h3>
                    <p className="break-all text-sm text-base-content/70">
                        {user.email}
                    </p>

                    <button
                         onClick={handleLogout}
                        className="btn bg-primary text-white mt-4 w-full rounded-full"
                    >
                       
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;