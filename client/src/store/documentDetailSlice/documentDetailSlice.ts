import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ViewerState {
  zoomLevel: number;
  pageCount: number;
  showSuccessPopup: boolean;
  showShapeCustomTable: boolean;
  showTextCustomTable: boolean;
  showShareModal: boolean;
  downloadSignal: boolean;
  isLoading: boolean;
  isChangeSaved: boolean;
  isDownloadLoading: boolean
}

const initialState: ViewerState = {
  zoomLevel: 1,
  pageCount: 0,
  showSuccessPopup: false,
  showShapeCustomTable: false,
  showTextCustomTable: false,
  showShareModal: false,
  downloadSignal: false,
  isLoading: false,
  isChangeSaved: true,
  isDownloadLoading: false
};

const documentSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setZoomLevel: (state, action: PayloadAction<number>) => {
      state.zoomLevel = action.payload;
    },
    setPageCount: (state, action: PayloadAction<number>) => {
      state.pageCount = action.payload;
    },
    setShowSuccessPopup: (state, action: PayloadAction<boolean>) => {
      state.showSuccessPopup = action.payload;
    },
    toggleShowSuccessPopup: (state) => {
      state.showSuccessPopup = !state.showSuccessPopup;
    },
    setShowShapeCustomTable: (state, action: PayloadAction<boolean>) => {
      state.showShapeCustomTable = action.payload;
    },
    toggleShowShapeCustomTable: (state) => {
      state.showShapeCustomTable = !state.showShapeCustomTable;
    },
    setShowTextCustomTable: (state, action: PayloadAction<boolean>) => {
      state.showTextCustomTable = action.payload;
    },
    toggleShowTextCustomTable: (state) => {
      state.showTextCustomTable = !state.showTextCustomTable;
    },
    setShowShareModal(state, action: PayloadAction<boolean>) {
      state.showShareModal = action.payload;
    },
    toggleShowShareModal: (state) => {
      state.showShareModal = !state.showShareModal;
    },
    toggleDownloadSignal: (state) => {
      state.downloadSignal = !state.downloadSignal;
    },
    setIsLoading:(state, action: PayloadAction<boolean>) => {
      state.isLoading =  action.payload;
    },
    setIsChangeSaved: (state,action: PayloadAction<boolean>)=> {
      state.isChangeSaved = action.payload;
    },
    setIsDownloadLoading: (state,action: PayloadAction<boolean>)=> {
      state.isDownloadLoading = action.payload;
    },
  },
});

export const {
  setZoomLevel,
  setPageCount,
  setShowSuccessPopup,
  toggleShowSuccessPopup,
  setShowShapeCustomTable,
  toggleShowShapeCustomTable,
  setShowTextCustomTable,
  toggleShowTextCustomTable,
  setShowShareModal,
  toggleShowShareModal,
  toggleDownloadSignal,
  setIsLoading,
  setIsChangeSaved,
  setIsDownloadLoading
} = documentSlice.actions;

export default documentSlice.reducer;
