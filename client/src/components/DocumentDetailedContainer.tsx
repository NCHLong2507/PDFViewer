import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { RiRectangleLine } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import { pdfjs, Document, Page } from "react-pdf";
import { useEffect, useRef, useState, type SetStateAction } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import type { Document as DocumentDTO } from "../interface/document";
import type { QueryObserverResult } from "@tanstack/react-query";
import ShareModal from "./ShareModal";
import { FiCheckCircle } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";

interface DocDetailContainerProps {
  document: DocumentDTO;
  showShareModal: boolean;
  setShowShareModal: React.Dispatch<SetStateAction<boolean>>;
  action: string[] | undefined;
  refetchAction: () => Promise<QueryObserverResult<string[], unknown>>;
  refetchDocument: () => Promise<QueryObserverResult<DocumentDTO>>;
}
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
export default function DocumentDetailedContainer({
  document,
  showShareModal,
  setShowShareModal,
  action,
  refetchAction,
  refetchDocument,
}: DocDetailContainerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const pageRefs = useRef<HTMLDivElement[]>([]);
  const [pageInput, setPageInput] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [zoomInput, setZoomInput] = useState("100%");
  const [showDropdown, setShowDropdown] = useState(false);
  const isProgrammaticScroll = useRef(false);
  const wrapperRef = useRef(null);

  const options = ["50%", "75%", "100%", "125%", "150%", "200%"];
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

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
  const handleScroll = () => {
    if (isProgrammaticScroll.current) return;
    if (!containerRef.current) return;

    const containerTop = containerRef.current.getBoundingClientRect().top;

    for (let i = 0; i < pageRefs.current.length; i++) {
      const page = pageRefs.current[i];
      if (!page) continue;

      const { top } = page.getBoundingClientRect();
      const offset = Math.abs(top - containerTop);

      if (offset < 200) {
        setCurrentPage(i + 1);
        break;
      }
    }
  };
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
  useEffect(() => {
    const container = containerRef.current;
    if (container ) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="w-full h-[648px] flex flex-col justify-center items-center rounded-xl bg-gray-100 border-[1px] border-[rgba(217,217,217,1)]">
      <div
        ref={containerRef}
        className="w-full h-full flex flex-col justify-center items-center overflow-auto overflow-x-hidden"
      >
        <div className="mt-8 h-[592px] flex justify-center">
          <Document
            file={document.fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <div
                key={`page_${index + 1}`}
                ref={(el) => {
                  if (el) pageRefs.current[index] = el;
                }}
                style={{
                  marginBottom: index !== numPages - 1 ? 24 : 0,
                  display: "block",
                }}
              >
                <Page pageNumber={index + 1} width={720} scale={zoomLevel} />
              </div>
            ))}
          </Document>
        </div>

        <div className="absolute bottom-[120px] left-[1320px] h-[48px] flex items-center gap-2 px-2 py-2 rounded-lg shadow-md bg-white w-fit">
          <div className="flex items-center h-full gap-1 text-gray-800">
            <RiRectangleLine className="" />
            <span className="text-md font-[400]">Shape</span>
            <IoIosArrowDown />
          </div>

          <div className="w-px h-5 bg-gray-300"></div>

          <div className="flex items-center gap-1 text-gray-800">
            <span className="text-base">
              +<span className="font-serif text-2xl">T</span>
            </span>
            <span className="text-sm font-[400]">Type</span>
          </div>
        </div>
      </div>
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
              onClick={() => currentPage >1 && goToPage("1")}
              className={`w-8 h-8 ${currentPage == 1? `text-gray-300`: `text-black`}`}
            />
          </div>
          <AiOutlineLeft
            onClick={() => currentPage > 1 && goToPage((currentPage - 1).toString())}
            className={`w-6 h-6 ${currentPage == 1? `text-gray-300`: `text-black`}`}
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
            onClick={() => currentPage < numPages && goToPage((currentPage + 1).toString())}
            className={`w-6 h-6 ${currentPage == numPages? `text-gray-300`: `text-black`}`}
          />
          <div className="relative flex w-10 h-10 items-center justify-center text-gray-300">
            <MdKeyboardDoubleArrowRight
              onClick={() => currentPage < numPages && goToPage(numPages.toString())}
              className={`w-8 h-8 ${currentPage == numPages? `text-gray-300`: `text-black`}`}
            />
          </div>
        </div>
      </div>
      {showShareModal && (
        <ShareModal
          document={document}
          setShowShareModal={setShowShareModal}
          action={action}
          setShowSuccessPopup={setShowSuccessPopup}
          refetchDocument={refetchDocument}
        />
      )}
      {showSuccessPopup && (
        <div className=" absolute bottom-15 right-50 flex items-center justify-between w-[392px] px-4 py-3 rounded-md border-[1.5px] border-green-500 bg-green-50 text-green-800 shadow-sm">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5" />
            <span className="text-base font-medium">
              Updated access successfully
            </span>
          </div>
          <button
            onClick={() => setShowSuccessPopup(false)}
            className="ml-4 hover:text-green-900 focus:outline-none"
          >
            <IoClose
              onClick={() => setShowSuccessPopup(false)}
              className="w-4 h-4"
            />
          </button>
        </div>
      )}
    </div>
  );
}
