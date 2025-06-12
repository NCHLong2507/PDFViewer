import DocumentDetailedHeader from "./DocumentDetailHeader/DocumentDetailHeader";
import DocumentDetailedContainer from "./DocumentDetailContainer/DocumentDetailContainer";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import type { Document as DocumentDTO } from "../../interface/document";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import documentDetailService from "../../services/documentDetailService";

export default function DocumentDetailed() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { doc } = location.state || {};
  const id = searchParams.get("id");

  const fetchDocument = async (): Promise<DocumentDTO> => {
    const res = await documentDetailService.getDocumentInfor(id);
    return res.data.document;
  };

  const fetchActionPermssion = async (): Promise<string[]> => {
    const res = await documentDetailService.getActionPermission(id);
    return res.data.actions;
  };

  const { data: document, refetch: refetchDocument, isLoading: isDocumentLoading } = useQuery<DocumentDTO>({
    queryKey: ["documentInfor", id],
    queryFn: fetchDocument,
    enabled: !!id,
    initialData: doc,
    refetchOnWindowFocus:false,
  });

  const {
    data: action,
    refetch: refetchAction,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery<string[]>({
    queryKey: ["roleInfor", id],
    queryFn: fetchActionPermssion,
    enabled: !!id,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (
      !isLoading &&
      !isFetching &&
      isSuccess &&
      action &&
      action.length === 0
    ) {
      navigate("/document/nopermission");
    }
  }, [action, isSuccess, isLoading, isFetching]);

  if (isLoading || isFetching || !action || isDocumentLoading) {
    return null;
  }
  return (
    <div className="flex-col flex gap-[10px] px-[24px] pt-[24px] pb-[16px]">
      <DocumentDetailedHeader
        document={document as DocumentDTO}
        refetchAction={refetchAction}
      />
      <DocumentDetailedContainer
        document={document as DocumentDTO}
        action={action}
        refetchAction={refetchAction}
        refetchDocument={refetchDocument}
      />
    </div>
  );
}
