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
import DocumentToolbar from "./DocumentToolbar";
import { RiTriangleLine } from "react-icons/ri";
import { FaRegCircle } from "react-icons/fa";
import DiagonalLine from "../assets/DiagonalLine.png";
import { PiArrowUpRightFill } from "react-icons/pi";
import StrokeIcon from "../assets/md_stroke.png";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const isProgrammaticScroll = useRef(false);
  const wrapperRef = useRef(null);
  const [style, setStyle] = useState("fill");
  const [opacity, setOpacity] = useState(50);
  const [stroke, setStroke] = useState(10);
  const shapes = ["square", "ellipse", "triangle", "line", "arrow"];
  const colors = [
    "transparent",
    "black",
    "red",
    "blue",
    "teal",
    "yellow",
    "light-blue",
    "white",
  ];
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
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
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
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
        <div className="absolute right-20 p-4 bg-gray-[150] border-1 border-gray-300 rounded-lg shadow-2xl w-[340px] h-[295px]">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Shape</h3>
            <div className="flex gap-2">
              {shapes.map((shape, index) => (
                <button
                  key={index}
                  className="p-1 h-8 w-8 flex justify-center items-center rounded-lg hover:bg-pink-100 focus:outline-none"
                >
                  {shape === "square" && (
                    <RiRectangleLine className=" w-6 h-6" />
                  )}
                  {shape === "ellipse" && <FaRegCircle className="w-5 h-5  " />}
                  {shape === "triangle" && (
                    <RiTriangleLine className="w-5 h-5" />
                  )}
                  {shape === "line" && (
                    <img src={DiagonalLine} className=" w-10 h-10"></img>
                  )}
                  {shape === "arrow" && (
                    <PiArrowUpRightFill className="w-6 h-6" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Style Section */}
          <div className="w-full mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Style</h3>
            <div className="w-full flex bg-white rounded-full ">
              <button
                className={`w-[50%] px-4 py-2 rounded-full text-sm font-medium ${
                  style === "fill" ? "bg-gray-300" : "bg-white"
                } hover:bg-gray-200 focus:outline-none`}
                onClick={() => setStyle("fill")}
              >
                Fill
              </button>
              <button
                className={`w-[50%] px-4 py-2 rounded-full text-sm font-medium ${
                  style === "stroke" ? "bg-gray-300" : "bg-white"
                } hover:bg-gray-200 focus:outline-none`}
                onClick={() => setStyle("stroke")}
              >
                Stroke
              </button>
            </div>
          </div>

          {/* Color Section */}
          <div className="mb-4">
            {/* <div className="flex gap-2">
              {colors.map((color, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 flex items-center justify-center rounded-full focus:outline-none hover:ring-1 hover:ring-black `}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-[1.5px] border-gray-200  ${
                      color === "transparent"
                        ? "bg-transparent"
                        : color === "black"
                        ? "bg-black"
                        : color === "red"
                        ? "bg-red-500"
                        : color === "blue"
                        ? "bg-blue-500"
                        : color === "teal"
                        ? "bg-teal-500"
                        : color === "yellow"
                        ? "bg-yellow-200"
                        : color === "light-blue"
                        ? "bg-blue-100"
                        : "bg-white"
                    }`}
                  ></div>
                </button>
              ))}
            </div> */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <img src={StrokeIcon} className="w-8"></img>
                <div className="relative w-[57%] h-2 flex items-center rounded-lg gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stroke}
                    onChange={(e) => setStroke(Number(e.target.value))}
                    className=" w-[100%] h-2 bg-transparent appearance-none cursor-pointer"
                  />
                  <div
                    className="w-[10px] absolute top-0 left-0 h-2 rounded-lg pointer-events-none"
                    style={{
                      width: `${stroke}%`,
                      background: "rgba(43, 49, 55, 1)",
                      transition: "width 0.3s",
                    }}
                  />
                </div>
                <div className="flex-1 items-center justify-end flex">
                  <p className="w-[90%] p-[1px] rounded-md text-sm text-center border-2 border-blue-100 ">
                    {stroke}
                    <span className="ml-1">%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Opacity Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Opacity
            </h3>
            <div className="flex items-center justify-between gap-2 mb-2">
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setOpacity(value);
                }}
                className="w-[70%] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #fff 5%, #000 90%)",
                }}
              />
              <div className="flex-1 items-center justify-end flex">
                <p className="w-[90%] p-[1px] rounded-md text-sm text-center border-2 border-blue-100 ">
                  {opacity}
                  <span className="ml-1">%</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DocumentToolbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        numPages={numPages}
        pageRefs={pageRefs}
        isProgrammaticScroll={isProgrammaticScroll}
        wrapperRef={wrapperRef}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
      />
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
