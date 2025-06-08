import documentViewerReducer from "./documentDetailSlice.ts";
import shapeAnnotationReducer from "./shapeAnnotationSlice.ts";
import textAnnotationReducer from "./textAnnotationSlice.ts";
import shareModalReducer from "./shareModalSlice.ts";
const documentDetailReducer = {
  editor: documentViewerReducer,
  shape: shapeAnnotationReducer,
  text: textAnnotationReducer,
  shareModal: shareModalReducer,
};

export default documentDetailReducer;
