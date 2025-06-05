import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TextAnnotation {
  textColor: string;
  textFont: string;
  textSize: string;
  frameStyle: string;
  textFillColor: string;
  textFillOpacity: number;
  textFillBorder: number;
  isTextModified: boolean;
}

const initialState: TextAnnotation = {
  textColor: "black",
  textFont: "Inter",
  textSize: "12pt",
  frameStyle: "fill",
  textFillColor: "black",
  textFillOpacity: 100,
  textFillBorder: 0,
  isTextModified: false,
};
const textSlice = createSlice({
  name: "text",
  initialState,
  reducers: {
    setTextColor(state, action: PayloadAction<string>) {
      state.textColor = action.payload;
    },
    setTextFont(state, action: PayloadAction<string>) {
      state.textFont = action.payload;
    },
    setTextSize(state, action: PayloadAction<string>) {
      state.textSize = action.payload;
    },
    setFrameStyle(state, action: PayloadAction<string>) {
      state.frameStyle = action.payload;
    },
    setTextFillColor(state, action: PayloadAction<string>) {
      state.textFillColor = action.payload;
    },
    setTextFillOpacity(state, action: PayloadAction<number>) {
      state.textFillOpacity = action.payload;
    },
    setTextFillBorder(state, action: PayloadAction<number>) {
      state.textFillBorder = action.payload;
    },
    setIsTextModified(state, action: PayloadAction<boolean>) {
      state.isTextModified = action.payload;
    }
  },
});

export const {
  setTextColor,
  setTextFont,
  setTextSize,
  setFrameStyle,
  setTextFillColor,
  setTextFillOpacity,
  setTextFillBorder,
  setIsTextModified,
} = textSlice.actions;

export default textSlice.reducer;
