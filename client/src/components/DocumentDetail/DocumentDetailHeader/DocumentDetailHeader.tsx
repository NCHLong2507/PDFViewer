import { FaArrowLeft } from "react-icons/fa6";
import { LuDownload } from "react-icons/lu";
import { FiShare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type { Document } from "../../../interface/document";
import type { QueryObserverResult } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import {
  setShowShareModal,
  toggleDownloadSignal,
} from "../../../store/documentViewerSlice";
interface DocDetailHeaderProps {
  document: Document;
  refetchAction: () => Promise<QueryObserverResult<string[], unknown>>;
}

export default function DocumentDetailedHeader({
  document,
}: DocDetailHeaderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const handleBack = () => {
    navigate('/document/documentlist', { state: { refetch: true } });
  };
  return (
    <div className="flex justify-between w-full h-[52px] pt-2 pb-2">
      <div className="min-w-[524px] flex items-center justify-start h-full gap-3">
        <FaArrowLeft onClick={handleBack} className="w-6 h-6 pr-2" />
        <strong className="text-center justify-center text-2xl">
          {document ? document.name : ""}
        </strong>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => dispatch(toggleDownloadSignal())}
          className="flex items-center gap-3 px-4 py-2 border border-[rgba(118, 118, 118, 1)] rounded-md bg-gray-200 hover:bg-gray-300"
        >
          <LuDownload className="w-4 h-4" />
          <span>{t("Download")}</span>
        </button>

        <button
          onClick={() => dispatch(setShowShareModal(true))}
          className="flex items-center gap-3 px-4 py-2 border border-[rgba(118, 118, 118, 1)] rounded-md bg-gray-200 hover:bg-gray-300"
        >
          <FiShare className="w-4 h-4" />
          <span>{t("Share")}</span>
        </button>
      </div>
    </div>
  );
}
