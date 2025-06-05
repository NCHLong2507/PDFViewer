import { MdOutlineFileUpload } from "react-icons/md";
import { useRef, useState } from "react";
import type { Document } from "../../../interface/document";
import type { QueryObserverResult } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  setShowSuccess,
  addDocumentToFront,
  appendDocumentList,
} from "../../../store/documentListSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import LocalDeviceUpload from "./LocalDeviceUpload";
import GGDriveUpload from "./GGDriveUpload";
import UploadProgressBar from "./UploadProgressBar";

interface UploadButtonProps {
  refetchCount: () => Promise<QueryObserverResult<number, unknown>>;
  count: number;
  refectInitialDocuments: () => Promise<
    QueryObserverResult<Document[], unknown>
  >;
}
export default function UploadButton({
  refetchCount,
  count,
  refectInitialDocuments,
}: UploadButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isUploadModal, setIsUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState("");
  const sortOrder = useSelector((state: RootState) => state.docList.sortOrder);
  const documentList = useSelector(
    (state: RootState) => state.docList.documentList
  );
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  
  const UpdateDocumentList = (document: Document) => {
    setTimeout(() => {
      setIsUploadModal(false);
      dispatch(setShowSuccess(true));
      if (count < 10) {
        if (!sortOrder) {
          dispatch(addDocumentToFront(document));
        } else {
          dispatch(appendDocumentList([document]));
        }
      } else if (!sortOrder) {
        dispatch(addDocumentToFront(document));
      } else if (sortOrder && documentList.length === count) {
        dispatch(appendDocumentList([document]));
      }
      refetchCount();
      refectInitialDocuments();
      setTimeout(() => {
        dispatch(setShowSuccess(false));
      }, 3000);
    }, 1000);
  };
  const uploadProps = {
    setCurrentFileName,
    setIsUploadModal,
    setUploadProgress,
    setIsOpen,
    UpdateDocumentList
  };
  return (
    <div>
      <div className=" inline-block relative">
        <button
          className="inline-block rounded-[8px] p-[10px] hover:bg-[#e6b800] bg-[rgba(245,199,49,1)]"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className="flex justify-center items-center gap-[8px]">
            <MdOutlineFileUpload className="w-[16px] h-[16px]" />
            <span>{t("Upload Document")}</span>
          </div>
        </button>

        {isOpen && (
          <div
            className="absolute top-full mt-[10px]  left-[50%] ml-[-110px] 
               text-sm z-20 bg-white rounded-md shadow-lg border min-w-[200px]"
          >
            <LocalDeviceUpload {...uploadProps} />
            <GGDriveUpload {...uploadProps} />
          </div>
        )}
      </div>

      {isUploadModal && (
        <UploadProgressBar
          setIsUploadModal={setIsUploadModal}
          uploadProgress={uploadProgress}
          currentFileName={currentFileName}
        />
      )}
    </div>
  );
}
