import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Collaborator } from "../../interface/collaborator";
import api from "../../api/axios";
interface ShareModalType {
  emailInput: string;
  matchedUser: {
    name: string;
    email: string;
    picture: string;
  } | null;
  userAddedList: string[];
  modified: Collaborator[];
  collaborator: Collaborator[];
}

const initialState: ShareModalType = {
  emailInput: "",
  matchedUser: null,
  userAddedList: [],
  modified: [],
  collaborator: [],
};
export const fetchDocumentPermission = createAsyncThunk(
  "documentDetail/fetchDocumentPermission",
  async (documentId: string, { dispatch, rejectWithValue }) => {
    try {
      const result = await api.get(
        `/document/documentpermission?id=${documentId}`
      );
      if (result.data.status === "success") {
        dispatch(setCollaborator(result.data.permission));
        return result.data.permission;
      } else {
        return rejectWithValue("Permission fetch failed");
      }
    } catch (error: any) {
      console.log(error?.config);
      return rejectWithValue(error?.message || "Unknown error");
    }
  }
);
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
    setModified(state, action: PayloadAction<Collaborator[]>) {
      state.modified = action.payload;
    },
    setCollaborator(state, action: PayloadAction<Collaborator[]>) {
      state.collaborator = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentPermission.fulfilled, (state, action) => {
        state.collaborator = action.payload;
      })
  },
});

export const {
  setEmailInput,
  setMatchedUser,
  setUserAddedList,
  setCollaborator,
  setModified,
} = ShareModal.actions;

export default ShareModal.reducer;
