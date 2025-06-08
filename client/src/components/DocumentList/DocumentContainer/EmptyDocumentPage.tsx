import type { QueryObserverResult } from "@tanstack/react-query";
import EmptyDocument from "../../../assets/EmptyDocument.png";
import UploadButton from "../Upload/Uploadbutton";
import { useTranslation } from "react-i18next";
import type { Document } from "../../../interface/document";
interface EmptyDocumentPageProps {
  refetchCount: () => Promise<QueryObserverResult<number, unknown>>;
  count: number;
  refectInitialDocuments: () => Promise<
    QueryObserverResult<Document[], unknown>
  >;
}
export default function EmptyDocumentPage({refetchCount, count, refectInitialDocuments}: EmptyDocumentPageProps) {
  const { t } = useTranslation();
  return (
    <div className="w-[232px] h-[308px] gap-[24px] flex flex-col items-center justify-center">
      <img
        src={EmptyDocument}
        className="w-[192px] h-[192px]"
        alt={t("docList.emptyDocument")}
      />
      <p className="w-full h-[22px] leading-[1.4] text-base text-center text-[rgba(75,85,101,1)]">
        {t("docList.emptyCommnent")}
      </p>
      <UploadButton
        refetchCount={refetchCount}
        count={count}
        refectInitialDocuments={refectInitialDocuments}
      />
    </div>
  );
}
