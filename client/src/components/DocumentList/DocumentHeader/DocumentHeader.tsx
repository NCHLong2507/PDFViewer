import UploadButton from "../Upload/Uploadbutton";
import type { Document } from "../../../interface/document";
import type { QueryObserverResult } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
interface DocumentHeaderProps {
  refetchCount: () => Promise<QueryObserverResult<number, unknown>>;
  count: number;
  refectInitialDocuments: () => Promise<
    QueryObserverResult<Document[], unknown>
  >;
}
export default function DocumentHeader({
  count,
  refetchCount,
  refectInitialDocuments,
}: DocumentHeaderProps) {
  const isEmpty = count == 0;
  const { t } = useTranslation();
  return (
    <div className="h-[52px] w-full flex justify-between items-center py-[8px]">
      <div className="w-[322px] h-[38px] flex gap-[12px]">
        <strong className="w-[190px] h-full text-[28px] flex justify-center items-center font-bold">
          {t("My Document")}
        </strong>
        <div className="w-[1px] h-full bg-[rgba(227,232,239,1)]"></div>
        <div className="flex items-center justify-start">
          <p className="min-w-[68px] h-[26px] leading-[1.4] text-[14px] text-[rgba(117,117,117,1)] flex justify-start items-center text-center">
            {t("totalItems", { count })}
          </p>
        </div>
      </div>
      {!isEmpty && (
        <UploadButton
          refetchCount={refetchCount}
          count={count}
          refectInitialDocuments={refectInitialDocuments}
        />
      )}
    </div>
  );
}
