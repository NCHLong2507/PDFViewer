import { useSearchParams } from "react-router-dom";
import Logo from "../assets/DSV.logo.png";
import toast, { Toaster } from "react-hot-toast";
import api from "../api/axios";
import { useTranslation } from "react-i18next";

export default function VerifyTokenExpired() {
  const [searchParams] = useSearchParams();
  const user_id = searchParams.get("user_id");
  const handleResendEmail = async () => {
    if (!user_id) return;
    try {
      await api.get(`/auth/resendEmail?user_id=${user_id}`);
      toast.success("Resend Verification email sent successfully!", {
        duration: 3000,
        position: "top-right",
      });
    } catch (err) {
      const error = err as any;
      console.log(error);
    }
  };
  const {t} = useTranslation();
  return (
    <>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "#ffffff",
              color: "#3fc66b",
              border: "1.5px solid #3bc368",
              padding: "14px 16px",
              fontSize: "14px",
            },
            iconTheme: {
              primary: "#3fc66b",
              secondary: "#ffffff",
            },
          },
          error: {
            style: {
              background: "#ffffff",
              color: "#e74c3c",
              border: "1px solid #e74c3c",
            },
            iconTheme: {
              primary: "#e74c3c",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <div className="w-[100vw] h-[64px] flex gap-[4px] shadow-md-custom bg-white border-[0.5px] border-[#E3E8EF]">
        <div className="w-[300px] h-[100%] pl-[24px] flex items-center justify-start gap-[12px]">
          <img src={Logo} alt="Logo" className="w-[32px] h-[32px]" />
        </div>
      </div>
      <div
        style={{ minHeight: "calc(100vh - 64px)" }}
        className="min-w-screen flex items-center justify-center bg-gray-100 px-4"
      >
        <div className="bg-white shadow-md rounded-xl p-8 text-center max-w-md w-full">
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold text-red-600 mb-4">
            {t("auth.expiredLink")}
          </h1>
          <p className="text-gray-600 mb-6">
            {t("auth.newVerificationLink")}
          </p>

          <button
            onClick={handleResendEmail}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {t("auth.resendVerifyEmail")}
          </button>

          <p className="text-sm text-gray-500 mt-4">
            {t("auth.noEmailReceived")}
          </p>
        </div>
      </div>
    </>
  );
}
