import { useSearchParams } from "react-router-dom";
import Logo from "../assets/DSV.logo.png";
import toast, { Toaster } from "react-hot-toast";
import api from "../api/axios";

export default function VerifyTokenExpired() {
  const [searchParams] = useSearchParams();
  const user_id = searchParams.get("user_id");
  const handleResendEmail = async () => {
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
          <h1 className="text-2xl font-semibold text-red-600 mb-4">
            Liên kết xác minh đã hết hạn
          </h1>
          <p className="text-gray-600 mb-6">
            Nhấn nút bên dưới để gửi lại email xác minh mới.
          </p>
          <button
            onClick={handleResendEmail}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Gửi lại email
          </button>
        </div>
      </div>
    </>
  );
}
