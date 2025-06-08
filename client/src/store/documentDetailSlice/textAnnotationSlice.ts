import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TextAnnotation {
  textColor: string;
  textFont: string;
  textSize: string;
  textFillColor: string;
  textFillOpacity: number;
  textFillBorder: number;
  textStrokeColor: string;
}

interface TextState {
  textAnnotation: TextAnnotation;
  isTextModified: boolean;
  frameStyle: string;
}

const initialState: TextState = {
  textAnnotation: {
    textColor: "black",
    textFont: "Inter",
    textSize: "12pt",
    textFillColor: "black",
    textFillOpacity: 100,
    textFillBorder: 1,
    textStrokeColor: "transparent",
  },
  isTextModified: false,
  frameStyle: "fill",
};

const textSlice = createSlice({
  name: "text",
  initialState,
  reducers: {
    setTextAnnotation(state, action: PayloadAction<Partial<TextAnnotation>>) {
      state.textAnnotation = { ...state.textAnnotation, ...action.payload };
    },
    resetTextAnnotation(state) {
      state.textAnnotation = initialState.textAnnotation;
    },
    setIsTextModified(state, action: PayloadAction<boolean>) {
      state.isTextModified = action.payload;
    },
    toggleIsTextModified(state) {
      state.isTextModified = !state.isTextModified;
    },
    setFrameStyle(state, action: PayloadAction<Partial<string>>) {{
      state.frameStyle = action.payload;
    }}
  },
});

export const {
  setTextAnnotation,
  resetTextAnnotation,
  setIsTextModified,
  toggleIsTextModified,
  setFrameStyle
} = textSlice.actions;

export default textSlice.reducer;
