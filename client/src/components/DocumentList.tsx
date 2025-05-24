import { useEffect, useState, useRef } from "react";
import DocumentHeader from "./DocumentHeader";
import DocumentContainer from "./DocumentContainer";
import api from "../api/axios";
import type { Document } from "../interface/document";
import { useQuery } from "@tanstack/react-query";

const fetchDocumentCount = async () => {
  const res = await api.get("/document/documentcount");
  return res.data.count;
};

export default function DocumentList() {
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [documentList, setDocumentList] = useState<Document[]>([]);
  const [id, setId] = useState(0);
  const [sortOrder, setSortOrder] = useState(false);
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
    const res = await api.get(`/document/loaddocument?id=${id}&sort=${sort}`);
    return res.data?.documents || [];
  };

  const { data: initialDocuments = [], isFetched } = useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isFirst,
  });

  useEffect(() => {
    if (isFetched) {
      setDocumentList(initialDocuments);
      prevSortOrder.current = sortOrder;
    }
  }, [isFetched]);

  useEffect(() => {
    const LazyLoadDocuments = async () => {
      const sort = sortOrder ? 1 : -1;
      try {
        const results = await api.get(
          `/document/loaddocument?id=${id}&sort=${sort}`
        );
        const documents = results.data?.documents;
        if (prevSortOrder.current !== sortOrder) {
          setDocumentList(documents); // sort changed, reset
          prevSortOrder.current = sortOrder;
        } else {
          setDocumentList(
            (prevList) => prevList && [...prevList, ...documents]
          );
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
    showAlert,
    setShowAlert,
    showSuccess,
    setShowSuccess,
    alertMessage,
    setAlertMessage,
    documentList,
    setDocumentList,
    setId,
    count,
    refetchCount,
    sortOrder,
    setSortOrder,
  };
  const {
    showAlert: _,
    showSuccess: __,
    alertMessage: ___,
    setId: ____,
    setSortOrder: _____,
    ...headerProps
  } = props;

  return (
    <div className="flex-col flex gap-[16px] px-[24px] pt-[24px] pb-[16px]">
      <DocumentHeader {...headerProps} />
      <DocumentContainer {...props} />
    </div>
  );
}
