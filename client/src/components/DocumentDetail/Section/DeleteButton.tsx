import { useTranslation } from "react-i18next";
import DeleteIcon from "../../../assets/DeleteIcon.png";

export default function DeleteButton({DeleteAnnotation}:{DeleteAnnotation: () => void}) {
  const {t} = useTranslation();
  return (
    <div
      onClick={DeleteAnnotation}
      className="flex items-center py-4 px-4 bg-white rounded-b-lg gap-2 border-t border-gray-300 hover:bg-red-50 hover:border-red-300 cursor-pointer transition"
    >
      <img src={DeleteIcon} className="w-4 h-5" />
      <button className="text-red-900 text-[17px]">{t("docDetail.delete")}</button>
    </div>
  );
}
