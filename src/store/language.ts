import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  lang: string;
  setLang: (lang: string) => void;
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      lang: 'in',
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'dramabox-language',
    }
  )
);

export const languages = [
  { code: 'in', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zhHans', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh', name: '繁體中文', flag: '🇹🇼' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
];

export const lockMessages: Record<string, string> = {
  in: 'Untuk akses API penuh, cek Telegram @leviiwashere',
  en: 'For full API access, check Telegram @leviiwashere',
  ja: '完全なAPIアクセスのについては、Telegram @leviiwashereを確認してください',
  zhHans: '如需完整的 API 访问权限，请检查 Telegram @leviiwashere',
  zh: '如需完整的 API 訪問權限，請檢查 Telegram @leviiwashere',
  es: 'Para obtener acceso completo a la API, consulte Telegram @leviiwashere',
  de: 'Für den vollen API-Zugriff, schauen Sie bei Telegram @leviiwashere vorbei',
  fr: 'Pour un accès complet à l\'API, consultez Telegram @leviiwashere',
  pt: 'Para acesso total à API, verifique o Telegram @leviiwashere',
  ar: 'للوصول الكامل إلى API، تحقق من Telegram @leviiwashere',
  th: 'สำหรับการเข้าถึง API แบบเต็มรูปแบบ โปรดตรวจสอบ Telegram @leviiwashere',
  tl: 'Para sa buong access sa API, tingnan ang Telegram @leviiwashere',
  ko: '전체 API 액세스를 원하시면 Telegram @leviiwashere를 확인하세요',
  tr: 'Tam API erişimi için Telegram @leviiwashere adresini kontrol edin'
};