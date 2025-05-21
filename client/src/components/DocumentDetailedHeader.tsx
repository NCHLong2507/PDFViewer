import { FaArrowLeft } from "react-icons/fa6";
import { LuDownload } from "react-icons/lu";
import { FiShare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function DocumentDetailedHeader () {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between w-full h-[52px] pt-2 pb-2">
      <div className="w-[524px] flex items-center justify-start h-full gap-3">
        <FaArrowLeft onClick={() => navigate('/document/documentlist')} className="w-6 h-6 pr-2"/>
        <strong className="text-center justify-center text-2xl">Letter of Acceptance of Payment Plan</strong>
      </div>
      <div className="flex gap-3">
      <button className="flex items-center gap-3 px-4 py-2 border border-[rgba(118, 118, 118, 1)] rounded-md bg-gray-200 hover:bg-gray-300">
        <LuDownload className="w-4 h-4"/>
        <span>Download</span>
      </button>

      <button className="flex items-center gap-3 px-4 py-2 border border-[rgba(118, 118, 118, 1)] rounded-md bg-gray-200 hover:bg-gray-300">
        <FiShare className="w-4 h-4"/>
        <span>Share</span>
      </button>
    </div>
    </div>
  )
}