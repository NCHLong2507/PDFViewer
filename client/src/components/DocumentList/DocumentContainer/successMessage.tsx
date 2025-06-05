import { FiCheckCircle } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setShowSuccess } from "../../../store/documentListSlice";
import type { AppDispatch } from "../../../store/store";
export default function SuccessMessage() {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  return (
    <div className="flex absolute top-[695px] left-[1092px] items-center justify-between w-[392px] bg-green-50 border-[1px] border-green-400 text-green-700 px-4 py-3 rounded-[8px] shadow-md">
      <div className="flex items-center gap-2">
        <FiCheckCircle className="w-5 h-5" />
        <span className="font-medium">{t("Uploaded successfully")}</span>
      </div>
      <button
        onClick={() => dispatch(setShowSuccess(false))}
        className="top-0 right-0"
      >
        <IoClose className="w-4 h-4" />
      </button>
    </div>
  );
}
