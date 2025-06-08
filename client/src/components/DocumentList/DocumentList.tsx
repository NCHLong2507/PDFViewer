import { useEffect, useState, useRef } from "react";
import DocumentHeader from "./DocumentHeader/DocumentHeader";
import DocumentContainer from "./DocumentContainer/DocumentContainer";
import documentListService from "../../services/documentListService";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  setShowAlert,
  setShowSuccess,
  setAlertMessage,
  setDocumentList,
  appendDocumentList,
  setId,
  setSortOrder,
  setIsLazyLoading,
} from "../../store/documentListSlice/documentListSlice";

const fetchDocumentCount = async () => {
  const res = await documentListService.getDocumentCount();
  return res.data.count;
};

export default function DocumentList() {
  const dispatch = useDispatch<AppDispatch>();
  const id = useSelector((state: RootState) => state.docList.id);
  const sortOrder = useSelector((state: RootState) => state.docList.sortOrder);
  const prevSortOrder = useRef(sortOrder);
  const [isFirst, setIsFirst] = useState(true);
  const { data: count, refetch: refetchCount } = useQuery({
    queryKey: ["documentCount"],
    initialData: 0,
    queryFn: fetchDocumentCount,
    refetchOnWindowFocus: false,
  });
  const fetchDocuments = async () => {
    const sort = sortOrder ? 1 : -1;
    const res = await documentListService.getDocumentList(id,sort);
    return res.data?.documents || [];
  };

  const {
    data: initialDocuments = [],
    refetch: refectInitialDocuments,
    isLoading,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 0,
  });
  useEffect(() => {
    return () => {
      dispatch(setDocumentList([]));
      dispatch(setAlertMessage(""));
      dispatch(setId(0));
      dispatch(setShowAlert(false));
      dispatch(setShowSuccess(false));
      dispatch(setSortOrder(false));
    };
  }, []);
  useEffect(() => {
    if (initialDocuments.length > 0) {
      dispatch(setDocumentList(initialDocuments));
      prevSortOrder.current = sortOrder;
    }
  }, [initialDocuments]);

  useEffect(() => {
    const LazyLoadDocuments = async () => {
      const sort = sortOrder ? 1 : -1;
      try {
        if (prevSortOrder.current === sortOrder) {
          dispatch(setIsLazyLoading(true));
        }
        const results = await documentListService.getLazyLoadingDocument(id,sort);
        const documents = results.data?.documents;
        if (prevSortOrder.current !== sortOrder) {
          dispatch(setDocumentList(documents));
          prevSortOrder.current = sortOrder;
        } else {
          dispatch(appendDocumentList(documents));
          dispatch(setIsLazyLoading(false))
        }
      } catch (err: any) {
        console.log(err);
      }
    };
    if (isFirst) {
      setIsFirst(false);
      return;
    }
    LazyLoadDocuments();
  }, [id, sortOrder]);
  const props = {
    count,
    refetchCount,
    refectInitialDocuments,
    isLoading,
  };

  return (
    <div className="flex-col flex gap-[16px] px-[24px] pt-[24px] pb-[16px]">
      <DocumentHeader {...props} />
      <DocumentContainer {...props} />
    </div>
  );
}
