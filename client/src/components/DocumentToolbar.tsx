import { useRef, useState, type SetStateAction } from "react";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { FaAngleDown } from "react-icons/fa6";

interface DocumentToolbarProps {
  isProgrammaticScroll: React.RefObject<boolean>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  pageRefs: React.RefObject<HTMLDivElement[]>;
  setCurrentPage: React.Dispatch<SetStateAction<number>>;
  currentPage: number,
  numPages: number,
  zoomLevel: number,
  setZoomLevel: React.Dispatch<SetStateAction<number>>;
}

export default function DocumentToolbar({pageRefs, isProgrammaticScroll,setCurrentPage, wrapperRef, currentPage,numPages,zoomLevel,setZoomLevel}:DocumentToolbarProps) {
  const [zoomInput, setZoomInput] = useState("100%");
  const [showDropdown, setShowDropdown] = useState(false);
  const [pageInput, setPageInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const options = ["50%", "75%", "100%", "125%", "150%", "200%"];

  function goToPage(pageStr: string) {
    const page = parseInt(pageStr);
    if (!isNaN(page) && page >= 1 && page <= numPages) {
      const target = pageRefs.current[page - 1];
      if (target) {
        isProgrammaticScroll.current = true;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setCurrentPage(page);
        setPageInput(pageStr);
        setIsTyping(false);
        setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 500);
      }
    }
  }
  const handleZoomChange = (newZoom: number) => {
    if (newZoom >= 0.1 && newZoom <= 5) {
      setZoomLevel(newZoom);
      setZoomInput(`${Math.round(newZoom * 100)}%`);
    }
  };
  const handleZoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoomInput(e.target.value);
    const val = parseFloat(e.target.value.replace("%", ""));
    if (!isNaN(val)) handleZoomChange(val / 100);
  };
  const handleOptionClick = (value: string) => {
    setZoomInput(value);
    const val = parseFloat(value.replace("%", ""));
    if (!isNaN(val)) handleZoomChange(val / 100);
    setShowDropdown(false);
  };
  return (
    <div className="flex justify-center flex-1 items-center bg-white py-4 rounded-b-xl border-[1px] border-[rgba(217,217,217,1)] w-full h-[64px]">
      <div className="h-[40px] flex justify-center items-center gap-6">
        <div className="w-[180px] flex gap-3 justify-center items-center">
          <button
            onClick={() => handleZoomChange(zoomLevel - 0.01)}
            className="text-xl w-8 h-8 text-center justify-center flex border rounded-full hover:bg-gray-100"
          >
            -
          </button>
          <div className="relative flex items-center gap-2" ref={wrapperRef}>
            <input
              type="text"
              className="rounded px-2 py-1 text-base w-20 border border-gray-300 focus:border-amber-300"
              value={zoomInput}
              onChange={handleZoomInputChange}
            />

            <FaAngleDown
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              onClick={() => setShowDropdown((prev) => !prev)}
              onBlur={() => setShowDropdown(false)}
            />

            {showDropdown && (
              <div className="absolute top-[-200px] mt-1 w-24 border border-gray-300 bg-white rounded shadow z-10">
                {options.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => handleOptionClick(opt)}
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => handleZoomChange(zoomLevel + 0.01)}
            className="text-xl w-8 h-8 text-center justify-center flex border rounded-full hover:bg-gray-100"
          >
            +
          </button>
        </div>
        <div className="relative flex w-10 h-10 items-center justify-center text-black">
          <MdKeyboardDoubleArrowLeft
            onClick={() => currentPage > 1 && goToPage("1")}
            className={`w-8 h-8 ${
              currentPage == 1 ? `text-gray-300` : `text-black`
            }`}
          />
        </div>
        <AiOutlineLeft
          onClick={() =>
            currentPage > 1 && goToPage((currentPage - 1).toString())
          }
          className={`w-6 h-6 ${
            currentPage == 1 ? `text-gray-300` : `text-black`
          }`}
        />
        <div className="min-w-22 flex items-center gap-2 rounded-md">
          <input
            type="text"
            value={isTyping ? pageInput : String(currentPage)}
            onChange={(e) => {
              setPageInput(e.target.value);
              setIsTyping(true);
            }}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
            className="w-12 h-10 border rounded px-2 text-center text-base flex items-center justify-center"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                goToPage(pageInput);
              }
            }}
          />
          <p className="text-base text-gray-500">{`/ ${numPages}`}</p>
        </div>
        <AiOutlineRight
          onClick={() =>
            currentPage < numPages && goToPage((currentPage + 1).toString())
          }
          className={`w-6 h-6 ${
            currentPage == numPages ? `text-gray-300` : `text-black`
          }`}
        />
        <div className="relative flex w-10 h-10 items-center justify-center text-gray-300">
          <MdKeyboardDoubleArrowRight
            onClick={() =>
              currentPage < numPages && goToPage(numPages.toString())
            }
            className={`w-8 h-8 ${
              currentPage == numPages ? `text-gray-300` : `text-black`
            }`}
          />
        </div>
      </div>
    </div>
  );
}
