import { useEffect, useState } from "react";
import Logo from "../../assets/DSV.logo.png";
import SuccessVerify from "../../assets/verify-success.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function VerifyEmail() {
  const [showPopup, setShowPopup] = useState(false);
  const [invalidInvitation, setInvalidInvitation] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [documentID, setDocumentID] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.removeItem("email");
  }, []);

  useEffect(() => {
    const info = searchParams.get("info");
    if (info) {
      try {
        const jsonString = atob(decodeURIComponent(info));
        const data = JSON.parse(jsonString);
        
        if (data && data.status) {
          console.log(data.documentName);
          setDocumentName(data.documentName || "");
          setDocumentID(data.documentID || "");
          setInvalidInvitation(false);
        } else {
          setInvalidInvitation(true);
        }
        setShowPopup(true);
      } catch {
        setInvalidInvitation(true);
        setShowPopup(true);
      }
    }
  }, [searchParams]);

  const handleMove = () => {
    navigate(`/document/documentdetailed?id=${documentID}`);
  };

  return (
    <div>
      <div className="w-[100vw] h-[64px] flex gap-[4px] shadow-md-custom bg-white border-[0.5px] border-[#E3E8EF]">
        <div className="w-[300px] h-[100%] pl-[24px] flex items-center justify-start gap-[12px]">
          <img src={Logo} alt="Logo" className="w-[32px] h-[32px]" />
        </div>
      </div>

      <div className="flex justify-center items-center min-h-screen">
        <div className="w-[628px] h-[346px] gap-[24px] flex flex-col justify-center items-center relative">
          <img
            src={SuccessVerify}
            alt="Success"
            className="w-[192px] h-[192px]"
          />
          <p className="w-[398px] h-[38px] text-center leading-[1.2] text-[rgba(30,30,30,1)] text-[32px] font-bold">
            {t("Well Done!!")}
          </p>
          <p className="text-[18px] leading-[1.4] font-[400]">
            {t("verifyEmailSuccess")}
          </p>
          <button
            onClick={() => navigate("/document/documentlist")}
            className="w-[316px] h-[38px] rounded-[8px] border-[1px] font-[600] text-center items-center p-[6px] hover:bg-[#e6b800] bg-[rgba(245,199,49,1)]"
          >
            {t("Go to my Documents")}
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-start justify-center z-50 pt-16 px-4 pointer-events-none mt-2">
          <div className="pointer-events-auto bg-gradient-to-br from-blue-100 via-white to-blue-50 rounded-3xl shadow-xl max-w-md w-full border border-blue-200 relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition text-3xl font-extrabold leading-none"
              aria-label="Close popup"
            >
              ×
            </button>

            {!invalidInvitation ? (
              <div className="p-8">
                <h2 className="text-3xl font-extrabold mb-6 text-blue-800 tracking-tight text-center">
                  {t("You're Invited to the Document")}
                </h2>

                <div className="text-center text-xl font-medium text-blue-900 bg-blue-50 p-4 rounded-lg shadow-sm hover:bg-blue-100 transition-colors duration-300 break-words cursor-pointer select-all">
                  {documentName || t("No document name")}
                </div>

                <button
                  onClick={handleMove}
                  className="mt-8 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all duration-300 ease-in-out"
                >
                  {t("Move to Document")}
                </button>
              </div>
            ) : (
              <div className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-4 text-red-600 tracking-wide">
                  {t("Invalid Invitation")}
                </h2>
                <p className="text-gray-700 text-lg">
                  {t("invalidinvitation")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
