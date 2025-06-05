import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { setTextColor, setTextFont, setTextSize } from "../../../store/textAnnotationSlice";

export default function TextColorSection() {
  const textcolors = ["black","red","blue","teal","yellow","light-blue","white",];
  const fonts = ["Arimo","EB Garamond","Inter","Lora","Merriweather","Montserrat","Noto Sans",];
  const textSizes = ["10pt", "12pt", "14pt", "16pt", "18pt", "24pt", "32pt"];
  const dispatch = useDispatch<AppDispatch>();
  const textColor = useSelector((state: RootState) => state.text.textColor);
  const textFont = useSelector((state: RootState) => state.text.textFont);
  const textSize = useSelector((state: RootState) => state.text.textSize);
  return (
    <div className="w-full mb-4 flex flex-col gap-1">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Text Style</h3>
      <div className="w-full flex gap-4">
        <div className="w-[178px] px-2 border border-gray-300 bg-white rounded-sm">
          <select
            value={textFont}
            onChange={(e) => dispatch(setTextFont(e.target.value))}
            className="p-[3px] w-full focus:outline-none focus:ring-0 focus:border-transparent"
          >
            {fonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 px-2 border border-gray-300 bg-white rounded-sm min-w-0">
          <select
            value={textSize}
            onChange={(e) => dispatch(setTextSize(e.target.value))}
            className="p-[3px] w-full focus:outline-none focus:ring-0 focus:border-transparent"
          >
            {textSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex w-full justify-between gap-2">
        {textcolors.map((color, index) => (
          <button
            key={index}
            onClick={() => dispatch(setTextColor(color))}
            className="w-8 h-8 flex items-center justify-center rounded-full"
          >
            <div
              className={`w-6 h-6 rounded-full border-[1.5px] border-gray-300 transition
              ${
                color === "black"
                  ? "bg-black"
                  : color === "red"
                  ? "bg-red-500"
                  : color === "blue"
                  ? "bg-blue-500"
                  : color === "teal"
                  ? "bg-teal-500"
                  : color === "yellow"
                  ? "bg-yellow-200"
                  : color === "light-blue"
                  ? "bg-blue-100"
                  : "bg-white"
              }
          ${color === textColor ? "ring-2 ring-black ring-offset-1" : ""}
            `}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
