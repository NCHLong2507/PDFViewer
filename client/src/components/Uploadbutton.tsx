import { MdOutlineFileUpload } from "react-icons/md";
import { useRef } from "react";
import api from '../api/axios';
export default function UploadButton() {
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
      try {
        await api.post('/document/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (err) {
        const error = err as any;
        console.log(error);
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
      className="inline-block  rounded-[8px] p-[10px] bg-[rgba(245,199,49,1)]"
      onClick={handleButtonClick}>
        <div className="flex justify-center items-center gap-[8px]">
          <span className="inline"><MdOutlineFileUpload className="w-[16px] h-[16px]"/></span> 
          Upload Document
        </div>
      </button>
    </div>
    
  )
}