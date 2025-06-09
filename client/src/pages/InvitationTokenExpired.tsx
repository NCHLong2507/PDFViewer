import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function TokenExpiredPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleGoHome = () => {
    navigate("/document/documentlist", {replace:true});
  };
  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-lg w-full">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
          <svg
            className="h-16 w-16 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {t("auth.invitationExpired")}
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          {t("auth.invalidInvitation")}
          <br />
          {t("auth.newInvitation")}
        </p>

        <button
          onClick={handleGoHome}
          className="mt-6 px-6 py-2 hover:bg-[#e6b800] font-bold bg-[rgba(245,199,49,1)] text-white rounded-lg shadow transition"
        >
          {t("docList.backToDocButton")}
        </button>
      </div>
    </div>
  );
}
