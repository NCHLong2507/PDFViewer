import DocumentDetailedHeader from './DocumentDetailedHeader';
import DocumentDetailedContainer from './DocumentDetailedContainer';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import type { Document as DocumentDTO } from "../interface/document";
import api from "../api/axios";
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function DocumentDetailed() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { doc } = location.state || {};
  const id = searchParams.get('id');
  const [showShareModal, setShowShareModal] = useState(false);

  const fetchDocument = async (): Promise<DocumentDTO> => {
    if (!id) throw new Error('Missing id');
    const res = await api.get(`/document/documentInfor?id=${id}`);
    return res.data.document;
  };

  const fetchActionPermssion = async(): Promise<string[]> => {
    const res = await api.get(`/auth/permission?id=${id}`);
    return res.data.actions;
  }

  const { data: document, refetch: refetchDocument } = useQuery<DocumentDTO>({
    queryKey: ['documentInfor', id],
    queryFn: fetchDocument,
    enabled: !!id,
    initialData: doc,
  });

  const {
    data: action,
    refetch: refetchAction,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery<string[]>({
    queryKey: ['roleInfor', id],
    queryFn: fetchActionPermssion,
    enabled: !!id,
  });

  useEffect(() => {
    if (!isLoading && !isFetching && isSuccess && action && action.length === 0) {
      navigate('/document/nopermission');
    }
  }, [action, isSuccess, isLoading, isFetching]);

  if (isLoading || isFetching || !action) {
    return null;
  }

  return (
    <div className='flex-col flex gap-[16px] px-[24px] pt-[24px] pb-[16px]'>
      <DocumentDetailedHeader
        document={document}
        setShowShareModal={setShowShareModal}
        action={action}
        refetchAction={refetchAction}
      />
      <DocumentDetailedContainer
        document={document}
        setShowShareModal={setShowShareModal}
        showShareModal={showShareModal}
        action={action}
        refetchAction={refetchAction}
        refetchDocument= {refetchDocument}
      />
    </div>
  );
}
