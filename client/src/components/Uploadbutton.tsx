import { MdOutlineFileUpload } from "react-icons/md";
import { useRef, useState } from "react";
import PDFIcon from '../assets/PDF-icon.png';
import api from '../api/axios';
import type { AxiosProgressEvent } from "axios";
import { PDFDocument } from 'pdf-lib';
import type { Document } from "../interface/document";


interface UploadButtonProps {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
  setDocumentList: React.Dispatch<React.SetStateAction<Document[]>>;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

async function isPdfPasswordProtected(file: File): Promise<boolean> {
  const buffer = await file.arrayBuffer();
  try {
    await PDFDocument.load(buffer);
    return false; 
  } catch (err: any) {
    const message = err?.message?.toLowerCase();
    if (
      message.includes('encrypted') ||
      message.includes('password') ||
      message.includes('invalid pdf structure')
    ) {
      return true;
    }
    throw new Error('File không hợp lệ hoặc bị hỏng.');
  }
}

export default function UploadButton({setShowSuccess, setShowAlert, setAlertMessage,setDocumentList, setCount}: UploadButtonProps) {
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
    if (!file) return;
    try {
      const hasPassword = await isPdfPasswordProtected(file);
      console.log(hasPassword)
      if (hasPassword) {
        setAlertMessage('Please ensure the upload file does not required password');
        setShowAlert(true);
        e.target.value = '';
        return;
      }
    } catch (err: any) {
      setAlertMessage(err.message || 'Invalid file input');
      setShowAlert(true);
      e.target.value = '';
      return;
    }
    const formData = new FormData();
    formData.append('file',file);
    setIsUploadModal(true);
    setUploadProgress(0);
    setShowAlert(false)
    try {
      const result = await api.post('/document/upload', formData, {
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
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploadModal(false); 
        setShowSuccess(true); 
        setDocumentList((prev)=> [result.data.document,...prev]);
        setCount((prev) => prev+1);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }, 1000);
    } catch (err:any) {
      setIsUploadModal(false);
      const errorMsg = err.response?.data?.message || 'Upload failed';
      setAlertMessage(errorMsg);
      setShowAlert(true);

    } finally {
      e.target.value = '';
    }
  }
  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="application/pdf"
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
              <button onClick={() => setIsUploadModal(false)} className="text-gray-400 text-2xl hover:text-black">&times;</button>
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