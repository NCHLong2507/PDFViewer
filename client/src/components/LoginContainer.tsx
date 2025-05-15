import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/DSV.logo.png';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import useField from "../hooks/useField";
const isValidEmail = (email:string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
export default function LoginContainer() {
  const { login, setUserInfor, userInfor } = useAuth();
  const emailField = useField('');
  const passwordField = useField(''); 
  const [showPassword,setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();
  console.log(userInfor);
  const isLoggedIn = userInfor != null;
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn]);

  const loginGoogle = useGoogleLogin({
    onSuccess: tokenResponse => console.log(tokenResponse),
  });

  const handleSignIn = async () => {
    let hasError = false;
    if (!emailField.value.trim()) {
      emailField.setError('Mandatory field');
      hasError = true;
    } else if (!isValidEmail(emailField.value)) {
      emailField.setError('Invalid email address');
      hasError = true;
    }
    if (!passwordField.value.trim()) {
      passwordField.setError('Mandatory field');
      hasError = true;
    }
    if (!hasError) {
      try {
        const result = await login(emailField.value, passwordField.value);
        if (result && result.success) {
          setUserInfor(result.user);
          navigate('/');
        } else {
          if (result.statusCode == 404) {
            setLoginError('Incorrect email or password');
            emailField.setError('');
            passwordField.setError('');
          }
        }
      } catch (err) {
        const error = err as any;
        console.log(error);
      }
    }
};

  return (
    <div className="w-[456px] min-h-[630px] top-[101px] absolute left-[1111px] flex flex-col gap-[44px] justify-center items-center rounded-[8px] bg-[#F5F5F5] p-[48px]">
      <div className=" w-[360px] h-[58px] flex justify-center items-center relative">
        <h1 className="w-[154px] h-[100%] tracking-[-0.02em] text-[44px] gap-[4px] items-center flex justify-center text-[#2C2C2C] leading-[1.2] font-bold">Sign In</h1>
        <img src={Logo} className='w-[32px] h-[32px] absolute items-start top-0 right-[74px]' alt="logo" />
      </div>

      <div className="w-[100%] h-[48px] flex justify-center items-center gap-[18px] text-[#2C2C2C] bg-white border-[1px] border-[#D9D9D9] rounded-[8px]">
        <FcGoogle className='w-[24px] h-[28px]' />
        <button className='w-[147px] h-[16x] text-[14px] font-bold' onClick={() => loginGoogle()}>
          Continue with google
        </button>
      </div>

      <div className='w-[100%] min-h-[266px] flex flex-col gap-[24px]'>
        <div className='w-[100%] h-[20px] flex justify-center items-center gap-[10px]'>
          <div className="w-[157px] border-t border-[#D9D9D9]"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="w-[157px] border-t border-[#D9D9D9]"></div>
        </div>

        <form className='w-[100%] min-h-[160px] flex flex-col gap-[16px]' onSubmit={e => e.preventDefault()}>
          {/* Email */}
          <div className='w-[100%] flex flex-col gap-[8px] justify-between min-h-[70px]'>
            <label className='leading-[1.4] h-[22px]'>
              Email<span className='text-[#ff0101] ml-[4px]'>*</span>
            </label>
            <input
              {...emailField.bind}
              onChange={(e) => {
                emailField.bind.onChange(e);  
                setLoginError('');            
              }}
              className={`py-[12px] px-[16px] h-[40px]  rounded-[8px] min-w-[240px] bg-white
                ${emailField.error || loginError ? 'border-[1.5px] border-[rgba(144,11,9,1)]' : 'border border-[#D9D9D9]'}`
              }
              placeholder='Input email address'
            />
            {emailField.error && (
              <p className='text-[rgba(144,11,9,1)] leading-[1.4] min-h-[20px] text-sm'>
                {emailField.error}
              </p>
            )}
          </div>

          {/* Password */}
          <div className='w-[100%] flex flex-col gap-[8px] justify-between min-h-[70px]'>
            <label className='leading-[1.4] h-[22px]'>
              Password<span className='text-[#ff0101] ml-[4px]'>*</span>
            </label>
            <div className="relative">
              <input
                {...passwordField.bind}
                onChange={(e) => {
                  passwordField.bind.onChange(e);  
                  setLoginError('');            
                }}
                type={showPassword?"text":"password"}
                className={`py-[12px] pr-[40px] pl-[16px] h-[40px]   rounded-[8px] min-w-[240px] bg-white w-full 
                  ${passwordField.error || loginError ? 'border-[1.5px] border-[rgba(144,11,9,1)]' : 'border border-[#D9D9D9]'}`}
                placeholder="Input password"
              />
              <button
                type="button"
                className="absolute right-[12px] top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword? <FiEye/>: <FiEyeOff/>}
              </button>
            </div>
            {passwordField.error && (
              <p className='text-[rgba(144,11,9,1)] leading-[1.4] min-h-[20px] text-sm'>
                {passwordField.error }
              </p>
            )}
            {loginError && (
              <p className='text-[rgba(144,11,9,1)] leading-[1.4] min-h-[20px] text-sm'>
                {loginError}
              </p>
            )}
          </div>
        </form>

        <button
          className={`w-[100%] h-[38px]  p-[12px] gap-[8px] items-center flex justify-center text-base font-medium rounded-[8px] hover:bg-[#e6b800] bg-[#F5C731] text-[rgba(44,44,44,1)
            `}
          onClick={handleSignIn}
        >
          Sign in
        </button>
      </div>

      <div className='w-[100%] h-[38px] flex flex-row justify-center items-center gap-[8px]'>
        <p className='h-[20px] leading-[1.4] text-[#757575]'>Do not have an account?</p>
        <button onClick={() => navigate('/auth/signup')} className='h-[38px] py-[8px] px-[0] font-bold hover:underline cursor-pointer'>Sign up</button>
      </div>
    </div>
  );
}
