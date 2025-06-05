import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
interface GoogleLoginProps {
  setGoogleError: (error: boolean) => void;
  setGoogleErrorMesssage: (message: string) => void;
  invitation_token: string | null;
}
export default function GoogleLogin({
  setGoogleError,
  setGoogleErrorMesssage,
  invitation_token,
}: GoogleLoginProps) {
  const { googleLogin, setUserInfor } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleError(false);
      const result = await googleLogin(
        tokenResponse.access_token,
        invitation_token
      );
      if (result && result.success) {
        setUserInfor(result.user);
        if (result.directURL) {
          const redirectPath = result.directURL;
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath, { replace: true });
        } else {
          const redirectPath =
            localStorage.getItem("redirectAfterLogin") ||
            "/document/documentlist";
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath, { replace: true });
        }
      } else {
        if (result && result.statusCode === 409) {
          setGoogleError(true);
          setGoogleErrorMesssage(t("auth.loginGoogleError"));
        } else {
          setGoogleError(true);
          setGoogleErrorMesssage(result.message as string);
        }
      }
    },
    onError: (errorResponse) => {
      console.error("Google Login Failed! Error:", errorResponse);
      setGoogleError(true);
      setGoogleErrorMesssage(t(`auth.googleLoginFailed`));
    },
    onNonOAuthError(nonOAuthError) {
      console.log(nonOAuthError);
    },
  });
  return (
    <div className="w-full h-[48px] flex justify-center items-center gap-[18px] text-[#2C2C2C] bg-white border-[1px] border-[#D9D9D9] rounded-[8px]">
      <FcGoogle className="w-[24px] h-[28px]" />
      <button
        className="min-w-[147px] h-[16x] text-[14px] font-bold"
        onClick={() => loginGoogle()}
      >
        {t("auth.googleContinue")}
      </button>
    </div>
  );
}
