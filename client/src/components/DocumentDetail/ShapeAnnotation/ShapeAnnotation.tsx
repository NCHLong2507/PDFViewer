import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import OpacitySection from "../Section/OpacitySection";
import ShapeSection from "./ShapeSection";
import StyleSection from "../Section/StyleSection";
import FillStrokeSection from "../Section/FillStrokeSection";
import DeleteButton from "../Section/DeleteButton";
import {
  setOpacity,
  setSelectedColor,
  setStroke,
  setStyle,
} from "../../../store/shapeAnnotationSlice";

interface ShapeAnnotaionProps {
  instanceRef: React.RefObject<any>;
  getToolNameFromShape: (shape: string) => string;
  getColorFromName: (colorName: string) => {r: number;g: number;b: number;a: number;};
  DeleteAnnotation: () => void;
}
export default function ShapeAnnotation({instanceRef,getToolNameFromShape,getColorFromName,DeleteAnnotation,}: ShapeAnnotaionProps) {
  const dispatch = useDispatch<AppDispatch>();

  const showShapeCustomTable = useSelector(
    (state: RootState) => state.editor.showShapeCustomTable
  );
  const style = useSelector((state: RootState) => state.shape.style);
  const opacity = useSelector((state: RootState) => state.shape.opacity);
  const selectedShape = useSelector(
    (state: RootState) => state.shape.selectedShape
  );
  const selectedColor = useSelector(
    (state: RootState) => state.shape.selectedColor
  );
  const stroke = useSelector((state: RootState) => state.shape.stroke);
  const isShapeModified = useSelector(
    (state: RootState) => state.shape.isShapeModified
  );

  useEffect(() => {
    if (instanceRef.current) {
      const toolName = getToolNameFromShape(selectedShape);
      instanceRef.current.UI.setToolMode(toolName);
    }
  }, [selectedShape]);

  useEffect(() => {
    if (instanceRef.current && !isShapeModified) {
      const toolmode = getToolNameFromShape(selectedShape);
      const { Annotations, documentViewer } = instanceRef.current.Core;
      const tool = documentViewer.getTool(toolmode);
      const color = getColorFromName(selectedColor);
      if (toolmode === "AnnotationCreateLine") {
        tool.setStyles({
          StrokeColor: new Annotations.Color(color.r,color.g,color.b,color.a),
          StrokeThickness: stroke || 1,
          Opacity: opacity / 100,
          StartLineStyle: "None",
          EndLineStyle: "None",
        });
      } else if (toolmode === "AnnotationCreateArrow") {
        tool.setStyles({
          StrokeColor: new Annotations.Color(color.r,color.g,color.b,color.a),
          StrokeThickness: stroke || 1,
          FillColor: new Annotations.Color(color.r,color.g,color.b,selectedColor === "transparent" ? 0 : opacity / 100),
          Opacity: opacity / 100,
          StartLineStyle: "None",
          EndLineStyle: "ClosedArrow",
        });
      } else {
        tool.setStyles({
          FillColor: new Annotations.Color(color.r, color.g, color.b, color.a),
          StrokeThickness: stroke || 1,
          Opacity: opacity / 100,
          StrokeColor: new Annotations.Color(0, 0, 0, 1),
        });
      }
      instanceRef.current.UI.setToolMode(toolmode);
    } else if (instanceRef.current && isShapeModified) {
      const { annotationManager } = instanceRef.current.Core;
      const selectedAnnots = annotationManager.getSelectedAnnotations();
      const annot = selectedAnnots[0];
      if (!annot) return;
      const newColor = getColorFromName(selectedColor);
      annot.FillColor.R = newColor.r;
      annot.FillColor.G = newColor.g;
      annot.FillColor.B = newColor.b;
      annot.FillColor.A = newColor.a;
      if (
        annot.Subject?.toLowerCase() === "arrow" ||
        annot.Subject?.toLowerCase() === "line"
      ) {
        annot.StrokeColor.R = newColor.r;
        annot.StrokeColor.G = newColor.g;
        annot.StrokeColor.B = newColor.b;
      }
      annot.StrokeThickness = stroke;
      annot.Opacity = opacity / 100;
      annotationManager.updateAnnotation(annot);
      annotationManager.trigger("annotationChanged", [[annot], "modify", {}]);
    }
  }, [selectedShape, selectedColor, opacity, stroke]);
  return (
    <div
      id="DocumentShapeTool"
      className={`right-22 bottom-45 absolute ${
        showShapeCustomTable ? "flex" : "opacity-0 pointer-events-none absolute"
      } justify-between flex-col bg-gray-100 border border-gray-300 rounded-lg shadow-2xl w-[300px] h-[295px] z-50`}
    >
      <div className="p-4">
        {!isShapeModified && <ShapeSection />}

        <StyleSection
          style={style}
          setStyle={(value: string) => dispatch(setStyle(value))}
          sectionName="Style"
          fillName="Fill"
          strokeName="Stroke"
        />

        <FillStrokeSection
          style={style}
          setFillColor={(value: string) => dispatch(setSelectedColor(value))}
          fillColor={selectedColor}
          stroke={stroke}
          setStroke={(value: number) => dispatch(setStroke(value))}
        />

        <OpacitySection
          opacity={opacity}
          setOpacity={(value: number) => dispatch(setOpacity(value))}
        />
      </div>
      {isShapeModified && <DeleteButton DeleteAnnotation={DeleteAnnotation} />}
    </div>
  );
}
