import Logo from '../assets/DSV.logo.png';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import { FiEyeOff } from "react-icons/fi";


export default function LoginContainer() {
  const login = useGoogleLogin({
  onSuccess: tokenResponse => console.log(tokenResponse),
});
  return (
    <div className="w-[456px] h-[630px] top-[101px] absolute left-[1111px] flex flex-col gap-[44px] justify-center items-center rounded-[8px] bg-[#F5F5F5] p-[48px]">
      <div className=" w-[360px] h-[58px] flex justify-center items-center relative  ">
        <h1 className="w-[154px] h-[100%] tracking-[-0.02em] text-[44px] gap-[4px] items-center flex justify-center text-[#2C2C2C] leading-[1.2] font-bold">Sign In</h1>
        <img src={Logo} className='w-[32px] h-[32px] absolute  items-start top-0 right-[74px]'></img>
      </div>
      <div className="w-[100%] h-[48px] flex justify-center items-center gap-[18px] text-[#2C2C2C] bg-white border-[1px] border-[#D9D9D9] rounded-[8px]">
          <FcGoogle className='w-[24px] h-[28px] '/>
          <button className='w-[147px] h-[16x] text-[14px] font-bold' onClick={() => login()}>Continue with google</button>
      </div>
      <div className='w-[100%] h-[360px] gap-[40px] flex flex-col '>
        <div className='w-[100%] h-[266px] flex flex-col gap-[24px]'>
          <div className='w-[100%] h-[20px] flex justify-center items-center gap-[10px]'>
            <div className="w-[157px] border-t border-[#D9D9D9]"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="w-[157px] border-t border-[#D9D9D9]"></div>
          </div>
          <form className='w-[100%] h-[160px] flex flex-col gap-[16px]'>
            <div className='w-[100%] flex flex-col gap-[8px] justify-between h-[70px]'>
              <label className='leading-[1.4] h-[22px]'>Email<span className='text-[#ff0101] ml-[4px]'>*</span></label>
              <input className='py-[12px] px-[16px] h-[40px] border-[1px] border-[#D9D9D9] rounded-[8px] min-w-[240px] bg-white'placeholder='Input email address'></input>
            </div>
            <div className='w-[100%] flex flex-col gap-[8px] justify-between h-[70px]'>
              <label className='leading-[1.4] h-[22px]'>Password<span className='text-[#ff0101] ml-[4px]'>*</span></label>
              <div className="relative">
                <input
                  type="password"
                  className="py-[12px] pr-[40px] pl-[16px] h-[40px] border-[1px] border-[#D9D9D9] rounded-[8px] min-w-[240px] bg-white w-full"
                  placeholder="Input password"
                />
                <button
                  type="button"
                  className="absolute right-[12px] top-1/2 -translate-y-1/2"
                  onClick={() => {/* toggle show/hide logic nếu cần */}}
                >
                  <FiEyeOff/>
                </button>
              </div>
            </div>
          </form>
          <button className='w-[100%] h-[38px] bg-[#F5C731] p-[12px] gap-[8px] items-center flex justify-center text-base font-medium rounded-[8px]'>
            Sign in
          </button>
        </div>
        <div className='w-[100%] h-[38px] flex flex-row justify-center items-center gap-[8px]'>
          <p className='h-[20px] leading-[1.4] text-[#757575]'>Do not have an account?</p>
          <button className='h-[38px] py-[8px] px-[0] font-bold'>Sign up</button>
        </div>
      </div>
    </div>
  )
}