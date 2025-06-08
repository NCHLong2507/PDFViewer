import StrokeIcon from "../../../assets/md_stroke.png";

interface FillStrokeSectionProps {
  style: string;
  setFillColor: (color: string) => void;
  fillColor: string;
  stroke: number;
  setStroke: (value: number) => void;
  strokeColor: string | undefined;
  setStrokeColor: ((value: string) => void) | undefined;
}

export default function FillStrokeSection({
  style,
  setFillColor,
  fillColor,
  stroke,
  setStroke,
  strokeColor,
  setStrokeColor
}: FillStrokeSectionProps) {
  const colors = [
    "transparent",
    "black",
    "red",
    "blue",
    "teal",
    "yellow",
    "light-blue",
    "white",
  ];
  return (
    <div className="mb-4">
      {style === "fill" ? (
        <div className="flex gap-1 items-center justify-between">
          {colors.map((color, index) => (
            <button
              key={index}
              onClick={() => setFillColor(color)}
              className="w-8 h-8 flex items-center justify-center rounded-full"
            >
              <div
                className={`w-6 h-6 rounded-full border-[1.5px] border-gray-300 transition
              ${
                color === "transparent"
                  ? "bg-[url('/TransparentIcon.png')] bg-cover bg-center border-none"
                  : color === "black"
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
              ${color === fillColor ? "ring-2 ring-black ring-offset-1" : ""}
            `}
              />
            </button>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex flex-col items-center justify-between gap-2 mb-2">
            <div className="flex gap-1 justify-between">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setStrokeColor && setStrokeColor(color)}
                  className="w-8 h-8 flex items-center justify-center rounded-full"
                >
                  <div
                    className={`w-6 h-6 rounded-full border-[1.5px] border-gray-300 transition
              ${
                color === "transparent"
                  ? "bg-[url('/TransparentIcon.png')] bg-cover bg-center border-none"
                  : color === "black"
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
              ${color === strokeColor ? "ring-2 ring-black ring-offset-1" : ""}
            `}
                  />
                </button>
              ))}
            </div>
            <div className="flex flex-row w-full justify-between gap-2 items-center mb-2">
              <img src={StrokeIcon} className="w-8" />
              <div className="relative w-[57%] h-2 flex items-center rounded-lg gap-2">
                <input
                  type="range"
                  id="stroke-range"
                  min="0"
                  max="10"
                  value={stroke}
                  onChange={(e) => setStroke(Number(e.target.value))}
                  className="w-full h-2 bg-transparent appearance-none cursor-pointer"
                />
                <div
                  className="absolute top-0 left-0 h-2 rounded-lg pointer-events-none"
                  style={{
                    width: `${stroke * 10}%`,
                    background: "rgba(43, 49, 55, 1)",
                  }}
                />
              </div>
              <div className="flex-1 flex justify-end">
                <p className="w-[90%] p-[1px] rounded-md text-sm text-center border-2 border-blue-100">
                  {stroke}
                  <span className="ml-1">pt</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
