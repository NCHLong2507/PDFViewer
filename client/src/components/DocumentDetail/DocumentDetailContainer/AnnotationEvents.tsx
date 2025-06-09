import type { Core } from "@pdftron/webviewer";
import type { WebViewerInstance } from "@pdftron/webviewer";
import {
  setShowShapeCustomTable,
  setShowTextCustomTable,
} from "../../../store/documentDetailSlice/documentDetailSlice";
import {
  setIsShapeModified,
  setShapeAnnotation,
  setStyle,
} from "../../../store/documentDetailSlice/shapeAnnotationSlice";
import { debounce } from "lodash";
import { type AppDispatch } from "../../../store/store";
import type { Document } from "../../../interface/document";
import {
  setFrameStyle,
  setIsTextModified,
  setTextAnnotation,
} from "../../../store/documentDetailSlice/textAnnotationSlice";
import { setIsChangeSaved } from "../../../store/documentDetailSlice/documentDetailSlice";
import documentDetailService from "../../../services/documentDetailService";

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
  document: Document,
  annotWaitingQueue: { [key: string]: string }
) {
  annotationManager.addEventListener("annotationSelected", (annotations) => {
    const annot = annotations[0];
    if (annot && !annot.Subject.toLowerCase().includes("text")) {
      const scrollViewElement =
        instanceRef.current.Core.documentViewer.getScrollViewElement();
      const toolbar = window.document.getElementById("DocumentShapeTool");
      if (toolbar && scrollViewElement) {
        const scrollViewHTMLElement = scrollViewElement as HTMLElement;
        toolbar.style.left = `${scrollViewHTMLElement.offsetLeft + 100}px`;
        toolbar.style.top = `${scrollViewHTMLElement.offsetTop + 20}px`;
      }
      dispatch(setShowShapeCustomTable(true));
      dispatch(setShowTextCustomTable(false));
      instanceRef.current.UI.setToolMode("AnnotationEdit");
      let FillColor = annot.FillColor;
      const StrokeColor = annot.StrokeColor;
      if (
        annot.Subject?.toLowerCase() === "arrow" ||
        annot.Subject?.toLowerCase() === "line"
      ) {
        FillColor = StrokeColor;
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
      const stroke_color = getNameFromColor({
        r: StrokeColor.R,
        g: StrokeColor.G,
        b: StrokeColor.B,
        a: StrokeColor.A,
      });
      dispatch(setIsShapeModified(true));
      dispatch(
        setShapeAnnotation({
          opacity: Opacity,
          selectedColor: selectedColor,
          stroke: Stroke,
          strokeColor: stroke_color,
        })
      );
      dispatch(setStyle("fill"));
    } else if (annot && annot.Subject.toLowerCase().includes("text")) {
      const scrollViewElement =
        instanceRef.current.Core.documentViewer.getScrollViewElement();
      const toolbar = window.document.getElementById("DocumentTextTool");
      if (toolbar && scrollViewElement) {
        const scrollViewHTMLElement = scrollViewElement as HTMLElement;
        toolbar.style.left = `${scrollViewHTMLElement.offsetLeft + 100}px`;
        toolbar.style.top = `${scrollViewHTMLElement.offsetTop + 20}px`;
      }
      dispatch(setShowTextCustomTable(true));
      dispatch(setShowShapeCustomTable(false));
      const FillColor = annot.FillColor;
      const TextColor = annot.TextColor;
      const StrokeColor = annot.StrokeColor;
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
      const stroke_color = getNameFromColor({
        r: StrokeColor.R,
        g: StrokeColor.G,
        b: StrokeColor.B,
        a: StrokeColor.A,
      });
      dispatch(setIsTextModified(true));
      dispatch(
        setTextAnnotation({
          textColor: text_color,
          textFont: Font,
          textSize: FontSize,
          textFillBorder: Stroke,
          textFillOpacity: Opacity,
          textFillColor: fill_color,
          textStrokeColor: stroke_color,
        })
      );
      dispatch(setFrameStyle("fill"));
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
    await documentDetailService.addAnnotation(
      documentID,
      xfdfString,
      annotation.Id
    );
  };
  const debouncedExportAndSendXFDF = debounce(
    async (
      annotWaitingQueue: { [key: string]: string },
      documentID: string
    ) => {
      try {
        if (!documentID) return;
        await documentDetailService.updateAnnotation(
          documentID,
          annotWaitingQueue
        );
        dispatch(setIsChangeSaved(true));
        Object.keys(annotWaitingQueue).forEach((key) => {
          delete annotWaitingQueue[key];
        });
      } catch (err) {
        console.error("Export or send XFDF failed", err);
      }
    },
    1500
  );
  annotationManager.addEventListener("documentUnloaded", () =>
    debouncedExportAndSendXFDF(annotWaitingQueue, id)
  );
  annotationManager.addEventListener(
    "annotationChanged",
    async (annotations, action) => {
      if (["modify", "delete"].includes(action)) {
        for (const annot of annotations) {
          if (annot.goa) {
            continue;
          }
          console.log(annot);
          dispatch(setIsChangeSaved(false));
          if (action === "delete") {
            annotWaitingQueue[annot.Id] = "";
          } else {
            const xfdfString = await annotationManager.exportAnnotations({
              annotationList: [annot],
              links: false,
              widgets: false,
            });
            annotWaitingQueue[annot.Id] = xfdfString;
          }
        }

        debouncedExportAndSendXFDF(annotWaitingQueue, id);
      } else if (action === "add") {
        const isLoadingFirst =
          sessionStorage.getItem("IsLoading") ??
          String(document.isLoadingFirst);
        if (isLoadingFirst === "false") {
          sessionStorage.setItem("IsLoading", "true");
          const promises = annotations.map((annot: any) => {
            annot.goa = undefined;
            return cloneAnnotation([annot], document._id);
          });
          Promise.all(promises);
        }
        const notImported = annotations.filter(
          (annot: any) => !("isImporting" in annot)
        );
        for (const annot of annotations) {
          if (annot.goa) {
            annotationManager.deleteAnnotation(annot);
          }
        }
        if (notImported.length > 0) {
          console.log(notImported);
          dispatch(setIsChangeSaved(false));
          const exportPromises = notImported.map(
            async (annot: Core.Annotations.Annotation) => {
              const xfdfString = await annotationManager.exportAnnotations({
                annotationList: [annot],
                links: false,
                widgets: false,
              });
              return { id: annot.Id, xfdfString };
            }
          );
          const results = await Promise.all(exportPromises);
          results.forEach(({ id, xfdfString }) => {
            annotWaitingQueue[id] = xfdfString;
          });
          debouncedExportAndSendXFDF(annotWaitingQueue, id);
        }
      }
    }
  );
}
