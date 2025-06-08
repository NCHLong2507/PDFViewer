import { useState } from "react";
import Logo from "../../../assets/DSV.logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GoogleLogin from "../GoogleLogin";
import LoginForm from "./LoginForm";

export default function LoginContainer() {
  const [googleError, setGoogleError] = useState(false);
  const [googleErrorMessage, setGoogleErrorMesssage] = useState("");

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <div className="w-[456px] min-h-[630px] max-h-[700px] flex flex-col gap-[44px] mr-[111px] justify-center items-center rounded-[8px] bg-[#F5F5F5] p-[48px]">

      <div className="w-[360px] h-[58px] flex justify-center items-center relative">
        <h1 className="min-w-[154px] h-[100%] tracking-[-0.02em] text-[44px] gap-[4px] items-center flex justify-center text-[#2C2C2C] leading-[1.2] font-bold">
          {t("auth.signIn")}
        </h1>
        <img
          src={Logo}
          className={`${
            i18n.language === "en" ? "right-[74px]" : "right-[38px]"
          } w-[32px] h-[32px] absolute top-0  items-start `}
          alt={t("auth.logo")}
        />
      </div>

      <GoogleLogin
        setGoogleError={setGoogleError}
        setGoogleErrorMesssage={setGoogleErrorMesssage}
        invitation_token={null}
      />

      <div className="w-[100%] min-h-[266px] flex flex-col gap-[24px]">
        <div className="w-[100%] h-[20px] flex justify-center items-center gap-[10px]">
          <div className="w-[157px] border-t border-[#D9D9D9]"></div>
          <span className="text-gray-500 text-sm">{t("or")}</span>
          <div className="w-[157px] border-t border-[#D9D9D9]"></div>
        </div>

        {googleError && (
          <div className="bg-red-50 border-l-4 border-red-800 p-4 rounded-lg">
            <p className=" text-sm">{googleErrorMessage}</p>
          </div>
        )}

        <LoginForm
          setGoogleError={setGoogleError}
        />

        <button
          type="submit"
          form="form-login"
          className={`w-[100%] h-[38px] p-[12px] gap-[8px] items-center flex justify-center text-base font-medium rounded-[8px] hover:bg-[#e6b800] bg-[#F5C731] text-[rgba(44,44,44,1)]`}
        >
          <span>{t("auth.signIn")}</span>
        </button>
      </div>

      <div className="w-[100%] h-[38px] flex flex-row justify-center items-center gap-[8px]">
        <p className="h-[20px] leading-[1.4] text-[#757575]">
          {t("auth.noaccount")}
        </p>
        <button
          onClick={() => navigate("/auth/signup")}
          className="h-[38px] py-[8px] px-[0] font-bold hover:underline cursor-pointer"
        >
          {t("auth.signUp")}
        </button>
      </div>
    </div>
  );
}
