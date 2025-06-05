import { PiUserCircleThin } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import type { Document } from "../../../interface/document";
import { setCollaborator, setModified } from "../../../store/shareModalSlice";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import api from "../../../api/axios";

interface DocumentPermissionProps {
  document: Document;
  action: string[] | undefined;
}

export default function DocumentPermission({
  document,
  action,
}: DocumentPermissionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const collaborator = useSelector(
    (state: RootState) => state.shareModal.collaborator
  );
  const modified = useSelector((state: RootState) => state.shareModal.modified);
  useEffect(() => {
    const fetchDocumentPermission = async () => {
      try {
        const result = await api.get(
          `/document/documentpermission?id=${document._id}`
        );
        if (result && result.data.status === "success") {
          console.log(result.data.permission);
          dispatch(setCollaborator(result.data.permission));
        }
      } catch (err: any) {
        console.log(err.config);
      }
    };
    fetchDocumentPermission();
  }, []);
  const handleAccessChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    email: string
  ) => {
    const newRole = e.target.value;
    const updated = collaborator.map((c) =>
      c.user.email === email ? { ...c, role: newRole } : c
    );
    dispatch(setCollaborator(updated));
    const changedUser = updated.find((c) => c.user.email === email);
    if (changedUser) {
      const withoutOld = modified.filter((c) => c.user.email !== email);
      const newModified = [...withoutOld, changedUser];
      dispatch(setModified(newModified));
    }
  };
  return (
    <div className="w-full h-[180px] flex flex-col items-center gap-3 overflow-y-auto">
      <div className="w-full flex items-center gap-3">
        {document.owner.picture ? (
          <img
            src={document.owner.picture}
            className="w-10 h-10 rounded-full"
            alt="avatar"
          />
        ) : (
          <PiUserCircleThin className="w-10 h-10" />
        )}
        <div>
          <p className="text-sm text-gray-900 font-medium">
            {document.owner.name}
          </p>
          <p className="text-sm text-gray-500">{document.owner.email}</p>
        </div>
        <span className="ml-auto text-sm text-gray-400 mr-1">
          {t("Doc owner")}
        </span>
      </div>
      {collaborator.map((user, id) => (
        <div key={id} className="w-full flex items-center gap-3">
          {user.user.picture ? (
            <img
              src={user.user.picture}
              className="w-10 h-10 rounded-full"
              alt="avatar"
            />
          ) : (
            <PiUserCircleThin className="w-10 h-10" />
          )}
          <div>
            <p className="text-sm text-gray-900 font-medium">
              {user.user.name}
            </p>
            <p className="text-sm text-gray-500">{user.user.email}</p>
          </div>
          <select
            value={user.role}
            onChange={(e) => handleAccessChange(e, user.user.email)}
            disabled={!action?.includes("ADD")}
            className="ml-auto border border-gray-300 mr-1 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white shadow-sm"
          >
            <option value="Viewer">{t("Can view")}</option>
            <option value="Editor">{t("Can edit")}</option>
            <option value="Remove">{t("Remove")}</option>
          </select>
        </div>
      ))}
    </div>
  );
}
