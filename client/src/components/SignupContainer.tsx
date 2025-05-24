import { useState } from "react";
import Logo from "../assets/DSV.logo.png";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useField from "../hooks/useField";

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
export default function SignupContainer() {
  const fullnameField = useField("");
  const emailField = useField("");
  const passwordField = useField("");
  const confirmPasswordField = useField("");
  const [isChecked, setIsChecked] = useState(false);
  const [checkerror, setCheckError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [googleSignupError, setGoogleSignupError] = useState("");
  const { signup, googleLogin, setUserInfor } = useAuth();

  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleSignupError("");
      const result = await googleLogin(tokenResponse.access_token);
      if (result && result.success) {
        setUserInfor(result.user);
        const redirectPath =
          localStorage.getItem("redirectAfterLogin") ||
          "/document/documentlist";
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath, { replace: true });
      } else {
        if (result && result.statusCode === 409) {
          setGoogleSignupError(
            "This email address is currently being used with email & password.Please sign in with email & password"
          );
        } else {
          setGoogleSignupError(result.message as string);
        }
      }
    },
    onError: (errorResponse) => {
      console.error("Google Login Failed! Error:", errorResponse);
      setGoogleSignupError(`Google login failed`);
    },
    onNonOAuthError(nonOAuthError) {
      console.log(nonOAuthError);
    },
  });

  const navigate = useNavigate();
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setIsChecked(target.checked);
    if (target.checked) {
      setCheckError("");
    }
  };
  const handleSignup = async () => {
    let hasError = false;
    if (!fullnameField.value.trim()) {
      fullnameField.setError("Mandatory field");
      hasError = true;
    }

    if (!emailField.value.trim()) {
      emailField.setError("Mandatory field");
      hasError = true;
    } else if (!isValidEmail(emailField.value)) {
      emailField.setError("Invalid email");
      hasError = true;
    }

    if (!passwordField.value.trim()) {
      passwordField.setError("Mandatory field");
      hasError = true;
    }
    if (!confirmPasswordField.value.trim()) {
      confirmPasswordField.setError("Mandatory field");
      hasError = true;
    }
    if (confirmPasswordField.value.trim() && passwordField.value.trim()) {
      if (confirmPasswordField.value !== passwordField.value) {
        passwordField.setError("Password must be the same");
        confirmPasswordField.setError("Password must be the same");
        hasError = true;
      } else if (
        confirmPasswordField.value.length < 8 ||
        passwordField.value.length < 8
      ) {
        passwordField.setError("Password must be at least 8 character long");
        confirmPasswordField.setError(
          "Password must be at least 8 character long"
        );

        hasError = true;
      }
    }
    if (!isChecked) {
      setCheckError("You must accept all Terms of Service and Privacy Policy");
      hasError = true;
    }
    if (!hasError) {
      try {
        const result = await signup({
          name: fullnameField.value,
          email: emailField.value,
          password: passwordField.value,
        });
        if (result && result.success) {
          const { user_id } = result;
          navigate(`/verifyemail?user_id=${user_id}`);
        } else {
          if (result.statusCode == 409) {
            emailField.setError("Existing email");
          }
        }
      } catch (err) {
        const error = err as any;
        console.log(error);
      }
    }
  };
  return (
    <div className="w-[536px] h-[100vh] absolute right-0 px-[48px] gap-[44px] flex flex-col justify-center items-start roudend-[8px]  bg-[#F5F5F5]">
      <div className=" w-full h-[58px] flex justify-center items-center relative  ">
        <h1 className="w-[176px] h-[100%] tracking-[-0.02em] text-[44px] gap-[4px] items-start flex justify-center text-[#2C2C2C] leading-[1.2] font-bold">
          Sign Up
        </h1>
        <img
          src={Logo}
          className="w-[32px] h-[32px] absolute  items-start top-0 right-[100px]"
        ></img>
      </div>
      <div className="w-full gap-[40px] min-h-[649px] flex flex-col justify-center items-center">
        <div className="w-full h-[48px] flex justify-center items-center gap-[18px] text-[#2C2C2C] bg-white border-[1px] py-[12px] px-[16px] border-[#D9D9D9] rounded-[8px]">
          <FcGoogle className="w-[24px] h-[28px] " />
          <button
            className="w-[147px] h-[16x] text-[14px] font-bold"
            onClick={() => loginGoogle()}
          >
            Continue with google
          </button>
        </div>
        <div className="w-full min-h-[483px] flex flex-col gap-[24px] ">
          <div className="w-full h-[20px] flex justify-center items-center gap-[10px]">
            <div className="w-[157px] border-t border-[#D9D9D9]"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="w-[157px] border-t border-[#D9D9D9]"></div>
          </div>
          {googleSignupError.trim() && (
            <div className="bg-red-50 border-l-4 border-red-800 p-4 rounded-lg">
              <p className=" text-sm">{googleSignupError.trim()}</p>
            </div>
          )}
          <form className="w-full min-h-[336px] flex flex-col gap-[16px]">
            <div className="w-full flex flex-col gap-[8px] justify-between min-h-[70px]">
              <label className="leading-[1.4] h-[22px]">
                Full Name<span className="text-[#ff0101] ml-[4px]">*</span>
              </label>
              <input
                {...fullnameField.bind}
                onChange={(e) => {
                  fullnameField.bind.onChange(e);
                  setGoogleSignupError("");
                }}
                className={`py-[12px] px-[16px] h-[40px]  rounded-[8px] min-w-[240px] bg-white
                 ${fullnameField.errorBorderClass}`}
                placeholder="Input full name"
              ></input>
              {fullnameField.error && (
                <p className="text-[rgba(144,11,9,1)] leading-[1.4] min-h-[20px] text-sm">
                  {fullnameField.error}
                </p>
              )}
            </div>
            <div className="w-full flex flex-col gap-[8px] justify-between min-h-[70px]">
              <label className="leading-[1.4] h-[22px]">
                Email<span className="text-[#ff0101] ml-[4px]">*</span>
              </label>
              <input
                {...emailField.bind}
                onChange={(e) => {
                  emailField.bind.onChange(e);
                  setGoogleSignupError("");
                }}
                className={`py-[12px] px-[16px] h-[40px]  rounded-[8px] min-w-[240px] bg-white 
              ${emailField.errorBorderClass}`}
                placeholder="Input email address"
              ></input>
              {emailField.error && (
                <p className="text-[rgba(144,11,9,1)] leading-[1.4] min-h-[20px] text-sm">
                  {emailField.error}
                </p>
              )}
            </div>
            <div className="w-full flex flex-col  gap-[8px] justify-between min-h-[70px]">
              <label className="leading-[1.4] h-[22px]">
                Password<span className="text-[#ff0101] ml-[4px]">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...passwordField.bind}
                  onChange={(e) => {
                    passwordField.bind.onChange(e);
                    setGoogleSignupError("");
                  }}
                  className={`py-[12px] pr-[40px] pl-[16px] h-[40px] rounded-[8px] min-w-[240px] bg-white w-full
                    ${passwordField.errorBorderClass}`}
                  placeholder="Input password"
                />
                <button
                  type="button"
                  className="absolute right-[12px] top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>
              {passwordField.error && (
                <p className="text-[rgba(144,11,9,1)] leading-[1.4] min-h-[20px] text-sm">
                  {passwordField.error}
                </p>
              )}
            </div>
            <div className="w-[100%] flex flex-col gap-[8px] justify-between min-h-[70px]">
              <label className="leading-[1.4] h-[22px]">
                Re-confirm password
                <span className="text-[#ff0101] ml-[4px]">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmpassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...confirmPasswordField.bind}
                  onChange={(e) => {
                    confirmPasswordField.bind.onChange(e);
                    setGoogleSignupError("");
                  }}
                  className={`py-[12px] pr-[40px] pl-[16px] h-[40px] rounded-[8px] min-w-[240px] bg-white w-full
                    ${confirmPasswordField.errorBorderClass}`}
                  placeholder="Re-confirm password"
                />
                <button
                  type="button"
                  className="absolute right-[12px] top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>
              {confirmPasswordField.error && (
                <p className="text-[rgba(144,11,9,1)] leading-[1.4] min-h-[20px] text-sm">
                  {confirmPasswordField.error}
                </p>
              )}
            </div>
          </form>
          <div className="w-[416px] min-h-[17px] flex flex-col items-start gap-2 mt-2">
            <div className="w-full flex items-center gap-2">
              <input
                id="agree"
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="h-[16px] w-[16px] rounded-[4px] gap-[10px] accent-[#2C2C2C]"
              />
              <label
                htmlFor="agree"
                className="text-[12px] h-[100%] leading-[1.4] text-[#2C2C2C] cursor-pointer"
              >
                I accept all{" "}
                <span className="font-bold hover:underline">
                  {" "}
                  Terms of Service{" "}
                </span>{" "}
                and{" "}
                <span className="font-bold hover:underline">
                  Privacy Policy
                </span>
              </label>
            </div>
            {checkerror.trim() && (
              <p className="text-[rgba(144,11,9,1)] leading-[1.4] min-h-[20px] text-sm">
                {checkerror.trim()}
              </p>
            )}
          </div>
          <button
            className="w-[100%] h-[38px] hover:bg-[#e6b800] bg-[#F5C731] p-[12px] gap-[8px] items-center flex justify-center text-base font-medium rounded-[8px]"
            onClick={handleSignup}
          >
            Sign up
          </button>
        </div>
        <div className="w-[100%] h-[38px] flex flex-row justify-center items-center gap-[8px]">
          <p className="h-[20px] leading-[1.4] text-[#757575]">
            Already have an account?
          </p>
          <button
            onClick={() => navigate("/auth/login")}
            className="h-[38px] py-[8px] px-[0] font-bold hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
