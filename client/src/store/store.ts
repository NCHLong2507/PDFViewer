import { configureStore } from '@reduxjs/toolkit'
import documentViewerSlice from './documentViewerSlice';
import shapeAnnotationSlice from './shapeAnnotationSlice';
import documentListSlice from './documentListSlice';
import textAnnotationSlice from './textAnnotationSlice';
import shareModalSlice from './shareModalSlice';
export const store = configureStore({
  reducer: {
    editor: documentViewerSlice,
    shape: shapeAnnotationSlice,
    text: textAnnotationSlice,
    docList: documentListSlice,
    shareModal: shareModalSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;