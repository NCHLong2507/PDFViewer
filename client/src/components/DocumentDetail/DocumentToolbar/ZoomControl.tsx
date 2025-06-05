import { useEffect, useState } from "react";
import { setZoomLevel } from "../../../store/documentViewerSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleDown } from "react-icons/fa";
import type { AppDispatch, RootState } from "../../../store/store";
import type { WebViewerInstance } from "@pdftron/webviewer";
interface ZoomControlProps {
  instanceRef: React.RefObject<WebViewerInstance>;
}
export default function ZoomControl({instanceRef}:ZoomControlProps) {
  const dispatch = useDispatch<AppDispatch>();
  const zoomLevel = useSelector((state: RootState) => state.editor.zoomLevel);
  const [inputValue, setInputValue] = useState<string>(
    Math.round(zoomLevel * 100).toString() + "%"
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const options = ["50%", "75%", "100%", "125%", "150%", "200%"];
  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      const newZoom = Math.round((zoomLevel - 0.01) * 100) / 100;
      dispatch(setZoomLevel(newZoom));
    }
  };
  const handleZoomIn = () => {
    if (zoomLevel < 2) {
      const newZoom = Math.round((zoomLevel + 0.01) * 100) / 100;
      console.log(newZoom);
      dispatch(setZoomLevel(newZoom));
    }
  };
  function handleInputBlur() {
    const val = inputValue.replace("%", "");
    const num = parseInt(val);
    if (!isNaN(num) && num >= 50 && num <= 200) {
      dispatch(setZoomLevel(Math.round((num / 100) * 100) / 100));
    } else {
      setInputValue(`${Math.round(zoomLevel * 100)}%`);
    }
  }
  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleInputBlur();
      (e.target as HTMLInputElement).blur();
    }
  }
  function handleInputZoomLevelChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (/^\d{0,3}%?$/.test(val)) {
      setInputValue(val);
    }
  }
  useEffect(() => {
    setInputValue(Math.round(zoomLevel * 100).toString() + "%");
  }, [zoomLevel]);
  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.UI.setZoomLevel(zoomLevel);
    }
  }, [zoomLevel]);
  return (
    <div className="w-[180px] flex gap-3 justify-center items-center">
      <button
        onClick={handleZoomOut}
        className="text-xl w-8 h-8 text-center justify-center flex border rounded-full hover:bg-gray-100"
      >
        -
      </button>
      <div className="relative flex items-center gap-2">
        <input
          type="text"
          className="rounded px-2 py-1 text-base w-20 border border-gray-300 focus:border-amber-300"
          value={inputValue}
          onChange={handleInputZoomLevelChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
        />

        <FaAngleDown
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
          onClick={() => setShowDropdown((prev) => !prev)}
        />

        {showDropdown && (
          <div className="absolute top-[-200px] mt-1 w-24 border border-gray-300 bg-white rounded shadow z-10">
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  setShowDropdown(false);
                  const newZoom = parseFloat(opt.replace("%", "")) / 100;
                  dispatch(setZoomLevel(newZoom));
                  setInputValue(Math.round(newZoom * 100).toString() + "%");
                }}
                className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={handleZoomIn}
        className="text-xl w-8 h-8 text-center justify-center flex border rounded-full hover:bg-gray-100"
      >
        +
      </button>
    </div>
  );
}
