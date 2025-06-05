
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  setFrameStyle,
  setTextFillBorder,
  setTextFillColor,
  setTextFillOpacity,
} from "../../../store/textAnnotationSlice";
import DeleteButton from "../Section/DeleteButton";
import OpacitySection from "../Section/OpacitySection";
import StyleSection from "../Section/StyleSection";
import FillStrokeSection from "../Section/FillStrokeSection";
import TextColorSection from "./TextStyleSection";
interface TextAnnotationProps {
  instanceRef: React.RefObject<any>;
  getColorFromName: (colorName: string) => {r: number;g: number;b: number;a: number;};
  DeleteAnnotation: () => void;
}
export default function TextAnnotation({instanceRef,getColorFromName,DeleteAnnotation,}: TextAnnotationProps) {
  const dispatch = useDispatch<AppDispatch>();
  const textColor = useSelector((state: RootState) => state.text.textColor);
  const textFont = useSelector((state: RootState) => state.text.textFont);
  const textSize = useSelector((state: RootState) => state.text.textSize);
  const frameStyle = useSelector((state: RootState) => state.text.frameStyle);
  const textFillColor = useSelector((state: RootState) => state.text.textFillColor);
  const textFillOpacity = useSelector((state: RootState) => state.text.textFillOpacity);
  const textFillBorder = useSelector((state: RootState) => state.text.textFillBorder);
  const isTextModified = useSelector((state: RootState) => state.text.isTextModified);
  const showTextCustomTable = useSelector((state: RootState) => state.editor.showTextCustomTable);
  useEffect(() => {
    if (instanceRef.current && !isTextModified) {
      const toolmode = "AnnotationCreateFreeText";
      const { Annotations, documentViewer } = instanceRef.current.Core;
      const tool = documentViewer.getTool("AnnotationCreateFreeText");
      const text_color = getColorFromName(textColor);
      const fill_color = getColorFromName(textFillColor);
      tool.setStyles({
        TextColor: new Annotations.Color(text_color.r,text_color.g,text_color.b,text_color.a),
        StrokeThickness: textFillBorder || 0,
        FillColor: new Annotations.Color(fill_color.r,fill_color.g,fill_color.b,fill_color.a),
        Opacity: textFillOpacity / 100 || 1,
        RichTextStyle: `font-family: ${
          textFont || "Inter"
        } ; font-size: ${Math.round(
          (parseInt(textSize) * 4) / 3
        )}px; color: rgba(${text_color.r}, ${text_color.g}, ${text_color.b}, ${
          text_color.a
        });`,
        Intent: Annotations.FreeTextAnnotation.Intent.FreeText,
        FontSize: textSize || "12pt",
        Font: textFont || "Inter",
      });
      instanceRef.current.UI.setToolMode(toolmode);
    } else if (instanceRef.current && isTextModified) {
      const { annotationManager } = instanceRef.current.Core;
      const selectedAnnots = annotationManager.getSelectedAnnotations();
      const annot = selectedAnnots[0];
      if (!annot) {
        return;
      }

      const newTextColor = getColorFromName(textColor);
      annot.TextColor.R = newTextColor.r;
      annot.TextColor.G = newTextColor.g;
      annot.TextColor.B = newTextColor.b;
      annot.TextColor.A = newTextColor.a;
      const newFillColor = getColorFromName(textFillColor);
      annot.FillColor.R = newFillColor.r;
      annot.FillColor.G = newFillColor.g;
      annot.FillColor.B = newFillColor.b;
      annot.FillColor.A = newFillColor.a;
      annot.StrokeThickness = textFillBorder;
      annot.Opacity = textFillOpacity / 100;
      annot.FontSize = textSize;
      annot.Font = textFont;
      annotationManager.updateAnnotation(annot);
      annotationManager.trigger("annotationChanged", [[annot], "modify", {}]);
    }
  }, [textColor,textFont,textSize,textFillBorder,textFillColor,textFillOpacity]);
  return (
    <div
      id="DocumentTextTool"
      className={`right-22 bottom-45 absolute ${
        showTextCustomTable ? "flex" : "opacity-0 pointer-events-none absolute"
      } justify-between flex-col bg-gray-100 border-1 border-gray-300 rounded-lg shadow-2xl w-[320px] h-[355px] z-50`}
    >
      <div className="p-4">
        <TextColorSection/>

        <StyleSection
          style={frameStyle}
          setStyle={(value: string) => dispatch(setFrameStyle(value))}
          sectionName="Frame Style"
          fillName="Fill"
          strokeName="Border line"
        />

        <FillStrokeSection
          style={frameStyle}
          setFillColor={(value: string) => dispatch(setTextFillColor(value))}
          fillColor={textFillColor}
          stroke={textFillBorder}
          setStroke={(value: number) => dispatch(setTextFillBorder(value))}
        />

        <OpacitySection
          opacity={textFillOpacity}
          setOpacity={(value: number) => dispatch(setTextFillOpacity(value))}
        />
      </div>
      {isTextModified && <DeleteButton DeleteAnnotation={DeleteAnnotation} />}
    </div>
  );
}
