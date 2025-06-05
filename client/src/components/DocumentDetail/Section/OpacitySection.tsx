
interface OpacitySectionProps {
  opacity: number;
  setOpacity:  (value: number) => void;
}

export default function OpacitySection({opacity,setOpacity}:OpacitySectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Opacity</h3>
      <div className="flex items-center justify-between gap-2 mb-2">
        <input
          type="range"
          min="0"
          max="100"
          value={opacity}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setOpacity(value);
          }}
          className="w-[70%] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #fff 5%, #000 90%)",
          }}
        />
        <div className="flex-1 items-center justify-end flex">
          <p className="w-[90%] p-[1px] rounded-md text-sm text-center border-2 border-blue-100 ">
            {opacity}
            <span className="ml-1">%</span>
          </p>
        </div>
      </div>
    </div>
  );
}