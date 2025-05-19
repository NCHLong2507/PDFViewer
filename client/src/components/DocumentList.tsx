import { useEffect, useState } from "react";
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
      try {
        const results = await api.get(`/document/loaddocument?id=${id}`);
        const documents = results.data?.documents;
        setDocumentList((prevList) => [...prevList, ...documents]);
      } catch(err:any) {
        throw err;
      }
    }
    LazyLoadDocuments();
  },[id])

  const props = { showAlert, setShowAlert, showSuccess, setShowSuccess, alertMessage, setAlertMessage, documentList, setDocumentList, setId, setCount };
  const { showAlert: _, showSuccess: __, alertMessage: ___,setId: ____, ...restProps  } = props;
  const headerProps = { ...restProps, count };

  return (
    <div className="flex-col flex gap-[16px] px-[24px] pt-[24px] pb-[16px]">
      <DocumentHeader {...headerProps} />
      <DocumentContainer {...props} />
    </div>
  );
}
