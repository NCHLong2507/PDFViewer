
import type { Document } from "../../../interface/document";
import { useRef, useCallback } from "react";
import type { QueryObserverResult } from "@tanstack/react-query";
import { setId, addId } from "../../../store/documentListSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import AlertMessage from "./alertMessage";
import SuccessMessage from "./successMessage";
import DocumentTable from "./DocumentTable";
import EmptyDocumentPage from "./EmptyDocumentPage";
interface DocumentContainerProps {
  refetchCount: () => Promise<QueryObserverResult<number, unknown>>;
  count: number;
  refectInitialDocuments: () => Promise<
    QueryObserverResult<Document[], unknown>
  >;
}
export default function DocumentContainer({
  refetchCount,
  count,
  refectInitialDocuments,
}: DocumentContainerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const showAlert = useSelector((state: RootState) => state.docList.showAlert);
  const showSuccess = useSelector(
    (state: RootState) => state.docList.showSuccess
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
    <section className="w-full h-[648px] flex justify-center items-center rounded-[12px] border-[1px] border-[rgba(217,217,217,1)]">
      {count == 0 ? (
        <EmptyDocumentPage
          refetchCount={refetchCount}
          count={count}
          refectInitialDocuments={refectInitialDocuments}
        />
      ) : (
        <div
          ref={containerRef}
          onScroll={onScroll}
          className="w-full h-full bg-white rounded border border-gray-300 scrollbar-hidden overflow-auto"
        >
          {showAlert && <AlertMessage />}
          {showSuccess && <SuccessMessage />}
          <DocumentTable refectInitialDocuments={refectInitialDocuments}/>
        </div>
      )}
    </section>
  );
}
