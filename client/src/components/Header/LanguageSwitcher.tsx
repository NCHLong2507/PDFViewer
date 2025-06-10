import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div style={{ display: "flex", gap: "10px", cursor: "pointer" }}>
      <img
        src="https://cdn6.agoda.net/images/mobile/flag-vn@2x.png"
        alt="Tiếng Việt"
        width={36}
        height="auto"
        style={{ opacity: i18n.language === "vi" ? 1 : 0.3 }}
        onClick={() => toggleLanguage("vi")}
      />
      <img
        src="https://cdn6.agoda.net/images/mobile/flag-us@2x.png"
        alt="English"
        width={36}
        height="auto"
        style={{ opacity: i18n.language === "en" ? 1 : 0.3 }}
        onClick={() => toggleLanguage("en")}
      />
    </div>
  );
}
