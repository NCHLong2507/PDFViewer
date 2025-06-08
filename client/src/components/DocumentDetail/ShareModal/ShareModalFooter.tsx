import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  setIsLoading,
  setShowShareModal,
  setShowSuccessPopup,
} from "../../../store/documentDetailSlice/documentDetailSlice";
import type { Document } from "../../../interface/document";
import {
  setEmailInput,
  setMatchedUser,
  setUserAddedList,
  setModified,
} from "../../../store/documentDetailSlice/shareModalSlice";
import { useTranslation } from "react-i18next";
import type { QueryObserverResult } from "@tanstack/react-query";
import { fetchDocumentPermission } from "../../../store/documentDetailSlice/shareModalSlice";
import documentDetailService from "../../../services/documentDetailService";
interface ShareModalFooterProps {
  document: Document;
  action: string[] | undefined;
  refetchDocument: () => Promise<QueryObserverResult<Document>>;
}

export default function ShareModalFooter({
  document,
  action,
  refetchDocument,
}: ShareModalFooterProps) {
  const [roleAdded, setRoleAdded] = useState("Viewer");
  const userAddedList = useSelector(
    (state: RootState) => state.shareModal.userAddedList
  );
  const modified = useSelector((state: RootState) => state.shareModal.modified);
  const emailInput = useSelector(
    (state: RootState) => state.shareModal.emailInput
  );
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const handleSaveAccess = async () => {
    try {
      let result;
      dispatch(setShowShareModal(false));
      dispatch(setIsLoading(true));
      if (userAddedList.length > 0) {
        result = await documentDetailService.addAccessControl(document._id,userAddedList,roleAdded);
      } else if (modified.length > 0) {
        result = await documentDetailService.updateAccessControl(document._id,modified);
        dispatch(fetchDocumentPermission(document._id));
      }
      if (result && result.data.status === "success") {
        await refetchDocument();
        dispatch(setEmailInput(""));
        dispatch(setMatchedUser(null));
        dispatch(setModified([]));
        dispatch(setUserAddedList([]));
        dispatch(setShowSuccessPopup(true));
        setTimeout(() => {
          dispatch(setShowSuccessPopup(false));
        }, 3000);
      }
    } catch (err) {
      console.error("Error in handleSaveAccess:", err);
    } finally {
      dispatch(setIsLoading(false));
    }
  };
  const handleTurnDownModal = () => {
    dispatch(setEmailInput(""));
    dispatch(setMatchedUser(null));
    dispatch(setUserAddedList([]));
    dispatch(setShowShareModal(false));
  };
  return (
    <div className="flex justify-between">
      <div>
        {userAddedList.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-800">
            <span className="font-medium">{t("People invited")}</span>

            <select
              value={roleAdded}
              onChange={(e) => setRoleAdded(e.target.value)}
              className="ml-auto mr-1 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white shadow-sm"
            >
              <option value="Viewer">{t("docDetail.canView")}</option>
              <option value="Editor">{t("docDetail.canEdit")}</option>
            </select>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={handleTurnDownModal}
          className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
        >
          {t("docDetail.cancel")}
        </button>
        <button
          className="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
          onClick={handleSaveAccess}
          disabled={!action?.includes("ADD")}
        >
          {emailInput.trim().length > 0 || userAddedList.length > 0
            ? t("docDetail.add")
            : t("docDetail.save")}
        </button>
      </div>
    </div>
  );
}
