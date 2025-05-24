import { PiUserCircleThin } from "react-icons/pi";
import type { Document as DocumentDTO } from "../interface/document";
import { useState, useEffect, type SetStateAction } from "react";
import api from "../api/axios";
import { type QueryObserverResult } from "@tanstack/react-query";

interface ShareModalProps {
  document: DocumentDTO;
  setShowShareModal: React.Dispatch<SetStateAction<boolean>>;
  action: string[] | undefined;
  setShowSuccessPopup: React.Dispatch<SetStateAction<boolean>>;
  refetchDocument: () => Promise<QueryObserverResult<DocumentDTO>>;
}
interface CollaboratorDTO {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  role: string;
}

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
export default function ShareModal({
  document,
  setShowShareModal,
  action,
  setShowSuccessPopup,
  refetchDocument,
}: ShareModalProps) {
  const [emailInput, setEmailInput] = useState<string>("");
  const [matchedUser, setMatchedUser] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [userAddedList, setUserAddedList] = useState<string[]>([]);
  const [roleAdded, setRoleAdded] = useState("Viewer");
  const [collaborator, setCollaborator] = useState<CollaboratorDTO[]>([]);

  useEffect(() => {
    const fetchDocumentPermission = async () => {
      try{
        const result = await api.get(`/document/documentpermission?id=${document._id}`);
        if (result && result.data.status==="success") {
          console.log(result.data.permission)
          setCollaborator(result.data.permission);
        }
      } catch (err:any) {
        console.log(err.config);
      }
    };
    fetchDocumentPermission();
  },[]);
  const [modified, setModified] = useState<CollaboratorDTO[]>([]);

  useEffect(() => {
    const findUserbyEmail = async () => {
      const input = emailInput.trim().toLowerCase();
      if (input === "") {
        setMatchedUser(null);
      } else {
        if (isValidEmail(input)) {
          try {
            const result = await api.post("/user/find-by-email", {
              email: input,
            });
            setMatchedUser(result.data.user || null);
          } catch (err: any) {
            console.log(err);
          }
        } else {
          setMatchedUser(null);
        }
      }
    };
    findUserbyEmail();
  }, [emailInput]);

  const AddtoUserList = () => {
    if (matchedUser && !userAddedList.includes(matchedUser.email)) {
      const alreadyExists = collaborator.some(
        (c) => c.user.email === matchedUser.email
      );
      if (!alreadyExists)
        setUserAddedList((prev) => [...prev, matchedUser.email]);
    }
    setMatchedUser(null);
    setEmailInput("");
    return;
  };
  const handleRemove = (emailtoDelete: string) => {
    setUserAddedList((prev) => prev.filter((email) => email !== emailtoDelete));
  };
  const handleTurnDownModal = () => {
    setEmailInput("");
    setMatchedUser(null);
    setUserAddedList([]);
    setShowShareModal(false);
  };

  const handleAccessChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    email: string
  ) => {
    const newRole = e.target.value;
    const updated = collaborator.map((c) =>
      c.user.email === email ? { ...c, role: newRole } : c
    );
    setCollaborator(updated);
    const changedUser = updated.find((c) => c.user.email === email);
    if (changedUser) {
      setModified((prev) => {
        const withoutOld = prev.filter((c) => c.user.email !== email);
        return [...withoutOld, changedUser];
      });
    }
    
  };

  const handleSaveAccess = async () => {
    try {
      let result;

      if (userAddedList.length > 0) {
        result = await api.post(
          `/document/addaccesscontrol?id=${document._id}`,
          {
            emailList: userAddedList,
            role: roleAdded,
          }
        );
      } else if (modified.length > 0) {
        result = await api.put(
          `/document/updateaccesscontrol?id=${document._id}`,
          modified
        );
      }

      if (result && result.data.status === "success") {
        await refetchDocument();

        setShowShareModal(false);
        setEmailInput("");
        setMatchedUser(null);
        setModified([]);
        setUserAddedList([]);
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Error in handleSaveAccess:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-[620px] min-h-[398px] rounded-2xl flex justify-between flex-col bg-white shadow-xl p-8 relative">
        <div className="min-h-[155px] flex flex-col justify-start ">
          <h2 className="leading-[1.2] font-[600] tracking-tighter text-[rgba(22, 28, 33, 1)] text-[26px] mb-4">
            Share “<span className="">{document.name}</span>”
          </h2>

          <input
            type="text"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Add people"
            disabled={!action?.includes("ADD")}
            className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 text-sm focus:outline-none focus:ring focus:ring-blue-100"
          />

          {!emailInput.trim() && userAddedList.length == 0 ? (
            <div className="w-full h-[180px] flex flex-col items-center gap-3 overflow-y-auto">
              <div className="w-full flex items-center gap-3">
                <PiUserCircleThin className="w-10 h-10 rounded-full" />
                <div>
                  <p className="text-sm text-gray-900 font-medium">
                    {document.owner.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {document.owner.email}
                  </p>
                </div>
                <span className="ml-auto text-sm text-gray-400 mr-1">
                  Doc owner
                </span>
              </div>
              {collaborator.map((user, id) => (
                <div key={id} className="w-full flex items-center gap-3">
                  <PiUserCircleThin className="w-10 h-10 rounded-full" />
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
                    <option value="Viewer">Can view</option>
                    <option value="Editor">Can edit</option>
                    <option value="Remove">Remove</option>
                  </select>
                </div>
              ))}
            </div>
          ) : matchedUser ? (
            <div
              onClick={AddtoUserList}
              className="flex items-center gap-3 border border-gray-200 rounded-lg p-2 shadow-sm hover:bg-gray-100"
            >
              <PiUserCircleThin className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-sm text-gray-900 font-medium">
                  {matchedUser.name}
                </p>
                <p className="text-sm text-gray-500">{matchedUser.email}</p>
              </div>
            </div>
          ) : userAddedList.length == 0 ? (
            <div className="text-sm text-gray-400">No matching user found</div>
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
        </div>

        <div className="flex justify-between">
          <div>
            {userAddedList.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-800">
                <span className="font-medium">People invited</span>

                <select
                  value={roleAdded}
                  onChange={(e) => setRoleAdded(e.target.value)}
                  className="ml-auto mr-1 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white shadow-sm"
                >
                  <option value="Viewer">Can view</option>
                  <option value="Editor">Can edit</option>
                </select>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={handleTurnDownModal}
              className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
              onClick={handleSaveAccess}
              disabled={!action?.includes("ADD")}
            >
              {emailInput.trim() || userAddedList.length > 0 ? "Add" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
