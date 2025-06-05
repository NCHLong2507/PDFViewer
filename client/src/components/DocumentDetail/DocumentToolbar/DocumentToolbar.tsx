
import type { WebViewerInstance } from "@pdftron/webviewer";
import ZoomControl from "./ZoomControl";
import PageNavigation from "./PageNavigation";
interface DocumentToolbarProps {
  instanceRef: React.RefObject<WebViewerInstance>;
}
export default function DocumentToolbar({ instanceRef }: DocumentToolbarProps) {

  return (
    <div className="flex justify-center flex-1 items-center bg-white py-4 rounded-b-xl border-[1px] border-[rgba(217,217,217,1)] w-full h-[64px]">
      <div className="h-[40px] flex justify-center items-center gap-6">
        <ZoomControl instanceRef={instanceRef}/>
        <PageNavigation instanceRef={instanceRef} />
      </div>
    </div>
  );
}
