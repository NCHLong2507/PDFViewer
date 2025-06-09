import type { WebViewerInstance } from "@pdftron/webviewer";
import { useEffect, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

interface PageNavigationProps {
  instanceRef: React.RefObject<WebViewerInstance>;
}

export default function PageNavigation({instanceRef}: PageNavigationProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageCount = useSelector((state: RootState) => state.docDetail.editor.pageCount);
  const [inputPage, setInputPage] = useState("1");

  function goNextPage() {
    const instance = instanceRef.current;
    if (!instance) return;

    const docViewer = instance.Core.documentViewer;
    const current = docViewer.getCurrentPage();
    const max = docViewer.getPageCount();
    if (current < max) {
      docViewer.setCurrentPage(current + 1, false);
    }
  }

  function goPrevPage() {
    const instance = instanceRef.current;
    if (!instance) return;

    const docViewer = instance.Core.documentViewer;
    const current = docViewer.getCurrentPage();
    if (current > 1) {
      docViewer.setCurrentPage(current - 1, false);
    }
  }

  function goCustomPage(page: number) {
    const instance = instanceRef.current;
    if (!instance) return;
    const docViewer = instance.Core.documentViewer;
    const current = docViewer.getCurrentPage();
    const max = docViewer.getPageCount();
    if (page <= max && current >= 1) {
      docViewer.setCurrentPage(page, false);
      setCurrentPage(page);
    }
  }
  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);
  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;

    const docViewer = instance.Core.documentViewer;

    const handlePageUpdate = () => {
      const current = docViewer.getCurrentPage();
      console.log("CURRENTPAGE", current);
      setCurrentPage(current);
    };

    docViewer.addEventListener("pageNumberUpdated", handlePageUpdate);

    return () => {
      docViewer.removeEventListener("pageNumberUpdated", handlePageUpdate);
    };
  }, [instanceRef.current]);
  return (
    <>
      <div className="relative flex w-10 h-10 items-center justify-center text-black">
        <MdKeyboardDoubleArrowLeft
          onClick={() => goCustomPage(1)}
          className={`w-8 h-8 ${
            currentPage === 1 ? `text-gray-300` : `text-black`
          }`}
        />
      </div>
      <AiOutlineLeft
        className={`w-6 h-6 ${
          currentPage === 1 ? `text-gray-300` : `text-black`
        }`}
        onClick={goPrevPage}
      />
      <div className="min-w-22 flex items-center gap-2 rounded-md">
        <input
          type="text"
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const pageNumber = parseInt(inputPage, 10);
              if (
                !isNaN(pageNumber) &&
                pageNumber >= 1 &&
                pageNumber <= pageCount
              ) {
                goCustomPage(pageNumber);
              }
            }
          }}
          className="w-12 h-10 border rounded px-2 text-center text-base flex items-center justify-center"
        />
        <p className="text-base text-gray-500">{`/${pageCount}`}</p>
      </div>
      <AiOutlineRight
        className={`w-6 h-6 ${
          currentPage === pageCount ? `text-gray-300` : `text-black`
        }`}
        onClick={goNextPage}
      />
      <div className="relative flex w-10 h-10 items-center justify-center text-gray-300">
        <MdKeyboardDoubleArrowRight
          onClick={() => {
            goCustomPage(pageCount);
          }}
          className={`w-8 h-8 ${
            currentPage === pageCount ? `text-gray-300` : `text-black`
          }`}
        />
      </div>
    </>
  );
}
