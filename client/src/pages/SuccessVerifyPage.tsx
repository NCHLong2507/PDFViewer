import { useEffect } from "react";
import Logo from "../assets/DSV.logo.png";
import SuccessVerify from "../assets/verify-success.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.removeItem("email");
  }, []);

  return (
    <div>
      <div className="w-[100vw] h-[64px] flex gap-[4px] shadow-md-custom bg-white border-[0.5px] border-[#E3E8EF]">
        <div className="w-[300px] h-[100%] pl-[24px] flex items-center justify-start gap-[12px]">
          <img src={Logo} alt="Logo" className="w-[32px] h-[32px]" />
        </div>
      </div>

      <div
        className="flex justify-center items-center"
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        <div className="w-[628px] h-[346px] gap-[24px] flex flex-col justify-center items-center relative">
          <img
            src={SuccessVerify}
            alt="Success"
            className="w-[192px] h-[192px]"
          />
          <p className="w-[398px] h-[38px] text-center leading-[1.2] text-[rgba(30,30,30,1)] text-[32px] font-bold">
            {t("auth.wellDone")}
          </p>
          <p className="text-[18px] leading-[1.4] font-[400]">
            {t("auth.verifyEmailSuccess")}
          </p>
          <button
            onClick={() => navigate("/document/documentlist")}
            className="w-[316px] h-[38px] rounded-[8px] border-[1px] font-[600] text-center items-center p-[6px] hover:bg-[#e6b800] bg-[rgba(245,199,49,1)]"
          >
            {t("auth.goToMyDocument")}
          </button>
        </div>
      </div>
    </div>
  );
}
