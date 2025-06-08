import type { Document as DocumentDTO } from "../../../interface/document";
import { type QueryObserverResult } from "@tanstack/react-query";
import ShareModalFooter from "./ShareModalFooter";
import ShareModalHeader from "./ShareModalHeader";
import ShareModalBody from "./ShareModalBody";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import {
  setEmailInput,
  setMatchedUser,
  setCollaborator,
  setModified,
  setUserAddedList,
} from "../../../store/documentDetailSlice/shareModalSlice";
interface ShareModalProps {
  document: DocumentDTO;
  action: string[] | undefined;
  refetchDocument: () => Promise<QueryObserverResult<DocumentDTO>>;
  isVisible: boolean;
}
export interface CollaboratorDTO {
  user: {
    _id: string;
    name: string;
    email: string;
    picture: string;
  };
  role: string;
}
export default function ShareModal({
  document,
  action,
  refetchDocument,
  isVisible,
}: ShareModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    return () => {
      dispatch(setEmailInput(""));
      dispatch(setMatchedUser(null));
      dispatch(setUserAddedList([]));
      dispatch(setCollaborator([]));
      dispatch(setModified([]));
    };
  }, []);
  return (
    <div
      className={`
      fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300
      ${
        isVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }
    `}
    >
      <div className="w-[620px] min-h-[398px] rounded-2xl flex justify-between flex-col bg-white shadow-xl p-8 relative">
        <div className="min-h-[155px] flex flex-col justify-start">
          <ShareModalHeader document={document} action={action} />
          <ShareModalBody document={document} action={action} />
        </div>
        <ShareModalFooter
          document={document}
          action={action}
          refetchDocument={refetchDocument}
        />
      </div>
    </div>
  );
}
