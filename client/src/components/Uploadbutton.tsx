import { MdOutlineFileUpload } from "react-icons/md";

export default function UploadButton() {
  return (
    <button className="inline-block  rounded-[8px] p-[10px] bg-[rgba(245,199,49,1)]">
      <div className="flex justify-center items-center gap-[8px]">
        <span className="inline"><MdOutlineFileUpload className="w-[16px] h-[16px]"/></span> 
        Upload Document
      </div>
    </button>
  )
}