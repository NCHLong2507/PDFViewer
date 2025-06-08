import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Document } from "../../interface/document";

interface UiState {
  showAlert: boolean;
  showSuccess: boolean;
  alertMessage: string;
  documentList: Document[];
  id: number;
  sortOrder: boolean;
  googleAccessToken: string | null;
  isLazyLoading: boolean
}

const initialState: UiState = {
  showAlert: false,
  showSuccess: false,
  alertMessage: "",
  documentList: [],
  id: 0,
  sortOrder: false,
  googleAccessToken: null,
  isLazyLoading: false
};

const DocumentList = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setShowAlert(state, action: PayloadAction<boolean>) {
      state.showAlert = action.payload;
    },
    setShowSuccess(state, action: PayloadAction<boolean>) {
      state.showSuccess = action.payload;
    },
    setAlertMessage(state, action: PayloadAction<string>) {
      state.alertMessage = action.payload;
    },
    setDocumentList(state, action: PayloadAction<Document[]>) {
      state.documentList = action.payload;
    },
    appendDocumentList(state, action: PayloadAction<Document[]>) {
      state.documentList = [...state.documentList, ...action.payload];
    },
    addDocumentToFront(state, action: PayloadAction<Document>) {
      state.documentList = [action.payload, ...state.documentList];
    },
    setId(state, action: PayloadAction<number>) {
      state.id = action.payload;
    },
    addId(state) {
      state.id = state.id + 1;
    },
    setSortOrder(state, action: PayloadAction<boolean>) {
      state.sortOrder = action.payload;
    },
    setGoogleAccessToken(state, action: PayloadAction<string | null>) {
      state.googleAccessToken = action.payload;
    },
    setIsLazyLoading(state, action: PayloadAction<boolean>) {
      state.isLazyLoading = action.payload;
    }
  },
});

export const {
  setShowAlert,
  setShowSuccess,
  setAlertMessage,
  setDocumentList,
  appendDocumentList,
  addDocumentToFront,
  setId,
  addId,
  setSortOrder,
  setGoogleAccessToken,
  setIsLazyLoading
} = DocumentList.actions;

export default DocumentList.reducer;
