import { ImUpload3 } from "react-icons/im";
import { PDFDocument } from "pdf-lib";
import React, { useRef } from "react";
import api from "../../../api/axios";
import type { AxiosProgressEvent } from "axios";
import {
  setAlertMessage,
  setShowAlert,
} from "../../../store/documentListSlice";
import type { AppDispatch } from "../../../store/store";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import type { Document } from "../../../interface/document";
interface LocalUploadProps {
  setCurrentFileName: React.Dispatch<React.SetStateAction<string>>;
  setIsUploadModal: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  UpdateDocumentList: (document: Document) => void;
}
export default function LocalDeviceUpload({
  setCurrentFileName,
  setIsUploadModal,
  setUploadProgress,
  setIsOpen,
  UpdateDocumentList,
}: LocalUploadProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  async function isPdfPasswordProtected(file: File): Promise<boolean> {
    const buffer = await file.arrayBuffer();
    try {
      await PDFDocument.load(buffer);
      return false;
    } catch (err: any) {
      const message = err?.message?.toLowerCase();
      if (
        message.includes("encrypted") ||
        message.includes("password") ||
        message.includes("invalid pdf structure")
      ) {
        return true;
      }
      return false;
    }
  }
  const handleLocalFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsOpen(false);
    const file = e.target.files?.[0];
    if (!file) return;

    setCurrentFileName(file.name);

    try {
      const hasPassword = await isPdfPasswordProtected(file);
      if (hasPassword) {
        dispatch(setAlertMessage(t("errornopass")));
        dispatch(setShowAlert(true));
        e.target.value = "";
        return;
      }
    } catch (err: any) {
      dispatch(setAlertMessage(err.message || t("Invalid file input")));
      dispatch(setShowAlert(true));
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploadModal(true);
    setUploadProgress(0);
    dispatch(setShowAlert(false));

    try {
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
      setUploadProgress(100);
      UpdateDocumentList(result.data.document);
    } catch (err: any) {
      console.error(err);
      setIsUploadModal(false);
      const errorMsg = err.response?.data?.message || t("Upload failed");
      dispatch(setAlertMessage(errorMsg));
      dispatch(setShowAlert(true));
    } 
  };
  const handleLocalButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
      fileInputRef.current.click();
    }
  };
  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleLocalFileUpload}
        accept="application/pdf"
      />
      <button
        onClick={() => {
          handleLocalButtonClick();
        }}
        className="w-full flex justify-start items-center text-left px-4 py-2 rounded-md hover:bg-gray-100"
      >
        <ImUpload3 className="w-4 h-4 mr-2" /> {t("Upload from local device")}
      </button>
    </div>
  );
}
