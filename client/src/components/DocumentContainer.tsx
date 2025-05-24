import EmptyDocument from "../assets/EmptyDocument.png";
import UploadButton from "./Uploadbutton";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { RiAlertLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { FiCheckCircle } from "react-icons/fi";
import type { Document } from "../interface/document";
import { useRef, useCallback } from "react";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { QueryObserverResult } from "@tanstack/react-query";
import { FaRegCircleUser } from "react-icons/fa6";
interface DocumentContainerProps {
  showAlert: boolean;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  showSuccess: boolean;
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  alertMessage: string;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
  documentList: Document[];
  setDocumentList: React.Dispatch<React.SetStateAction<Document[]>>;
  setId: React.Dispatch<React.SetStateAction<number>>;
  refetchCount: () => Promise<QueryObserverResult<number, unknown>>;
  count: number;
  sortOrder: boolean;
  setSortOrder: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function DocumentContainer({
  showAlert,
  setShowAlert,
  showSuccess,
  setShowSuccess,
  alertMessage,
  setAlertMessage,
  documentList,
  setDocumentList,
  setId,
  refetchCount,
  count,
  sortOrder,
  setSortOrder,
}: DocumentContainerProps) {
  const navigate = useNavigate();
  const documents = documentList.map((doc) => {
    const date = new Date(doc.updatedAt);
    return {
      ...doc,
      lastUpdatedDate: format(date, "MMM dd, yyyy"),
      lastUpdatedTime: format(date, "HH:mm:ss"),
    };
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const prevscrollHeight = useRef<number>(0);
  const onScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight) return;
    if (
      prevscrollHeight.current != scrollHeight &&
      scrollHeight - scrollTop - clientHeight < 100
    ) {
      prevscrollHeight.current = scrollHeight;
      setId((prev) => prev + 1);
    }
  }, [setId]);
  const handleAscSort = () => {
    if (sortOrder === true) return;
    setSortOrder(true);
    setId(0);
  };
  const handleDescSort = () => {
    if (sortOrder === false) return;
    setSortOrder(false);
    setId(0);
  };
  const handleOpenDocument = (doc: Document) => {
    navigate(`/document/documentdetailed?id=${doc._id}`, { state: { doc } });
  };
  const { userInfor } = useAuth();

  return (
    <section className="w-full h-[648px] flex justify-center items-center rounded-[12px] border-[1px] border-[rgba(217,217,217,1)]">
      {count == 0 ? (
        <div className="w-[232px] h-[308px] gap-[24px] flex flex-col items-center justify-center">
          <img
            src={EmptyDocument}
            className="w-[192px] h-[192px]"
            alt="Empty Document"
          />
          <p className="w-full h-[22px] leading-[1.4] text-base text-center text-[rgba(75,85,101,1)]">
            There is no document founded
          </p>
          <UploadButton
            setShowSuccess={setShowSuccess}
            setShowAlert={setShowAlert}
            setAlertMessage={setAlertMessage}
            setDocumentList={setDocumentList}
            refetchCount={refetchCount}
            sortOrder={sortOrder}
            count={count}
          />
        </div>
      ) : (
        <div
          ref={containerRef}
          onScroll={onScroll}
          className="w-full h-full bg-white rounded border border-gray-300 scrollbar-hidden overflow-auto"
        >
          {showAlert && (
            <div
              className="absolute flex top-[670px] left-[1092px] w-[392px] bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-[8px] items-start gap-3"
              role="alert"
            >
              <div className="pt-1">
                <RiAlertLine className="w-5 h-5 text-red-600" />
              </div>

              <div className="flex-1">
                <strong className="font-bold block">
                  Cannot Upload This File
                </strong>
                <span className="block mt-1">{alertMessage}</span>
              </div>

              <button
                onClick={() => setShowAlert(false)}
                className="absolute top-0 right-0 px-4 py-3"
                aria-label="Close alert"
              >
                <IoClose className="h-[24px] w-[24px] text-red-700" />
              </button>
            </div>
          )}
          {showSuccess && (
            <div className="flex absolute top-[695px] left-[1092px] items-center justify-between w-[392px] bg-green-50 border-[1px] border-green-400 text-green-700 px-4 py-3 rounded-[8px] shadow-md">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5" />
                <span className="font-medium">Uploaded successfully</span>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="top-0 right-0"
              >
                <IoClose className="w-4 h-4" />
              </button>
            </div>
          )}

          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-200">
              <tr>
                <th
                  scope="col"
                  className="w-[946px] h-[60px] px-8 py-2 text-left text-base font-normal tracking-wider"
                >
                  File name
                </th>
                <th
                  scope="col"
                  className="w-[460px] h-[48px] px-8 py-2 text-left text-base font-normal tracking-wider"
                >
                  Document owner
                </th>
                <th
                  scope="col"
                  className="px-8 h-[60px] py-2 text-left text-base font-normal relative tracking-wider flex items-center"
                >
                  Last updated
                  <div className="flex flex-col justify-center items-center ml-1">
                    <IoMdArrowDropup
                      onClick={handleAscSort}
                      className="absolute right-[60px] top-[8px] w-[28px] h-[28px] hover:scale-150"
                    />
                    <IoMdArrowDropdown
                      onClick={handleDescSort}
                      className="absolute right-[60px] bottom-[8px] w-[28px] h-[28px] hover:scale-150"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 ">
              {documents.map((doc, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-100"
                  onClick={() => handleOpenDocument(doc)}
                >
                  <td className="px-8 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                    {doc.name.slice(0, doc.name.length - 4)}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap flex h-[77.36px] items-center text-base text-gray-900 gap-4">
                    {doc.owner.picture ? (
                      <img
                        src={doc.owner.picture}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <FaRegCircleUser className="w-10 h-10" />
                    )}
                    <p className="font-medium">
                      {userInfor && userInfor.email === doc.owner.email
                        ? `${doc.owner.name} (You)`
                        : doc.owner.name}
                    </p>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-base  text-left">
                    <div className="font-medium">{doc.lastUpdatedDate}</div>
                    <div className="text-sm text-gray-500">
                      {doc.lastUpdatedTime}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
