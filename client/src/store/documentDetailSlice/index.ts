import documentViewerReducer from "./documentDetailSlice.ts";
import shapeAnnotationReducer from "./shapeAnnotationSlice.ts";
import textAnnotationReducer from "./textAnnotationSlice.ts";
import shareModalReducer from "./shareModalSlice.ts";
import { combineReducers } from "@reduxjs/toolkit";
const documentDetailReducer = combineReducers({
  editor: documentViewerReducer,
  shape: shapeAnnotationReducer,
  text: textAnnotationReducer,
  shareModal: shareModalReducer,
});

export default documentDetailReducer;
