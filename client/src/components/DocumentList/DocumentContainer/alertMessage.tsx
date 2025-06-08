import { IoClose } from "react-icons/io5";
import { RiAlertLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { useTranslation } from "react-i18next";
import { setShowAlert } from "../../../store/documentListSlice/documentListSlice";
export default function alertMessage() {
  const alertMessage = useSelector(
    (state: RootState) => state.docList.alertMessage
  );
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  return (
    <div
      className="absolute flex top-[670px] left-[1092px] w-[392px] bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-[8px] items-start gap-3"
      role="alert"
    >
      <div className="pt-1">
        <RiAlertLine className="w-5 h-5 text-red-600" />
      </div>

      <div className="flex-1">
        <strong className="font-bold block">
          {t("docList.cannotUploadFile")}
        </strong>
        <span className="block mt-1">{alertMessage}</span>
      </div>

      <button
        onClick={() => dispatch(setShowAlert(false))}
        className="absolute top-0 right-0 px-4 py-3"
        aria-label="Close alert"
      >
        <IoClose className="h-[24px] w-[24px] text-red-700" />
      </button>
    </div>
  );
}
