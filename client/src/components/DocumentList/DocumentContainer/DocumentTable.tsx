import { FaRegCircleUser } from "react-icons/fa6";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  setId,
  setSortOrder,
} from "../../../store/documentListSlice/documentListSlice";
import type { Document } from "../../../interface/document";
import type { QueryObserverResult } from "@tanstack/react-query";
import { useEffect } from "react";
export default function DocumentTalbe({
  refectInitialDocuments,
}: {
  refectInitialDocuments: () => Promise<
    QueryObserverResult<Document[], unknown>
  >;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { userInfor } = useAuth();
  const sortOrder = useSelector((state: RootState) => state.docList.sortOrder);
  const documentList = useSelector(
    (state: RootState) => state.docList.documentList
  );

  const navigate = useNavigate();
  const location = useLocation();

  const documents = documentList.map((doc) => {
    const date = new Date(doc.updatedAt);
    return {
      ...doc,
      lastUpdatedDate: format(date, "MMM dd, yyyy"),
      lastUpdatedTime: format(date, "HH:mm:ss"),
    };
  });
  const handleAscSort = () => {
    if (sortOrder === true) return;
    dispatch(setSortOrder(true));
    dispatch(setId(0));
  };
  const handleDescSort = () => {
    if (sortOrder === false) return;
    dispatch(setSortOrder(false));
    dispatch(setId(0));
  };
  const handleOpenDocument = (doc: Document) => {
    if (doc.isLoadingFirst) {
      sessionStorage.removeItem("IsLoading");
    } else {
      sessionStorage.setItem("IsLoading", "false");
    }
    navigate(`/document/documentdetailed?id=${doc._id}`, { state: { doc } });
  };

  useEffect(() => {
    if (location.state?.refetch) {
      refectInitialDocuments();
    }
  }, [location.state]);
  return (
    <table className="min-w-full divide-y divide-gray-200 ">
      <thead className="bg-gray-200">
        <tr>
          <th
            scope="col"
            className="w-[55%] h-[60px] px-8 py-2 text-left text-base font-normal tracking-wider"
          >
            {t("docList.fileName")}
          </th>
          <th
            scope="col"
            className="w-[30%px] h-[48px] px-8 py-2 text-left text-base font-normal tracking-wider"
          >
            {t("docList.owner")}
          </th>
          <th
            scope="col"
            className="px-8 h-[60px] py-2 text-left text-base font-normal relative tracking-wider flex items-center"
          >
            {t("docList.lastUpdated")}
            <div className="flex flex-col justify-center items-center ml-1 relative">
              <IoMdArrowDropup
                onClick={handleAscSort}
                className="absolute right-[-25px] bottom-[2px] w-[28px] h-[28px] hover:scale-150"
              />
              <IoMdArrowDropdown
                onClick={handleDescSort}
                className="absolute right-[-25px] top-[2px] w-[28px] h-[28px] hover:scale-150"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {documents.map((doc, idx) => (
          <tr
            key={idx}
            className="hover:bg-gray-100 border-b-2 border-gray-200"
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
                  ? `${doc.owner.name} (${t("docList.you")})`
                  : doc.owner.name}
              </p>
            </td>
            <td className="px-8 py-4 whitespace-nowrap text-base  text-left">
              <div className="font-medium">{doc.lastUpdatedDate}</div>
              <div className="text-sm text-gray-500">{doc.lastUpdatedTime}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
