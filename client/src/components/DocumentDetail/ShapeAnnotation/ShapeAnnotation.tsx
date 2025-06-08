import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import OpacitySection from "../Section/OpacitySection";
import ShapeSection from "./ShapeSection";
import StyleSection from "../Section/StyleSection";
import FillStrokeSection from "../Section/FillStrokeSection";
import DeleteButton from "../Section/DeleteButton";
import { setShapeAnnotation, setStyle } from "../../../store/documentDetailSlice/shapeAnnotationSlice";
import { stroke } from "pdf-lib";

interface ShapeAnnotaionProps {
  instanceRef: React.RefObject<any>;
  getToolNameFromShape: (shape: string) => string;
  getColorFromName: (colorName: string) => {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  DeleteAnnotation: () => void;
}
export default function ShapeAnnotation({
  instanceRef,
  getToolNameFromShape,
  getColorFromName,
  DeleteAnnotation,
}: ShapeAnnotaionProps) {
  const dispatch = useDispatch<AppDispatch>();

  const showShapeCustomTable = useSelector(
    (state: RootState) => state.editor.showShapeCustomTable
  );
  const style = useSelector((state: RootState) => state.shape.style);
  const shapeAnnotation = useSelector(
    (state: RootState) => state.shape.shapeAnnotation
  );
  const isShapeModified = useSelector(
    (state: RootState) => state.shape.isShapeModified
  );

  useEffect(() => {
    if (instanceRef.current) {
      const toolName = getToolNameFromShape(shapeAnnotation.selectedShape);
      instanceRef.current.UI.setToolMode(toolName);
    }
  }, [shapeAnnotation.selectedShape]);

  useEffect(() => {
    if (instanceRef.current && !isShapeModified) {
      const toolmode = getToolNameFromShape(shapeAnnotation.selectedShape);
      const { Annotations, documentViewer } = instanceRef.current.Core;
      const tool = documentViewer.getTool(toolmode);
      const color = getColorFromName(shapeAnnotation.selectedColor);
      const strokeColor = getColorFromName(shapeAnnotation.strokeColor);
      if (toolmode === "AnnotationCreateLine") {
        tool.setStyles({
          StrokeColor: new Annotations.Color(
            strokeColor.r,
            strokeColor.g,
            strokeColor.b,
            strokeColor.a
          ),
          StrokeThickness: shapeAnnotation.stroke || 1,
          Opacity: shapeAnnotation.opacity / 100,
          StartLineStyle: "None",
          EndLineStyle: "None",
        });
      } else if (toolmode === "AnnotationCreateArrow") {
        const fillcolor = new Annotations.Color(
          strokeColor.r,
          strokeColor.g,
          strokeColor.b,
          strokeColor.a
        );
        tool.setStyles({
          StrokeColor: fillcolor,
          StrokeThickness: shapeAnnotation.stroke || 1,
          FillColor: fillcolor,
          Opacity: shapeAnnotation.opacity / 100,
          StartLineStyle: "None",
          EndLineStyle: "ClosedArrow",
        });
      } else {
        tool.setStyles({
          FillColor: new Annotations.Color(color.r, color.g, color.b, color.a),
          StrokeThickness: shapeAnnotation.stroke || 1,
          Opacity: shapeAnnotation.opacity / 100,
          StrokeColor: new Annotations.Color(
            strokeColor.r,
            strokeColor.g,
            strokeColor.b,
            strokeColor.a
          ),
        });
      }
      instanceRef.current.UI.setToolMode(toolmode);
    } else if (instanceRef.current && isShapeModified) {
      const { annotationManager } = instanceRef.current.Core;
      const selectedAnnots = annotationManager.getSelectedAnnotations();
      const annot = selectedAnnots[0];
      if (!annot) return;
      const newColor = getColorFromName(shapeAnnotation.selectedColor);
      const storkeColor = getColorFromName(shapeAnnotation.strokeColor);
      annot.FillColor.R = newColor.r;
      annot.FillColor.G = newColor.g;
      annot.FillColor.B = newColor.b;
      annot.FillColor.A = newColor.a;

      if (
        annot.Subject?.toLowerCase() === "arrow" ||
        annot.Subject?.toLowerCase() === "line"
      ) {
        annot.StrokeColor.R = storkeColor.r;
        annot.StrokeColor.G = storkeColor.g;
        annot.StrokeColor.B = storkeColor.b;
      } else {
        annot.StrokeColor.R = storkeColor.r;
        annot.StrokeColor.G = storkeColor.g;
        annot.StrokeColor.B = storkeColor.b;
        annot.StrokeColor.A = storkeColor.a;
      }
      annot.StrokeThickness = shapeAnnotation.stroke;
      annot.Opacity = shapeAnnotation.opacity / 100;
      annotationManager.updateAnnotation(annot);
      annotationManager.trigger("annotationChanged", [[annot], "modify", {}]);
    }
  }, [shapeAnnotation]);
  return (
    <div
      id="DocumentShapeTool"
      className={`right-22 bottom-45 absolute ${
        showShapeCustomTable ? "flex" : "opacity-0 pointer-events-none absolute"
      } justify-between flex-col bg-gray-100 border border-gray-300 rounded-lg shadow-2xl w-[320px] ${!isShapeModified ? `max-h-[338px]` : `max-h-[270px]` } z-50`}
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
          setFillColor={(value: string) => dispatch(setShapeAnnotation({selectedColor:value}))}
          fillColor={shapeAnnotation.selectedColor}
          stroke={shapeAnnotation.stroke}
          setStroke={(value: number) => dispatch(setShapeAnnotation({stroke:value}))}
          setStrokeColor={(value: string) => dispatch(setShapeAnnotation({strokeColor:value}))}
          strokeColor={shapeAnnotation.strokeColor}
        />
        <OpacitySection
          opacity={shapeAnnotation.opacity}
          setOpacity={(value: number) => dispatch(setShapeAnnotation({opacity:value}))}
        />
      </div>
      {isShapeModified && <DeleteButton DeleteAnnotation={DeleteAnnotation} />}
    </div>
  );
}
