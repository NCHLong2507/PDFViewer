import { FiCheckCircle } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { setShowSuccessPopup } from "../../../store/documentViewerSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";

export default function SuccessMessag() {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className=" absolute bottom-15 right-50 flex items-center justify-between w-[392px] px-4 py-3 rounded-md border-[1.5px] border-green-500 bg-green-50 text-green-800 shadow-sm">
      <div className="flex items-center gap-2">
        <FiCheckCircle className="w-5 h-5" />
        <span className="text-base font-medium">
          Updated access successfully
        </span>
      </div>
      <button
        onClick={() => dispatch(setShowSuccessPopup(false))}
        className="ml-4 hover:text-green-900 focus:outline-none"
      >
        <IoClose
          onClick={() => dispatch(setShowSuccessPopup(false))}
          className="w-4 h-4"
        />
      </button>
    </div>
  );
}
