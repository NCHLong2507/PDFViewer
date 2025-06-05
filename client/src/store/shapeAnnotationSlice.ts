import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ShapeAnnotation {
  style: string;
  opacity: number;
  selectedShape: string;
  selectedColor: string;
  stroke: number;
  isShapeModified: boolean;
}

const initialState: ShapeAnnotation = {
  style: "fill",
  opacity: 100,
  selectedShape: "rectangle",
  selectedColor: "black",
  stroke: 1,
  isShapeModified: false,
};

const shapeSlice = createSlice({
  name: "shape",
  initialState,
  reducers: {
    setStyle(state, action: PayloadAction<string>) {
      state.style = action.payload;
    },
    setOpacity(state, action: PayloadAction<number>) {
      state.opacity = action.payload;
    },
    setSelectedShape(state, action: PayloadAction<string>) {
      state.selectedShape = action.payload;
    },
    setSelectedColor(state, action: PayloadAction<string>) {
      state.selectedColor = action.payload;
    },
    setStroke(state, action: PayloadAction<number>) {
      state.stroke = action.payload;
    },
    setIsShapeModified(state, action: PayloadAction<boolean>) {
      state.isShapeModified = action.payload;
    },
  },
});

export const {
  setStyle,
  setOpacity,
  setSelectedShape,
  setSelectedColor,
  setStroke,
  setIsShapeModified,
} = shapeSlice.actions;

export default shapeSlice.reducer;
