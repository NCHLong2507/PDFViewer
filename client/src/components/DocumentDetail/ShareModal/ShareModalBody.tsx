import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { useTranslation } from "react-i18next";
import DocumentPermission from "./DocumentPermission";
import type { Document } from "../../../interface/document";
import { setUserAddedList } from "../../../store/documentDetailSlice/shareModalSlice";

import MatchedUser from "./MatchedUser";
interface ShareModalBodyProps {
  document: Document;
  action: string[] | undefined;
}
export default function ShareModalBody({
  document,
  action,
}: ShareModalBodyProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const emailInput = useSelector(
    (state: RootState) => state.shareModal.emailInput
  );
  const userAddedList = useSelector(
    (state: RootState) => state.shareModal.userAddedList
  );
  const matchedUser = useSelector(
    (state: RootState) => state.shareModal.matchedUser
  );
  const handleRemove = (emailtoDelete: string) => {
    const newUserAddedList = userAddedList.filter(
      (email) => email !== emailtoDelete
    );
    dispatch(setUserAddedList(newUserAddedList));
  };
  return (
    <>
      {!emailInput.trim() && userAddedList.length == 0 ? (
        <DocumentPermission document={document} action={action} />
      ) : matchedUser ? (
        <MatchedUser document={document} />
      ) : userAddedList.length == 0 ? (
        <div className="text-sm text-gray-400">
          {t("docDetail.noMatchUser")}
        </div>
      ) : (
        <div>
          {userAddedList.map((email, id) => (
            <div
              key={id}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-full bg-gray-100 text-sm text-gray-800 mr-2 mb-2"
            >
              {email}
              <button
                onClick={() => handleRemove(email)}
                className="ml-2 text-gray-500 hover:text-gray-800 focus:outline-none"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
