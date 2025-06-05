import { useEffect, useRef, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import type { Document as DocumentDTO } from "../../../interface/document";
import type { QueryObserverResult } from "@tanstack/react-query";
import DocumentToolbar from "../DocumentToolbar";
import ShareModal from "../ShareModal/ShareModal";
import ShapeAnnotation from "../ShapeAnnotation/ShapeAnnotation";
import TextAnnotation from "../TextAnnotation.tsx/TextAnnotation";
import api from "../../../api/axios";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import {
  setPageCount,
  setZoomLevel,
  setShowShapeCustomTable,
  setShowTextCustomTable,
  setShowShareModal,
  toggleDownloadSignal,
} from "../../../store/documentViewerSlice";
import { setIsShapeModified } from "../../../store/shapeAnnotationSlice";
import { setIsTextModified } from "../../../store/textAnnotationSlice";
import AnnotationButton from "./AnnotationButton";
import SuccessMessag from "./SuccessMessage";
import TriangleAnnotationRegister from "./TriangleAnnotationRegister";
import RegisterAnnotationEvents from "./AnnotationEvents";
import { get, set } from "idb-keyval";

interface DocDetailContainerProps {
  document: DocumentDTO;
  action: string[] | undefined;
  refetchAction: () => Promise<QueryObserverResult<string[], unknown>>;
  refetchDocument: () => Promise<QueryObserverResult<DocumentDTO>>;
}
export default function DocumentDetailedContainer({
  document,
  action,
  refetchAction,
  refetchDocument,
}: DocDetailContainerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const instanceRef = useRef<any>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const zoomLevel = useSelector((state: RootState) => state.editor.zoomLevel);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const showShareModal = useSelector(
    (state: RootState) => state.editor.showShareModal
  );
  const showSuccessPopup = useSelector(
    (state: RootState) => state.editor.showSuccessPopup
  );
  const opacity = useSelector((state: RootState) => state.shape.opacity);
  const selectedColor = useSelector(
    (state: RootState) => state.shape.selectedColor
  );
  const stroke = useSelector((state: RootState) => state.shape.stroke);
  const downloadSignal = useSelector(
    (state: RootState) => state.editor.downloadSignal
  );
  const shapeToToolMap: Record<string, string> = {
    rectangle: "AnnotationCreateRectangle",
    ellipse: "AnnotationCreateEllipse",
    triangle: "AnnotationCreateTriangle",
    line: "AnnotationCreateLine",
    arrow: "AnnotationCreateArrow",
  };
  const colorNameToRGBA: Record<
    string,
    { r: number; g: number; b: number; a: number }
  > = {
    transparent: { r: 0, g: 0, b: 0, a: 0 },
    black: { r: 0, g: 0, b: 0, a: 1 },
    red: { r: 239, g: 68, b: 68, a: 1 },
    blue: { r: 59, g: 130, b: 246, a: 1 },
    teal: { r: 20, g: 184, b: 166, a: 1 },
    yellow: { r: 253, g: 224, b: 71, a: 1 },
    "light-blue": { r: 191, g: 219, b: 254, a: 1 },
    white: { r: 255, g: 255, b: 255, a: 1 },
  };
  function getToolNameFromShape(shape: string): string {
    return shapeToToolMap[shape] || "AnnotationCreateTriangle";
  }
  function getColorFromName(colorName: string) {
    return colorNameToRGBA[colorName] || colorNameToRGBA["white"];
  }
  function getNameFromColor(color: {
    r: number;
    g: number;
    b: number;
    a: number;
  }): string {
    for (const [name, rgba] of Object.entries(colorNameToRGBA)) {
      if (
        color.r === rgba.r &&
        color.g === rgba.g &&
        color.b === rgba.b &&
        color.a === rgba.a
      ) {
        return name;
      }
    }
    return "white";
  }
  useEffect(() => {
    dispatch(setPageCount(1));
    dispatch(setZoomLevel(1));
    dispatch(setShowShapeCustomTable(false));
    dispatch(setShowTextCustomTable(false));
    dispatch(setShowShareModal(false));
    dispatch(setIsShapeModified(false));
  }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!viewerRef.current) return;
      if (instanceRef.current || !document.fileUrl) return;

      WebViewer(
        {
          path: "/webviewer",
          initialDoc: document.fileUrl,
        },
        viewerRef.current
      ).then((_instance) => {
        try {
          instanceRef.current = _instance;
          const { UI, Core } = _instance;
          const { annotationManager, documentViewer } = Core;
          api
            .get(`/annotation/load-xfdf?id=${document._id}`)
            .then((res) => {
              if (res.data.status === "success" && res.data.xfdf) {
                const xfdf = res.data.xfdf;
                documentViewer.addEventListener("documentLoaded", () => {
                  try {
                    annotationManager.importAnnotations(xfdf);
                  } catch (error) {
                    console.error("Import XFDF error:", error);
                  }
                });
              } else {
                console.warn("No XFDF or status not success");
              }
            })
            .catch((err) => {
              console.error("Failed to load XFDF from server:", err);
            });
          TriangleAnnotationRegister(
            instanceRef,
            opacity,
            stroke,
            selectedColor,
            getColorFromName
          );
          const updatePageInfo = () => {
            const pagecount = documentViewer.getPageCount();
            dispatch(setPageCount(pagecount));
          };
          documentViewer.addEventListener("documentLoaded", () => {
            updatePageInfo();
            setIsLoading(false);
            UI.setToolMode("AnnotationEdit");
            UI.setMaxZoomLevel(2);
            UI.setMinZoomLevel(0.5);
            UI.setZoomLevel(zoomLevel);
          });
          RegisterAnnotationEvents(
            annotationManager,
            instanceRef,
            getNameFromColor,
            document._id,
            dispatch,
            document
          );
          if (documentViewer.getDocument()) {
            updatePageInfo();
          }
          UI.disableElements([
            "default-top-header",
            "tools-header",
            "page-nav-floating-header",
            "annotationCommentButton",
            "annotationStyleEditButton",
            "linkButton",
            "annotationDeleteButton",
          ]);
          UI.enableElements(["richTextPopup"]);
        } catch (err) {
          console.error("Caught error in WebViewer setup:", err);
        }
      });
    }, 100);
    return () => {
      clearTimeout(timeout);
      instanceRef.current = null;
      viewerRef.current = null;
    };
  }, [document.fileUrl]);
  function DeleteAnnotation() {
    if (instanceRef.current) {
      const { annotationManager } = instanceRef.current.Core;
      const selectedAnnots = annotationManager.getSelectedAnnotations();
      if (selectedAnnots.length > 0) {
        annotationManager.deleteAnnotations(selectedAnnots);
        dispatch(setIsShapeModified(false));
        dispatch(setShowShapeCustomTable(false));
        dispatch(setIsTextModified(false));
        dispatch(setShowTextCustomTable(false));
      }
    }
  }
  useEffect(() => {
    if (downloadSignal) {
      const handleDownloadPDFWithXFDF = async () => {
        const { documentViewer, annotationManager } = instanceRef.current.Core;
        const xfdfString = await annotationManager.exportAnnotations({
          links: false,
          widgets: false,
        });
        const data = await documentViewer.getDocument().getFileData({
          xfdfString,
          downloadType: "pdf",
        });
        const blob = new Blob([new Uint8Array(data)], {
          type: "application/pdf",
        });
        const link = window.document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = document.name;
        link.click();
      };
      handleDownloadPDFWithXFDF();
      dispatch(toggleDownloadSignal());
    }
  }, [downloadSignal]);
  const annotationsProps = {
    instanceRef,
    getToolNameFromShape,
    getColorFromName,
    DeleteAnnotation,
  };
  useEffect(() => {
    return () => {
      if (document.isLoadingFirst === false) {
        api.patch(`/document/setLoadingFirst?id=${document._id}`);
      }
    };
  }, []);
  return (
    <div className="w-full h-[648px] flex flex-col justify-center items-center rounded-xl bg-gray-100 border-[1px] border-[rgba(217,217,217,1)]">
      <div
        id="viewer-container"
        className="w-full h-full flex flex-col justify-center items-center overflow-auto scrollbar-hidden relative" // Thêm relative ở đây
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white bg-opacity-80 flex flex-col justify-center items-center rounded-xl">
            <div className="flex space-x-2">
              <div
                className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              ></div>
            </div>
            <p className="text-gray-700 mt-4">Đang tải tài liệu...</p>
          </div>
        )}

        <div
          className={`mt-8 h-[592px] flex justify-center w-full ${
            isLoading ? "invisible" : ""
          }`}
        >
          <div ref={viewerRef} className="w-full h-full" />
        </div>

        <ShapeAnnotation {...annotationsProps} />
        <TextAnnotation {...annotationsProps} />
      </div>
      <AnnotationButton
        instanceRef={instanceRef}
        getToolNameFromShape={getToolNameFromShape}
        action={action}
      />
      <DocumentToolbar instanceRef={instanceRef} />
      {showShareModal && (
        <ShareModal
          document={document}
          action={action}
          refetchDocument={refetchDocument}
        />
      )}
      {showSuccessPopup && <SuccessMessag />}
    </div>
  );
}
