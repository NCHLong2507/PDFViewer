import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import NotFoundImage from "../assets/NotFound.jpg";
import { useTranslation } from "react-i18next";
const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleGoHome = () => {
    navigate("/document/documentlist");
  };

  return (
    <div className="h-[100vh] flex flex-col">
      <NavBar />
      <div className="w-[100vw] flex flex-1 items-center justify-center px-4">
        <div className="text-center h-full items-center justify-center flex flex-col">
          <img src={NotFoundImage} className="w-45 h-45"></img>
          <p className="mt-4 text-3xl font-bold text-gray-800">
            {t("Page Not Found")}
          </p>
          <p className="mt-2 text-gray-600">{t("pageremoved")}</p>
          <button
            onClick={handleGoHome}
            className="mt-6 px-6 py-2 hover:bg-[#e6b800] font-bold bg-[rgba(245,199,49,1)] text-white rounded-lg shadow transition"
          >
            {t("Back to document")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
