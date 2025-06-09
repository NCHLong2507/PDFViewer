import { FaRegCircle } from "react-icons/fa6";
import DiagonalLine from "../../../assets/DiagonalLine.png";
import { PiArrowUpRightFill } from "react-icons/pi";
import { RiRectangleLine, RiTriangleLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { useTranslation } from "react-i18next";
import { setShapeAnnotation } from "../../../store/documentDetailSlice/shapeAnnotationSlice";
export default function ShapeSection() {
  const shapes = ["rectangle", "ellipse", "triangle", "line", "arrow"];
  const shapeAnnotation = useSelector((state:RootState)=>state.docDetail.shape.shapeAnnotation);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        {t("docDetail.shape")}
      </h3>
      <div className="flex gap-2">
        {shapes.map((shape, index) => (
          <button
            key={index}
            className={`p-1 h-8 w-8 flex justify-center items-center rounded-lg focus:outline-none
        ${shapeAnnotation.selectedShape === shape ? "bg-pink-100" : ""}
      `}
            onClick={() => dispatch(setShapeAnnotation({selectedShape:shape}))}
          >
            {shape === "rectangle" && <RiRectangleLine className=" w-6 h-6" />}
            {shape === "ellipse" && <FaRegCircle className="w-5 h-5  " />}
            {shape === "triangle" && <RiTriangleLine className="w-5 h-5" />}
            {shape === "line" && (
              <img src={DiagonalLine} className=" w-10 h-10"></img>
            )}
            {shape === "arrow" && <PiArrowUpRightFill className="w-6 h-6" />}
          </button>
        ))}
      </div>
    </div>
  );
}
