
import { MdKeyboardDoubleArrowRight,MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { RiRectangleLine } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import { PiUserCircleThin } from "react-icons/pi";
import { pdfjs, Document, Page } from 'react-pdf';
import { useState } from "react";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
export default function DocumentDetailedContainer() {
  const [numPages, setNumPages] = useState<number>(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="w-full h-[648px] flex flex-col justify-center items-center rounded-xl bg-gray-100 border-[1px] border-[rgba(217,217,217,1)]">
      <div className="w-[616px] mt-8 h-[592px] overflow-auto overflow-x-hidden">
        <Document
          file="https://res.cloudinary.com/duiuvuxeu/image/upload/v1747827193/Document/fec7tmrzqt5k03rlvvhr.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <div
              key={`page_${index + 1}`}
              style={{
                marginBottom: index !== numPages - 1 ? 24 : 0,
                display: "block"
              }}
            >
              <Page pageNumber={index + 1} width={616} />
            </div>
          ))}
        </Document>
      </div>
      <div className="flex justify-center flex-1 items-center bg-white py-3 rounded-b-xl border-[1px] border-[rgba(217,217,217,1)] w-full h-[56px]">
        <div className="h-[32px] flex justify-center items-center gap-5">
          <div className="w-[158px] flex gap-2 justify-center items-center">
            <button className="text-xl  w-8 h-8 text-center justify-center flex border rounded-full hover:bg-gray-100">-</button>
            <div className="flex items-center  gap-1">
              <select className="rounded px-2 py-1 text-md">
                <option>100%</option>
                <option>125%</option>
                <option>150%</option>
              </select>
            </div>
            <button className="text-xl w-8 h-8 text-center justify-center flex border rounded-full hover:bg-gray-100">+</button>
          </div>
          <div className="relative flex w-8 h-8 items-center justify-center text-gray-300">
            <MdKeyboardDoubleArrowLeft className="w-6 h-6"  />
          </div>
          <AiOutlineLeft className="w-4 h-4  text-gray-300"/>
          <div className="w-20 flex items-center gap-1 rounded-md">
            <input
              type="text"
              className="w-12 h-8 border rounded px-2 text-center text-sm flex items-center justify-center"
            />
            <span className="text-sm text-gray-500">/ 17</span>
          </div>
          
          <AiOutlineRight className="w-4 h-4  text-gray-300"/>
          <div className="relative flex w-8 h-8 items-center justify-center text-gray-300">
            <MdKeyboardDoubleArrowRight className="w-6 h-6"  />
          </div>
        </div>
      </div>
      <div className="absolute bottom-[120px] left-[1250px] h-[48px] flex items-center gap-2 px-2 py-2 rounded-lg shadow-md bg-white w-fit">
        <div className="flex items-center h-full gap-1 text-gray-800">
          <RiRectangleLine className=""/>
          <span className="text-md font-[400]">Shape</span>
          <IoIosArrowDown/>
        </div>

        <div className="w-px h-5 bg-gray-300"></div>

        <div className="flex items-center gap-1 text-gray-800">
          <span className="text-base">+<span className="font-serif text-2xl">T</span></span>
          <span className="text-sm font-[400]">Type</span>
        </div>
      </div>

      <div className="hidden absolute top-0 w-[620px] h-[398px] rounded-2xl flex justify-between flex-col bg-white shadow-xl p-8">

        <div className="h-[155px] flex flex-col justify-center gap-4">
          <h2 className="leading-[1.2] font-[600] tracking-tighter text-[rgba(22, 28, 33, 1)] text-[26px]">
            Share “<span className="">Letter of Acceptance of Payment Plan.pdf</span>”
          </h2>

          <input
            type="text"
            placeholder="Add people"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-100"
          />

          <div className="flex items-center gap-3">
            <PiUserCircleThin className="w-10 h-10 rounded-full object-cover"/>
            <div>
              <p className="text-sm text-gray-900 font-medium">Elton Le (You)</p>
              <p className="text-sm text-gray-500">abc123@gmail.com</p>
            </div>
            <span className="ml-auto text-sm text-gray-400">Doc owner</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button className="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
