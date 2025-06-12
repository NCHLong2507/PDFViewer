import type { Document } from "../../../interface/document";
import { useRef, useCallback } from "react";
import type { QueryObserverResult } from "@tanstack/react-query";
import {
  setId,
  addId,
} from "../../../store/documentListSlice/documentListSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import AlertMessage from "./alertMessage";
import SuccessMessage from "./successMessage";
import DocumentTable from "./DocumentTable";
import EmptyDocumentPage from "./EmptyDocumentPage";
import { useTranslation } from "react-i18next";
import LoadingAnimation from "../../Common/LoadingAnimation";
interface DocumentContainerProps {
  refetchCount: () => Promise<QueryObserverResult<number, unknown>>;
  count: number;
  refectInitialDocuments: () => Promise<
    QueryObserverResult<Document[], unknown>
  >;
  isLoading: boolean;
}
export default function DocumentContainer({
  refetchCount,
  count,
  refectInitialDocuments,
  isLoading,
}: DocumentContainerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const showAlert = useSelector((state: RootState) => state.docList.showAlert);
  const showSuccess = useSelector(
    (state: RootState) => state.docList.showSuccess
  );
  const isLazyLoading = useSelector(
    (state: RootState) => state.docList.isLazyLoading
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const prevscrollHeight = useRef<number>(0);
  const onScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight) return;
    if (
      prevscrollHeight.current != scrollHeight &&
      scrollHeight - scrollTop - clientHeight < 100
    ) {
      prevscrollHeight.current = scrollHeight;
      dispatch(addId());
    }
  }, [setId]);

  return (
    <section className="w-full h-[75vh] flex justify-center items-center rounded-[12px] border-[1px] border-[rgba(217,217,217,1)] ">
      {isLoading ? (
        <p className="text-gray-500">{t("docList.loading")}</p>
      ) : count === 0 ? (
        <EmptyDocumentPage
          refetchCount={refetchCount}
          count={count}
          refectInitialDocuments={refectInitialDocuments}
        />
      ) : (
        <div
          ref={containerRef}
          onScroll={onScroll}
          className="w-full h-full bg-white rounded border border-gray-300 scrollbar-hidden overflow-auto relative"
        >
          {showAlert && <AlertMessage />}
          {showSuccess && <SuccessMessage />}
          <DocumentTable refectInitialDocuments={refectInitialDocuments} />
          {isLazyLoading && (
            <LoadingAnimation
              className="w-6 h-6 border-1 border-blue-500"
              position="fixed bottom-14"
            />
          )}
        </div>
      )}
    </section>
  );
}
