import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ShapeAnnotation {
  opacity: number;
  selectedShape: string;
  selectedColor: string;
  stroke: number;
  strokeColor: string;
}

interface ShapeState {
  style: string;
  shapeAnnotation: ShapeAnnotation;
  isShapeModified: boolean;
}

const initialState: ShapeState = {
  style: "fill",
  shapeAnnotation: {
    opacity: 100,
    selectedShape: "rectangle",
    selectedColor: "black",
    stroke: 1,
    strokeColor: "transparent",
  },
  isShapeModified: false,
};

const shapeSlice = createSlice({
  name: "shape",
  initialState,
  reducers: {
    setStyle(state, action: PayloadAction<string>) {
      state.style = action.payload;
    },
    setShapeAnnotation(state, action: PayloadAction<Partial<ShapeAnnotation>>) {
      state.shapeAnnotation = { ...state.shapeAnnotation, ...action.payload };
    },
    resetShapeStyle(state) {
      state.shapeAnnotation = initialState.shapeAnnotation;
    },
    setIsShapeModified(state, action: PayloadAction<boolean>) {
      state.isShapeModified = action.payload;
    },
  },
});

export const {
  setStyle,
  setShapeAnnotation,
  resetShapeStyle,
  setIsShapeModified,
} = shapeSlice.actions;

export default shapeSlice.reducer;
