import { useForm } from "react-hook-form";
import Img from "../../../assets/l.png"
import { Link } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";
import { toast } from "react-toastify";
import axios from "axios";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const Registration = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const axiosSecure = useAxiosSecure()

    const { registerUser, updateUserProfile } = useAuth()
    const handleRegistration = (data) => {
        const profileImage = data.photo[0];


        registerUser(data.email, data.password)
            .then(result => {
                console.log(result.user);
                toast.success("Registration successful! Please login");


                const formData = new FormData();
                formData.append('image', profileImage)
                const imgAiPIurl = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_image_host_key}`
                axios.post(imgAiPIurl, formData)
                    .then(res => {
                        const photoURL = res.data.data.url;

                        const userInfo = {
                            email: data.email,
                            displayName: data.userName,
                            photoURL: photoURL
                        }

                        axiosSecure.post('/users',userInfo)
                        .then(res=>{
                            if(res.data.insertedId){
                                 console.log('user created in db')
                            }
                        })
                        console.log('after img upld', res.data.data.url)

                        const userProfile = {
                            displayName: data.userName,
                            photoURL: photoURL
                        }
                        updateUserProfile(userProfile)
                            .then(() => {
                                console.log('user profile updated')
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    })
            })

            .catch(error => {
                console.log(error)
            })
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
                            Create your profile
                        </h1>
                        <p className="mt-2 text-sm text-gray-300">
                            Register your account
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(handleRegistration)}
                        className="space-y-5">

                        {/* User name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-200">
                                User name
                            </label>

                            <input {...register('userName', { required: true })}
                                type="text"
                                placeholder="Enter your name"
                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-gray-400 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                            />
                            {errors.userName?.type === 'required' &&
                                <p className='text-red-500'>User name is required</p>}
                        </div>
                        {/* photo */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-200">
                                Photo
                            </label>

                            <input
                                {...register("photo", { required: true })}
                                type="file"
                                className="w-full h-12 rounded-xl border border-white/20 bg-white/10 text-sm text-gray-300
    file:mr-4 file:h-full file:border-0 file:bg-orange-500 file:px-4
    file:text-sm file:font-medium file:text-white
    hover:file:bg-orange-300
    focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
                            />
                            {errors.photo?.type === 'required' &&
                                <p className='text-red-500'>Photo is required</p>}
                        </div>
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

                            <input type="password"
                             {...register('password', {
                                required: true, minLength: 6,
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/

                            })}
                                placeholder="Enter your password"
                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-gray-400 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                            />
                            {errors.password?.type === 'required' &&
                                <p className='text-red-500'>Password required</p>}
                            {
                                errors.password?.type === 'minLength' &&
                                <p>pass need minimum 6 character or more</p>
                            }
                            {
                                errors.password?.type === 'pattern' &&
                                <p>must have 1 uppercase letter 1 lowercase letter
                                    1 number 1 special</p>
                            }

                        </div>


                        <button
                            type="submit"
                            className="w-full rounded-xl bg-orange-400 py-3 font-semibold text-white transition hover:bg-orange-300 hover:shadow-lg hover:shadow-orange-400/20"
                        >
                            Register
                        </button>
                        <div className="divider divider-warning">or</div>



                    </form>
                    <SocialLogin></SocialLogin>
                    {/* Login */}
                    <p className="mt-7 text-center text-sm text-gray-300">
                        Already have an account?{" "}
                        <Link state={location.state}
                            to="/login" className="font-semibold text-orange-400 hover:text-orange-300">Login</Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Registration;