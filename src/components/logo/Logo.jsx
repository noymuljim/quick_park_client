import logo from "../../assets/logo.png"
const Logo = () => {
    return (
         <div className='flex items-center '>
            <img className="w-[40px] h-[40px] bg-white rounded-xl" src={logo} alt="" />
            <h3 className="text-3xl font-bold ml-2">Quick<span className="text-amber-500 px-1">P</span>ark</h3>						
        </div>
    );
};
export default Logo;