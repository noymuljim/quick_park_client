import { useForm } from "react-hook-form";
import Img from "../../../assets/l.png"
import { NavLink, useLocation, useNavigate } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuth from "../../../Hooks/useAuth";

const Login = () => {
    const location=useLocation();
    const navigate=useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signInUser } = useAuth()
    const handleLogin = (data) => {
        signInUser(data.email, data.password)
            .then(res => {
                console.log(res.user)
                navigate(location?.state || '/')
            })
            .catch(err => {
                console.log(err);
            })

        console.log('get all info form data', data)
    }
    return (
        <div className="relative flex min-h-screen items-center justify-center px-4">
            <div className="absolute inset-0 z-0 h-full w-full">
                <img src={Img}
                    className="h-full w-full object-cover object-center"
                />
            </div>

            <div className="absolute inset-0 z-10 bg-black/60"></div>

            <div className="relative z-20 w-full max-w-md">
                <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl md:p-10">


                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-white">
                            Welcome Back
                        </h1>
                        <p className="mt-2 text-sm text-gray-300">
                            Login to your account and manage your parking
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(handleLogin)}
                        className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-200">
                                Email
                            </label>

                            <input {...register('email', { required: true })}
                                type="email"
                                placeholder="Enter your email"
                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-gray-400 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                            />
                            {errors.email?.type === 'required' &&
                                <p className='text-red-500'>Email required</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="mb-2">
                                <label className="text-sm font-medium text-gray-200">
                                    Password
                                </label>
                            </div>

                            <input {...register('password', { required: true })}
                                type="password"
                                placeholder="Enter your password"
                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-gray-400 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                            />

                            {errors.password?.type === 'required' &&
                                <p className='text-red-500'>Password required</p>}
                        </div>


                        <button
                            type="submit"
                            className="w-full rounded-xl bg-orange-400 py-3 font-semibold text-black transition hover:bg-orange-300 hover:shadow-lg hover:shadow-orange-400/20"
                        >
                            Login
                        </button>
                        <div className="divider divider-warning">aaaAAA1!</div>
                        <SocialLogin></SocialLogin>

                    </form>

                    {/* Register */}
                    <p className="mt-7 text-center text-sm text-gray-300">
                        Don't have an account?{" "}


                        <NavLink state={location.state}
                        to="/register" className="font-semibold text-orange-400 hover:text-orange-300">Create an account</NavLink>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Login;