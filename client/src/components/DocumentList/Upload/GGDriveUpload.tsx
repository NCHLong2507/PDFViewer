import { useGoogleLogin } from "@react-oauth/google";
import { useCallback, useEffect } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import {
  setAlertMessage,
  setShowAlert,
} from "../../../store/documentListSlice/documentListSlice";
import type { AppDispatch, RootState } from "../../../store/store";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { Document } from "../../../interface/document";
import { setGoogleAccessToken } from "../../../store/documentListSlice/documentListSlice";
import documentListService from "../../../services/documentListService";
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY as string;
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}
interface GGDriveUploadProps {
  setCurrentFileName: React.Dispatch<React.SetStateAction<string>>;
  setIsUploadModal: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  UpdateDocumentList: (document: Document) => void;
}
export default function GGDriveUpload({
  setCurrentFileName,
  setIsUploadModal,
  setUploadProgress,
  setIsOpen,
  UpdateDocumentList,
}: GGDriveUploadProps) {
  const dispatch = useDispatch<AppDispatch>();
  const googleAccessToken = useSelector(
    (state: RootState) => state.docList.googleAccessToken
  );
  const { t } = useTranslation();
  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      dispatch(setGoogleAccessToken(codeResponse.access_token));
      createGoogleDrivePicker(codeResponse.access_token);
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
      dispatch(setAlertMessage(t("auth.googleLoginFailed")));
      dispatch(setShowAlert(true));
    },
    scope: "https://www.googleapis.com/auth/drive.readonly",
  });
  useEffect(() => {
    const loadGoogleApis = () => {
      if (!window.gapi) {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.onload = () => {
          window.gapi.load("client:picker", () =>
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
        dispatch(setAlertMessage(t("docList.pickererror")));
        dispatch(setShowAlert(true));
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
    [dispatch, t]
  );

  const handleDriveFileSelection = async (fileData: any, token: string) => {
    setIsOpen(false);
    setCurrentFileName(fileData.name);
    setIsUploadModal(true);
    setUploadProgress(0);
    dispatch(setShowAlert(false));
    const size = fileData.sizeBytes;
    if (size > 10 * 1024 * 1024) {
      dispatch(setAlertMessage(t("docList.filesizerror")));
    }
    try {
      const data = await documentListService.handleDriveUpload(fileData,token,setUploadProgress);
      setUploadProgress(100);
      UpdateDocumentList(data.document);
    } catch (err: any) {
      console.error(err);
      setIsUploadModal(false);
      const errorMsg =
        err.response?.data?.message || t("docList.uploaddrivefailed");
      dispatch(setAlertMessage(errorMsg));
      dispatch(setShowAlert(true));
    }
  };
  const verifyAccessToken = async (token: string): Promise<boolean> => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
      );
      if (!res.ok) throw new Error("Invalid token");
      const data = await res.json();
      return !!data && !data.error;
    } catch (err) {
      return false;
    }
  };
  const handleDriveButtonClick = async () => {
    if (googleAccessToken) {
      const isValid = await verifyAccessToken(googleAccessToken);
      if (isValid) {
        createGoogleDrivePicker(googleAccessToken);
      } else {
        googleLogin();
      }
    } else {
      googleLogin();
    }
  };
  return (
    <button
      onClick={() => {
        handleDriveButtonClick();
      }}
      className="w-full flex justify-start items-center text-left px-4 py-2 rounded-md hover:bg-gray-100"
    >
      <IoMdCloudUpload className="w-4 h-4 mr-2" />{" "}
      {t("docList.uploadFromDrive")}
    </button>
  );
}
