import { MdOutlineFileUpload } from "react-icons/md";
import { useRef, useState } from "react";
import PDFIcon from '../assets/PDF-icon.png';
import api from '../api/axios';
import type { AxiosProgressEvent } from "axios";

interface UploadButtonProps {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
}
export default function UploadButton({setShowSuccess, setShowAlert, setAlertMessage}: UploadButtonProps) {
  const [isUploadModal, setIsUploadModal] = useState(false);
  const [uploadProgress,setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file',file);
      setIsUploadModal(true)
      setUploadProgress(0);
      try {
        await api.post('/document/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (e: AxiosProgressEvent) => {
            if (typeof e.total === 'number' && e.total > 0) {
              let percent = Math.round((e.loaded * 100) / e.total);
              if (percent >=100) percent = 85;
              setUploadProgress(percent);
            }
          },
        });
      } catch (err:any) {
        console.error('Upload failed:', err);
        const errorMsg = err.response?.data?.message || 'Upload failed';
        setAlertMessage(errorMsg);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);

      } finally {
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploadModal(false); 
          setShowSuccess(true); 
          setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
        }, 1000);
      }
    }
  }
  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="application/pdf" 
        onChange={handleFileChange}
      />
      <button 
      className="inline-block  rounded-[8px] p-[10px] hover:bg-[#e6b800] bg-[rgba(245,199,49,1)] "
      onClick={handleButtonClick}>
        <div className="flex justify-center items-center gap-[8px]">
          <span className="inline"><MdOutlineFileUpload className="w-[16px] h-[16px]"/></span> 
          Upload Document
        </div>
      </button>
      {
        isUploadModal && (
          <div className="w-[448px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md border border-gray-300 bg-white">
            <div className="flex h-[54px] p-[16px] justify-between items-center border-b border-gray-300">
              <span className="font-bold">Uploading</span>
              <button className="text-gray-400 text-2xl hover:text-black">&times;</button>
            </div>
            <div className="flex h-[108px] items-center justify-center px-4 py-4 gap-4">
              <img src={PDFIcon} className="w-6 h-6" />
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-800 truncate">FileSomething.pdf</span>
                <div className="w-[372px] h-2 bg-yellow-100 rounded-full overflow-hidden">
                  <div
                    className="w-full h-2 bg-yellow-400 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
    
  )
}