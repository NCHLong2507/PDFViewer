import { useEffect, useState, useRef } from "react";
import DocumentHeader from "./DocumentHeader";
import DocumentContainer from "./DocumentContainer";
import api from '../api/axios';
import type { Document } from "../interface/document";


export default function DocumentList() {
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess,setShowSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [documentList, setDocumentList] = useState<Document[]>([]);
  const [id, setId] = useState(0);
  const [count, setCount] = useState(0);
  const [sortOrder, setSortOrder] = useState(false);
  const prevSortOrder = useRef(sortOrder);
  useEffect(()=> {
    const GetDocumentCount = async () => {
      try {

        const results = await api.get('/document/documentcount'); 
        setCount(results.data.count);
      } catch (err){
        console.log(err);
        throw err;
      } 
    }
    GetDocumentCount();
  })
  useEffect(()=> {
    const LazyLoadDocuments = async () => {
      const sort = sortOrder? 1: -1;
      try {
        const results = await api.get(`/document/loaddocument?id=${id}&sort=${sort}`);
        const documents = results.data?.documents;
        if (prevSortOrder.current !== sortOrder) {
          setDocumentList(documents);
          prevSortOrder.current = sortOrder;
        } else {
          setDocumentList((prevList) => [...prevList, ...documents]);
        }
      } catch(err:any) {
        throw err;
      }
    }
    LazyLoadDocuments();
  },[id,sortOrder])

  const props = { showAlert, setShowAlert, showSuccess, setShowSuccess, alertMessage, setAlertMessage, documentList, setDocumentList, setId, setCount, sortOrder, setSortOrder };
  const { showAlert: _, showSuccess: __, alertMessage: ___,setId: ____, setSortOrder: _____, ...restProps  } = props;
  const headerProps = { ...restProps, count };

  return (
    <div className="flex-col flex gap-[16px] px-[24px] pt-[24px] pb-[16px]">
      <DocumentHeader {...headerProps} />
      <DocumentContainer {...props} />
    </div>
  );
}
