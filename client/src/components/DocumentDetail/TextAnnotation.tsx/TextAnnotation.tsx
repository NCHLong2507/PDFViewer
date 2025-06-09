import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import DeleteButton from "../Section/DeleteButton";
import OpacitySection from "../Section/OpacitySection";
import StyleSection from "../Section/StyleSection";
import FillStrokeSection from "../Section/FillStrokeSection";
import TextColorSection from "./TextStyleSection";
import type { Core } from "@pdftron/webviewer";
import {
  setFrameStyle,
  setTextAnnotation,
} from "../../../store/documentDetailSlice/textAnnotationSlice";
interface TextAnnotationProps {
  instanceRef: React.RefObject<any>;
  getColorFromName: (colorName: string) => {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  DeleteAnnotation: () => void;
}
export default function TextAnnotation({
  instanceRef,
  getColorFromName,
  DeleteAnnotation,
}: TextAnnotationProps) {
  const dispatch = useDispatch<AppDispatch>();
  const textAnnotation = useSelector(
    (state: RootState) => state.docDetail.text.textAnnotation
  );
  const frameStyle = useSelector((state: RootState) => state.docDetail.text.frameStyle);
  const isTextModified = useSelector(
    (state: RootState) => state.docDetail.text.isTextModified
  );
  const showTextCustomTable = useSelector(
    (state: RootState) => state.docDetail.editor.showTextCustomTable
  );
  function setColor(
    targetColor: Core.Annotations.Color,
    colorObj: { r: number; g: number; b: number; a: number }
  ) {
    targetColor.R = colorObj.r;
    targetColor.G = colorObj.g;
    targetColor.B = colorObj.b;
    targetColor.A = colorObj.a;
  }

  useEffect(() => {
    if (instanceRef.current && !isTextModified) {
      const toolmode = "AnnotationCreateFreeText";
      const { Annotations, documentViewer } = instanceRef.current.Core;
      const tool = documentViewer.getTool("AnnotationCreateFreeText");
      const text_color = getColorFromName(textAnnotation.textColor);
      const fill_color = getColorFromName(textAnnotation.textFillColor);
      const stroke_color = getColorFromName(textAnnotation.textStrokeColor);
      tool.setStyles({
        TextColor: new Annotations.Color(
          text_color.r,
          text_color.g,
          text_color.b,
          text_color.a
        ),
        StrokeThickness: textAnnotation.textFillBorder || 0,
        FillColor: new Annotations.Color(
          fill_color.r,
          fill_color.g,
          fill_color.b,
          fill_color.a
        ),
        StrokeColor: new Annotations.Color(
          stroke_color.r,
          stroke_color.g,
          stroke_color.b,
          stroke_color.a
        ),
        Opacity: textAnnotation.textFillOpacity / 100 || 1,
        RichTextStyle: `font-family: ${
          textAnnotation.textFont || "Inter"
        } ; font-size: ${Math.round(
          (parseInt(textAnnotation.textSize) * 4) / 3
        )}px; color: rgba(${text_color.r}, ${text_color.g}, ${text_color.b}, ${
          text_color.a
        });`,
        Intent: Annotations.FreeTextAnnotation.Intent.FreeText,
        FontSize: textAnnotation.textSize || "12pt",
        Font: textAnnotation.textFont || "Inter",
      });
      instanceRef.current.UI.setToolMode(toolmode);
    } else if (instanceRef.current && isTextModified) {
      const { annotationManager } = instanceRef.current.Core;
      const selectedAnnots = annotationManager.getSelectedAnnotations();
      const annot = selectedAnnots[0];
      if (!annot) {
        return;
      }

      setColor(annot.TextColor, getColorFromName(textAnnotation.textColor));
      setColor(annot.FillColor, getColorFromName(textAnnotation.textFillColor));
      setColor(
        annot.StrokeColor,
        getColorFromName(textAnnotation.textStrokeColor)
      );
      annot.StrokeThickness = textAnnotation.textFillBorder;
      annot.Opacity = textAnnotation.textFillOpacity / 100;
      annot.FontSize = textAnnotation.textSize;
      annot.Font = textAnnotation.textFont;
      annotationManager.updateAnnotation(annot);
      annotationManager.trigger("annotationChanged", [[annot], "modify", {}]);
    }
  }, [textAnnotation]);

  return (
    <div
      id="DocumentTextTool"
      className={`right-22 bottom-45 absolute ${
        showTextCustomTable ? "flex" : "opacity-0 pointer-events-none absolute"
      } justify-between flex-col bg-gray-100 border-1 border-gray-300 rounded-lg shadow-2xl w-[320px] ${
        !isTextModified ? `min-h-[300px]` : `max-h-[380px]`
      } z-50`}
    >
      <div className="p-4">
        <TextColorSection />

        <StyleSection
          style={frameStyle}
          setStyle={(value: string) => dispatch(setFrameStyle(value))}
          sectionName="Frame Style"
          fillName="Fill"
          strokeName="Border line"
        />

        <FillStrokeSection
          style={frameStyle}
          setFillColor={(value: string) =>
            dispatch(setTextAnnotation({ textFillColor: value }))
          }
          fillColor={textAnnotation.textFillColor}
          stroke={textAnnotation.textFillBorder}
          setStroke={(value: number) =>
            dispatch(setTextAnnotation({ textFillBorder: value }))
          }
          setStrokeColor={(value: string) =>
            dispatch(setTextAnnotation({ textStrokeColor: value }))
          }
          strokeColor={textAnnotation.textStrokeColor}
        />

        <OpacitySection
          opacity={textAnnotation.textFillOpacity}
          setOpacity={(value: number) =>
            dispatch(setTextAnnotation({ textFillOpacity: value }))
          }
        />
      </div>
      {isTextModified && <DeleteButton DeleteAnnotation={DeleteAnnotation} />}
    </div>
  );
}
