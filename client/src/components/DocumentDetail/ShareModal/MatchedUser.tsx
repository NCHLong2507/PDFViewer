import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { PiUserCircleThin } from "react-icons/pi";
import type { Document } from "../../../interface/document";
import {
  setEmailInput,
  setMatchedUser,
  setUserAddedList,
} from "../../../store/documentDetailSlice/shareModalSlice";

export default function MatchedUser({ document }: { document: Document }) {
  const matchedUser = useSelector(
    (state: RootState) => state.shareModal.matchedUser
  );
  const userAddedList = useSelector(
    (state: RootState) => state.shareModal.userAddedList
  );
  const collaborator = useSelector(
    (state: RootState) => state.shareModal.collaborator
  );
  const dispatch = useDispatch<AppDispatch>();
  const AddtoUserList = () => {
    if (
      matchedUser &&
      !userAddedList.includes(matchedUser.email) &&
      matchedUser.email !== document.owner.email
    ) {
      const alreadyExists = collaborator.some(
        (c) => c.user.email === matchedUser.email
      );
      if (!alreadyExists) {
        const newUserAddList = [...userAddedList, matchedUser.email];
        dispatch(setUserAddedList(newUserAddList));
      }
    }
    dispatch(setMatchedUser(null));
    dispatch(setEmailInput(""));
    return;
  };

  return (
    <div
      onClick={AddtoUserList}
      className="flex items-center gap-3 border border-gray-200 rounded-lg p-2 shadow-sm hover:bg-gray-100"
    >
      {matchedUser?.picture ? (
        <img
          src={matchedUser.picture}
          className="w-10 h-10 rounded-full"
          alt="avatar"
        />
      ) : (
        <PiUserCircleThin className="w-10 h-10" />
      )}
      <div>
        <p
          className={`text-sm ${
            matchedUser?.name === "Unregistered User" ||
            matchedUser?.name === "Người dùng chưa đăng ký"
              ? `text-red-700`
              : `text-gray-900`
          } font-medium`}
        >
          {matchedUser?.name}
        </p>
        <p className="text-sm text-gray-500">{matchedUser?.email}</p>
      </div>
    </div>
  );
}
