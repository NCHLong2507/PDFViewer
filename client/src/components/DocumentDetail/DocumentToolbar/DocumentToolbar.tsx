import type { WebViewerInstance } from "@pdftron/webviewer";
import ZoomControl from "./ZoomControl";
import PageNavigation from "./PageNavigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { useEffect } from "react";
import { setIsChangeSaved } from "../../../store/documentDetailSlice/documentDetailSlice";
import { useTranslation } from "react-i18next";
interface DocumentToolbarProps {
  instanceRef: React.RefObject<WebViewerInstance>;
}
export default function DocumentToolbar({ instanceRef }: DocumentToolbarProps) {
  const isChangeSaved = useSelector(
    (state: RootState) => state.docDetail.editor.isChangeSaved
  );
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    return () => {
      dispatch(setIsChangeSaved(true));
    };
  }, []);
  return (
    <div className="relative flex justify-center flex-1 items-center bg-white py-4 rounded-b-xl border-[1px] border-[rgba(217,217,217,1)] w-full h-[64px]">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
        {!isChangeSaved ? (
          <div className="flex items-center text-gray-500">
            <svg
              className="animate-spin h-4 w-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{t("docDetail.saving")}</span>
          </div>
        ) : (
          <div className="flex items-center text-green-500">
            <svg
              className="h-5 w-5 mr-2 p-1 rounded-full bg-green-100 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{t("docDetail.allSaved")}</span>
          </div>
        )}
      </div>
      <div className="h-[40px] flex justify-center items-center gap-6">
        <ZoomControl instanceRef={instanceRef} />
        <PageNavigation instanceRef={instanceRef} />
      </div>
    </div>
  );
}
