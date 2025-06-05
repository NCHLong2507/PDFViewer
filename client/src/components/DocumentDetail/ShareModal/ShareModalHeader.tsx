import { useTranslation } from "react-i18next";
import type { Document } from "../../../interface/document";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { setEmailInput } from "../../../store/shareModalSlice";
interface ShareModalHeaderProps {
  document: Document;
  action: string[] | undefined;
}
export default function ShareModalHeader({document,action}:ShareModalHeaderProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const emailInput = useSelector((state:RootState)=>state.shareModal.emailInput);
  return (
    <>
      <h2 className="leading-[1.2] font-[600] tracking-tighter text-[rgba(22, 28, 33, 1)] text-[26px] mb-4">
        {t("Share")} “<span className="">{document.name}</span>”
      </h2>

      <input
        type="text"
        value={emailInput}
        onChange={(e) => dispatch(setEmailInput(e.target.value))}
        placeholder="Add people"
        disabled={!action?.includes("ADD")}
        className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 text-sm focus:outline-none focus:ring focus:ring-blue-100"
      />
    </>
  );
}
