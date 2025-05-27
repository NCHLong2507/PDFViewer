import { MdOutlineFileUpload } from "react-icons/md";
import { useRef, useState, useCallback, useEffect } from "react";
import PDFIcon from "../assets/PDF-icon.png";
import api from "../api/axios";
import type { AxiosProgressEvent } from "axios";
import { PDFDocument } from "pdf-lib";
import type { Document } from "../interface/document";
import type { QueryObserverResult } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google";
import { IoMdCloudUpload } from "react-icons/io";
import { ImUpload3 } from "react-icons/im";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY as string;

interface UploadButtonProps {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
  setDocumentList: React.Dispatch<React.SetStateAction<Document[]>>;
  sortOrder: boolean;
  refetchCount: () => Promise<QueryObserverResult<number, unknown>>;
  count: number;
  refectInitialDocuments: () => Promise<
    QueryObserverResult<Document[], unknown>
  >;
}

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

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
    throw new Error("File không hợp lệ hoặc bị hỏng.");
  }
}

export default function UploadButton({
  setShowSuccess,
  setShowAlert,
  setAlertMessage,
  setDocumentList,
  refetchCount,
  count,
  sortOrder,
  refectInitialDocuments,
}: UploadButtonProps) {
  const [isUploadModal, setIsUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setGoogleAccessToken(codeResponse.access_token);
      createGoogleDrivePicker(codeResponse.access_token);
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
      setAlertMessage("Failed to connect to Google. Please try again.");
      setShowAlert(true);
    },
    scope: "https://www.googleapis.com/auth/drive.readonly",
  });

  useEffect(() => {
    const loadGoogleApis = () => {
      if (!window.gapi) {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.onload = () => {
          window.gapi.load("client", () => {});
        };
        document.body.appendChild(script);
      }

      if (!window.google) {
        const script = document.createElement("script");
        script.src = "https://www.google.com/jsapi";
        script.onload = () => {
          window.gapi.load("picker", () =>
            console.log("Google Picker API loaded")
          );
        };
        document.body.appendChild(script);
      }
    };
    loadGoogleApis();
  }, []);

  const createGoogleDrivePicker = useCallback(
    (token: string) => {
      if (!window.google) {
        setAlertMessage(
          "Google Picker API not loaded or access token missing. Please try again."
        );
        setShowAlert(true);
        return;
      }

      const pickerBuilder = new window.google.picker.PickerBuilder()
        .addView(
          new window.google.picker.DocsView().setMimeTypes("application/pdf")
        )
        .setOAuthToken(token)
        .setDeveloperKey(GOOGLE_API_KEY)
        .setCallback((data: any) => {
          if (
            data[window.google.picker.Response.ACTION] ===
            window.google.picker.Action.PICKED
          ) {
            const doc = data[window.google.picker.Response.DOCUMENTS][0];
            console.log("TOKEN", token);
            handleDriveFileSelection(doc, token);
          } else if (
            data[window.google.picker.Response.ACTION] ===
            window.google.picker.Action.CANCEL
          ) {
            console.log("Google Drive Picker cancelled.");
          }
        });

      const picker = pickerBuilder.build();
      picker.setVisible(true);
    },
    [setAlertMessage, setShowAlert]
  );

  const handleDriveFileSelection = async (fileData: any, token: string) => {
    console.log("FILE", fileData);
    setCurrentFileName(fileData.name);
    setIsUploadModal(true);
    setUploadProgress(0);
    setShowAlert(false);
    const size = fileData.sizeBytes;
    if (size > 10 * 1024 * 1024) {
      setAlertMessage(
        "Please ensure the file is not more than 20MB and in .pdf format"
      );
    }
    try {
      console.log("ACCESS_TOKEN", googleAccessToken);
      const result = await api.post(
        "/document/uploadfromdrive",
        {
          fileId: fileData.id,
          fileName: fileData.name,
          mimeType: fileData.mimeType,
          webViewLink: fileData.url,
          access_token: token,
        },
        {
          onUploadProgress: (e: AxiosProgressEvent) => {
            if (typeof e.total === "number" && e.total > 0) {
              let percent = Math.round((e.loaded * 100) / e.total);
              if (percent >= 100) percent = 85;
              setUploadProgress(percent);
            }
          },
        }
      );

      setUploadProgress(100);
      setTimeout(() => {
        setIsUploadModal(false);
        setShowSuccess(true);
        if (count < 10 || sortOrder === false) {
          setDocumentList((prev) => [result.data.document, ...prev]);
        }
        refetchCount();
        refectInitialDocuments();
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setIsUploadModal(false);
      const errorMsg =
        err.response?.data?.message || "Upload from Google Drive failed.";
      setAlertMessage(errorMsg);
      setShowAlert(true);
    }
  };

  const handleLocalFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCurrentFileName(file.name);

    try {
      const hasPassword = await isPdfPasswordProtected(file);
      if (hasPassword) {
        setAlertMessage(
          "Please ensure the upload file does not required password"
        );
        setShowAlert(true);
        e.target.value = "";
        return;
      }
    } catch (err: any) {
      setAlertMessage(err.message || "Invalid file input");
      setShowAlert(true);
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploadModal(true);
    setUploadProgress(0);
    setShowAlert(false);

    try {
      const result = await api.post("/document/uploadfromlocal", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e: AxiosProgressEvent) => {
          if (typeof e.total === "number" && e.total > 0) {
            let percent = Math.round((e.loaded * 100) / e.total);
            if (percent >= 100) percent = 85;
            setUploadProgress(percent);
          }
        },
      });
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploadModal(false);
        setShowSuccess(true);
        if (count < 10) {
          if (!sortOrder) {
            setDocumentList((prev) => [result.data.document, ...prev]);
          } else {
            setDocumentList((prev) => [...prev, result.data.document]);
          }
        } else if (!sortOrder) {
          setDocumentList((prev) => [result.data.document, ...prev]);
        }
        refetchCount();
        refectInitialDocuments();
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setIsUploadModal(false);
      const errorMsg = err.response?.data?.message || "Upload failed";
      setAlertMessage(errorMsg);
      setShowAlert(true);
    } finally {
      e.target.value = "";
    }
  };

  const handleLocalButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDriveButtonClick = () => {
    if (googleAccessToken) {
      createGoogleDrivePicker(googleAccessToken);
    } else {
      googleLogin();
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
      <div className=" inline-block" >
        <button
          className="inline-block rounded-[8px] p-[10px] hover:bg-[#e6b800] bg-[rgba(245,199,49,1)]"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className="flex justify-center items-center gap-[8px]">
            <MdOutlineFileUpload className="w-[16px] h-[16px]" />
            <span>Upload Document</span>
          </div>
        </button>

        {isOpen && (
          <div className="absolute text-sm top-[144px] right-[10px] mb-2 z-20 bg-white rounded-md shadow-lg border min-w-[200px]">
            <button
              onClick={() => {
                handleLocalButtonClick();
                setIsOpen(false);
              }}
              className="w-full flex justify-start items-center text-left px-4 py-2 rounded-md hover:bg-gray-100"
            >
              <ImUpload3 className="w-4 h-4 mr-2"/> Upload from local device
            </button>
            <button
              onClick={() => {
                handleDriveButtonClick();
                setIsOpen(false);
              }}
              className="w-full flex justify-start items-center text-left px-4 py-2 rounded-md hover:bg-gray-100"
            >
               <IoMdCloudUpload className="w-4 h-4 mr-2"/> Upload from Drive
            </button>
          </div>
        )}
      </div>

      {isUploadModal && (
        <div className="w-[448px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md border border-gray-300 bg-white z-50">
          <div className="flex h-[54px] p-[16px] justify-between items-center border-b border-gray-300">
            <span className="font-bold">Uploading</span>
            <button
              onClick={() => setIsUploadModal(false)}
              className="text-gray-400 text-2xl hover:text-black"
            >
              &times;
            </button>
          </div>
          <div className="flex h-[108px] items-center justify-center px-4 py-4 gap-4">
            <img src={PDFIcon} className="w-6 h-6" alt="PDF Icon" />
            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-800 truncate">
                {currentFileName}
              </span>
              <div className="w-[372px] h-2 bg-yellow-100 rounded-full overflow-hidden">
                <div
                  className="w-full h-2 bg-yellow-400 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
