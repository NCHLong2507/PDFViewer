import type { Core } from "@pdftron/webviewer";
import type { WebViewerInstance } from "@pdftron/webviewer";
import {
  setShowShapeCustomTable,
  setShowTextCustomTable,
} from "../../../store/documentViewerSlice";
import {
  setIsShapeModified,
  setOpacity,
  setSelectedColor,
  setStroke,
} from "../../../store/shapeAnnotationSlice";
import {
  setIsTextModified,
  setTextColor,
  setTextFillBorder,
  setTextFillColor,
  setTextFillOpacity,
  setTextFont,
  setTextSize,
} from "../../../store/textAnnotationSlice";
import { debounce } from "lodash";
import api from "../../../api/axios";
import type { AppDispatch } from "../../../store/store";
import type { Document } from "../../../interface/document";

export default function registerAnnotationEvents(
  annotationManager: Core.AnnotationManager,
  instanceRef: React.RefObject<WebViewerInstance>,
  getNameFromColor: (color: {
    r: number;
    g: number;
    b: number;
    a: number;
  }) => string,
  id: string,
  dispatch: AppDispatch,
  document: Document
) {
  const cloneAnnotation = async (
    annotations: Core.Annotations.Annotation[],
    documentID: string
  ) => {
    const annotation = annotations[0];
    if (!annotation) return;
    const xfdfString = await annotationManager.exportAnnotations({
      annotationList: annotations,
      links: false,
      widgets: false,
    });
    await api.post("/annotation/add", {
      documentID,
      xfdf: xfdfString,
      annotID: annotation.Id,
    });
  };
  const debouncedExportAndSendXFDF = debounce(
    async (
      annotationManager: Core.AnnotationManager,
      annotations: Core.Annotations.Annotation[],
      documentID: string,
      action: string
    ) => {
      try {
        if (!documentID) return;
        const annotation = annotations[0];
        if (!annotation) return;
        const xfdfString = await annotationManager.exportAnnotations({
          annotationList: annotations,
          links: false,
          widgets: false,
        });
        if (action === "add") {
          await api.post("/annotation/add", {
            documentID,
            xfdf: xfdfString,
            annotID: annotation.Id,
          });
        } else if (action === "modify") {
          await api.patch("/annotation/modify", {
            documentID,
            annotID: annotation.Id,
            xfdf: xfdfString,
          });
        } else if (action === "delete") {
          await api.delete(
            `/annotation/delete?annotID=${annotation.Id}&documentID=${documentID}`
          );
        }
      } catch (err) {
        console.error("Export or send XFDF failed", err);
      }
    },
    500
  );
  annotationManager.addEventListener("annotationSelected", (annotations) => {
    const annot = annotations[0];
    if (annot && !annot.Subject.toLowerCase().includes("text")) {
      const scrollViewElement =
        instanceRef.current.Core.documentViewer.getScrollViewElement();
      const toolbar = window.document.getElementById("DocumentShapeTool");
      if (toolbar && scrollViewElement) {
        const scrollViewHTMLElement = scrollViewElement as HTMLElement;
        toolbar.style.left = `${scrollViewHTMLElement.offsetLeft + 100}px`;
        toolbar.style.top = `${scrollViewHTMLElement.offsetTop + 200}px`;
      }
      dispatch(setShowShapeCustomTable(true));
      let FillColor = annot.FillColor;
      if (
        annot.Subject?.toLowerCase() === "arrow" ||
        annot.Subject?.toLowerCase() === "line"
      ) {
        FillColor = annot.StrokeColor;
      }
      const Opacity = Math.round(annot.Opacity * 100);
      const color = {
        r: FillColor.R,
        g: FillColor.G,
        b: FillColor.B,
        a: FillColor.A,
      };
      const Stroke = annot.StrokeThickness;
      const selectedColor = getNameFromColor({
        r: color.r,
        g: color.g,
        b: color.b,
        a: color.a,
      });
      dispatch(setIsShapeModified(true));
      dispatch(setOpacity(Opacity));
      dispatch(setSelectedColor(selectedColor));
      dispatch(setStroke(Stroke));
    } else if (annot && annot.Subject.toLowerCase().includes("text")) {
      const scrollViewElement =
        instanceRef.current.Core.documentViewer.getScrollViewElement();
      const toolbar = window.document.getElementById("DocumentTextTool");
      if (toolbar && scrollViewElement) {
        const scrollViewHTMLElement = scrollViewElement as HTMLElement;
        toolbar.style.left = `${scrollViewHTMLElement.offsetLeft + 100}px`;
        toolbar.style.top = `${scrollViewHTMLElement.offsetTop + 200}px`;
      }
      dispatch(setShowTextCustomTable(true));

      const FillColor = annot.FillColor;
      const TextColor = annot.TextColor;
      const Opacity = Math.round(annot.Opacity * 100);
      const Stroke = annot.StrokeThickness;
      const FontSize = annot.FontSize;
      const Font = annot.Font;
      const text_color = getNameFromColor({
        r: TextColor.R,
        g: TextColor.G,
        b: TextColor.B,
        a: TextColor.A,
      });
      const fill_color = getNameFromColor({
        r: FillColor.R,
        g: FillColor.G,
        b: FillColor.B,
        a: FillColor.A,
      });

      dispatch(setIsTextModified(true));
      dispatch(setTextColor(text_color));
      dispatch(setTextFont(Font));
      dispatch(setTextSize(FontSize));
      dispatch(setTextFillBorder(Stroke));
      dispatch(setTextFillOpacity(Opacity));
      dispatch(setTextFillColor(fill_color));
    }
  });
  annotationManager.addEventListener("annotationDeselected", () => {
    setTimeout(() => {
      const selected = annotationManager.getSelectedAnnotations();
      if (selected.length === 0) {
        dispatch(setIsShapeModified(false));
        dispatch(setShowShapeCustomTable(false));
        dispatch(setIsTextModified(false));
        dispatch(setShowTextCustomTable(false));
        instanceRef.current.UI.setToolMode("AnnotationEdit");
      }
    }, 0);
  });
  annotationManager.addEventListener(
    "annotationChanged",
    (annotations, action) => {
      if (["modify", "delete"].includes(action)) {
        for (const annot of annotations) {
          if (annot.goa) {
            continue;
          }
          debouncedExportAndSendXFDF(
            annotationManager,
            annotations,
            id,
            action
          );
        }
      } else if (action === "add") {
        if (!document.isLoadingFirst) {
          const promises = annotations.map((annot: any) => {
            annot.goa = undefined;
            return cloneAnnotation([annot],document._id);
          });
          Promise.all(promises);
        }
        console.log("ANNOTATION ADDED", annotations);
        const notImported = annotations.filter(
          (annot: any) => !("isImporting" in annot)
        );
        for (const annot of annotations) {
          if (annot.goa) {
            annotationManager.deleteAnnotation(annot);
          }
        }
        if (notImported.length > 0) {
          debouncedExportAndSendXFDF(
            annotationManager,
            notImported,
            id,
            action
          );
        }
      }
    }
  );
}
