import { IoIosArrowDown } from "react-icons/io";
import { RiRectangleLine } from "react-icons/ri";
import { setIsTextModified, setTextColor, setTextFillBorder, setTextFillColor, setTextFillOpacity, setTextFont, setTextSize } from "../../../store/textAnnotationSlice";
import type { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import type { WebViewerInstance } from "@pdftron/webviewer";
import { toggleShowShapeCustomTable, toggleShowTextCustomTable } from "../../../store/documentViewerSlice";
import { setIsShapeModified, setOpacity, setSelectedColor, setSelectedShape, setStroke, setStyle } from "../../../store/shapeAnnotationSlice";

interface AnnotationButtonProps {
  instanceRef: React.RefObject<WebViewerInstance>;
  getToolNameFromShape: (shape: string) => string;
  action: string[] | undefined;
}

export default function AnnotationButton({instanceRef,getToolNameFromShape,action}: AnnotationButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const showShapeCustomTable = useSelector((state: RootState) => state.editor.showShapeCustomTable);
  const showTextCustomTable = useSelector((state: RootState) => state.editor.showTextCustomTable);
  const isTextModified = useSelector((state: RootState) => state.text.isTextModified);
  const isShapeModified = useSelector((state: RootState) => state.shape.isShapeModified);
  const selectedShape = useSelector((state: RootState) => state.shape.selectedShape);
  const handleTextAnnotation = () => {
    if (showShapeCustomTable) return;
    const instance = instanceRef.current;
    const annotationManager = instance?.Core.annotationManager;
    if (isTextModified) {
      annotationManager?.deselectAllAnnotations();
      return;
    }
    dispatch(setIsTextModified(false));
    dispatch(setTextColor("black"));
    dispatch(setTextFont("Inter"));
    dispatch(setTextSize("12pt"));
    dispatch(setTextFillBorder(0));
    dispatch(setTextFillOpacity(100));
    dispatch(setTextFillColor("white"));

    const texttable = window.document.getElementById("DocumentTextTool");
    if (texttable) {
      texttable.style.left = "";
      texttable.style.top = "";
      texttable.style.right = "88px";
      texttable.style.bottom = "180px";
    }
    setTimeout(() => {
      if (!isTextModified && showTextCustomTable) {
        instance?.UI.setToolMode("AnnotationEdit");
      } else {
        instance?.UI.setToolMode("AnnotationCreateFreeText");
      }
      dispatch(toggleShowTextCustomTable());
    }, 0);
  };
  const handleShapeAnnotation = () => {
    if (showTextCustomTable) return;
    const instance = instanceRef.current;
    const annotationManager = instance?.Core.annotationManager;
    if (isShapeModified) {
      annotationManager?.deselectAllAnnotations();
      return;
    }

    dispatch(setIsShapeModified(false));
    dispatch(setStyle("fill"));
    dispatch(setSelectedColor("black"));
    dispatch(setSelectedShape("rectangle"));
    dispatch(setStroke(1));
    dispatch(setOpacity(10));

    const toolbar = window.document.getElementById("DocumentShapeTool");
    if (toolbar) {
      toolbar.style.left = "";
      toolbar.style.top = "";
      toolbar.style.right = "88px";
      toolbar.style.bottom = "180px";
    }
    setTimeout(() => {
      if (!isShapeModified && showShapeCustomTable) {
        instance?.UI.setToolMode("AnnotationEdit");
      } else {
        const toolName = getToolNameFromShape(selectedShape);
        instance?.UI.setToolMode(toolName);
      }
      dispatch(toggleShowShapeCustomTable());
    }, 0);
  };
  
  return (
    <div className="absolute bottom-[120px] left-[1320px] h-[48px] flex items-center gap-2 px-2 py-2 rounded-lg shadow-md bg-white w-fit">
      <div className="flex items-center h-full gap-2 text-gray-800">
        <button
          onClick={handleShapeAnnotation}
          className={`flex items-center gap-2 p-1 rounded-md ${
            showShapeCustomTable && !isShapeModified ? `bg-gray-300` : ``
          }`}
          disabled={action?.includes("EDIT") ? false : true}
        >
          <RiRectangleLine className="" />
          <span className="text-md font-[400]">Shape</span>
        </button>

        <IoIosArrowDown onClick={action?.includes("EDIT") ? handleShapeAnnotation: undefined} />
      </div>

      <div className="w-px h-5 bg-gray-300"></div>

      <button
        onClick={handleTextAnnotation}
        className={`flex items-center gap-2 px-1 text-gray-800 rounded-md ${
          showTextCustomTable && !isTextModified ? `bg-gray-300` : ``
        }`}
        disabled={action?.includes("EDIT") ? false : true}
      >
        <span className="text-base">
          +<span className="font-serif text-2xl">T</span>
        </span>
        <span className="text-sm font-[400]">Type</span>
      </button>
      <IoIosArrowDown onClick={action?.includes("EDIT") ? handleTextAnnotation: undefined} />
    </div>
  );
}

