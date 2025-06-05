interface StyleSectionProps {
  style: string;
  setStyle: (style: string) => void;
  sectionName: string;
  fillName: string;
  strokeName: string;
}
export default function StyleSection({style, setStyle,sectionName,fillName,strokeName}: StyleSectionProps) {
  return (
    <div className="w-full gap-1 flex flex-col">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{sectionName}</h3>
      <div className="w-full flex bg-white rounded-full mb-1">
        <button
          className={`w-[50%] px-4 py-2 rounded-full text-sm  ${
            style === "fill" ? "bg-gray-300 font-medium" : "bg-white"
          } hover:bg-gray-200 focus:outline-none`}
          onClick={() => setStyle("fill")}
        >
          {fillName}
        </button>
        <button
          className={`w-[50%] px-4 py-2 rounded-full text-sm  ${
            style === "stroke" ? "bg-gray-300 font-medium" : "bg-white"
          } hover:bg-gray-200 focus:outline-none`}
          onClick={() => setStyle("stroke")}
        >
          {strokeName}
        </button>
      </div>
    </div>
  );
}
