import PDFIcon from "../../../assets/PDF-icon.png";
import { useTranslation } from "react-i18next";
interface UploadProgressBarProp {
  currentFileName: string;
  uploadProgress: number;
  setIsUploadModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function UploadProgressBar({currentFileName, uploadProgress, setIsUploadModal}: UploadProgressBarProp) {
  
  const { t } = useTranslation();
  
  return (
    <div className="w-[448px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md border border-gray-300 bg-white z-50">
      <div className="flex h-[54px] p-[16px] justify-between items-center border-b border-gray-300">
        <span className="font-bold">{t("docList.uploading")}</span>
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
  );
}
