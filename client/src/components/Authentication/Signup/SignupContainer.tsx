import { useState } from "react";
import Logo from "../../../assets/DSV.logo.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GoogleLogin from "../GoogleLogin";
import SignupForm from "./SignupForm";

export default function SignupContainer() {
  const [isChecked, setIsChecked] = useState(false);
  const [checkerror, setCheckError] = useState("");
  const [googleError, setGoogleError] = useState(false);
  const [googleErrorMessage, setGoogleErrorMesssage] = useState("");
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setIsChecked(target.checked);
    if (target.checked) {
      setCheckError("");
    }
  };
  const invitation_token = searchParams.get("invitation_token");
  return (
    <div className="w-[536px] h-[100vh] absolute right-0 px-[48px] gap-[44px] flex flex-col justify-center items-start roudend-[8px]  bg-[#F5F5F5]">
      <div className=" w-full h-[58px] flex justify-center items-center relative  ">
        <h1 className="w-[176px] h-[100%] tracking-[-0.02em] text-[44px] gap-[4px] items-start flex justify-center text-[#2C2C2C] leading-[1.2] font-bold">
          {t("auth.signUp")}
        </h1>
        <img
          src={Logo}
          className="w-[32px] h-[32px] absolute  items-start top-0 right-[100px]"
        ></img>
      </div>
      <div className="w-full gap-[40px] min-h-[649px] flex flex-col justify-center items-center">
        <GoogleLogin
          setGoogleError={setGoogleError}
          setGoogleErrorMesssage={setGoogleErrorMesssage}
          invitation_token={invitation_token}
        />
        <div className="w-full min-h-[483px] flex flex-col gap-[24px] ">
          <div className="w-full h-[20px] flex justify-center items-center gap-[10px]">
            <div className="w-[157px] border-t border-[#D9D9D9]"></div>
            <span className="text-gray-500 text-sm">{t("auth.or")}</span>
            <div className="w-[157px] border-t border-[#D9D9D9]"></div>
          </div>
          {googleError && (
            <div className="bg-red-50 border-l-4 border-red-800 p-4 rounded-lg">
              <p className=" text-sm">{googleErrorMessage}</p>
            </div>
          )}
          <SignupForm
            isChecked={isChecked}
            setGoogleError={setGoogleError}
            setCheckError={setCheckError}
            setGoogleErrorMesssage={setGoogleErrorMesssage}
          />
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
                {t("auth.agree")}
                <span className="font-bold hover:underline">
                  {" "}
                  {t("auth.termOfService")}
                </span>{" "}
                {t("and ")}
                <span className="font-bold hover:underline">
                  {t("auth.privacyPolicy")}
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
            type="submit"
            form="form-signup"
            className="w-[100%] h-[38px] hover:bg-[#e6b800] bg-[#F5C731] p-[12px] gap-[8px] items-center flex justify-center text-base font-medium rounded-[8px]"
          >
            {t("auth.signUp")}
          </button>
        </div>
        <div className="w-[100%] h-[38px] flex flex-row justify-center items-center gap-[8px]">
          <p className="h-[20px] leading-[1.4] text-[#757575]">
            {t("auth.alreadyHaveAccount")}
          </p>
          <button
            onClick={() => navigate("/auth/login")}
            className="h-[38px] py-[8px] px-[0] font-bold hover:underline cursor-pointer"
          >
            {t("auth.signIn")}
          </button>
        </div>
      </div>
    </div>
  );
}
