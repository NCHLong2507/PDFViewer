import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CollaboratorDTO } from "../components/DocumentDetail/ShareModal/ShareModal";
interface ShareModalType {
  emailInput: string;
  matchedUser: {
    name: string;
    email: string;
    picture: string;
  } | null;
  userAddedList: string[];
  modified: CollaboratorDTO[];
  collaborator: CollaboratorDTO[];
}

const initialState: ShareModalType = {
  emailInput: "",
  matchedUser: null,
  userAddedList: [],
  modified: [],
  collaborator: [],
};

const ShareModal = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setEmailInput(state, action: PayloadAction<string>) {
      state.emailInput = action.payload;
    },
    setMatchedUser(
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        picture: string;
      } | null>
    ) {
      state.matchedUser = action.payload;
    },
    setUserAddedList(state, action: PayloadAction<string[]>) {
      state.userAddedList = action.payload;
    },
    setModified(state,action: PayloadAction<CollaboratorDTO[]>) {
      state.modified = action.payload;
    },
    setCollaborator(state, action: PayloadAction<CollaboratorDTO[]>) {
      state.collaborator = action.payload;
    }
  },
});

export const { setEmailInput, setMatchedUser, setUserAddedList,setCollaborator,setModified } =
  ShareModal.actions;

export default ShareModal.reducer;
