import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "Empty Document": "Empty Document",
          "There is no document founded": "There is no document founded",
          "Good afternoon,": "Good afternoon,",
        },
      },
      vi: {
        translation: {
          "Empty Document": "Tài liệu trống",
          "There is no document founded": "Không tìm thấy tài liệu nào",
          "Good afternoon,": "Chào buổi chiều,",
        },
      },
    },
    fallbackLng: "en",
    debug: true,
  });

export default i18n;
