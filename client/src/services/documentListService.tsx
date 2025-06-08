import type { AxiosProgressEvent } from "axios";
import api from "../api/axios";
import type React from "react";
import type { SetStateAction } from "react";
import type { Document as DocumentDTO } from "../interface/document";

const documentListService = {
  getDocumentCount: () => {
    return api.get("/document/documentcount");
  },
  getDocumentList: (id: number, sort: number) => {
    return api.get(`/document/loaddocument?id=${id}&sort=${sort}`);
  },
  getLazyLoadingDocument: (id: number, sort: number) => {
    return api.get(`/document/loaddocument?id=${id}&sort=${sort}`);
  },
  handleDriveUpload: async (
    fileData: any,
    access_token: string,
    setUploadProgress: React.Dispatch<SetStateAction<number>>
  ): Promise<{ status: string; document: DocumentDTO }> => {
    const result = await api.post(
      "/document/uploadfromdrive",
      {
        fileId: fileData.id,
        fileName: fileData.name,
        mimeType: fileData.mimeType,
        webViewLink: fileData.url,
        access_token,
      },
      {
        onUploadProgress: (e: AxiosProgressEvent) => {
          if (typeof e.total === "number" && e.total > 0) {
            let percent = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(percent);
          }
        },
      }
    );
    return result.data;
  },
  handleLocalDeviceUpload: async (formData:any,setUploadProgress: React.Dispatch<SetStateAction<number>>):Promise<{ status: string; document: DocumentDTO }>  => {
    const result = await api.post("/document/uploadfromlocal", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (e: AxiosProgressEvent) => {
        if (typeof e.total === "number" && e.total > 0) {
          let percent = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(percent);
        }
      },
    });
    return result.data;
  },
};

export default documentListService;
