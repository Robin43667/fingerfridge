// Realistic browser profiles for fingerprint spoofing
// Each profile is internally coherent (UA, platform, navigator props match)
// Some profiles are intentionally absurd to confuse fingerprinters

const PROFILES = [
  // ===================== REALISTIC PROFILES =====================

  // --- Windows + Chrome ---
  {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    platform: "Win32",
    vendor: "Google Inc.",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: undefined,
    appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  },
  {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    platform: "Win32",
    vendor: "Google Inc.",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: undefined,
    appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  },
  // --- Windows + Firefox ---
  {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
    platform: "Win32",
    vendor: "",
    vendorSub: "",
    product: "Gecko",
    productSub: "20100101",
    buildID: "20181001000000",
    oscpu: "Windows NT 10.0; Win64; x64",
    appVersion: "5.0 (Windows)",
  },
  {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
    platform: "Win32",
    vendor: "",
    vendorSub: "",
    product: "Gecko",
    productSub: "20100101",
    buildID: "20181001000000",
    oscpu: "Windows NT 10.0; Win64; x64",
    appVersion: "5.0 (Windows)",
  },
  // --- macOS + Chrome ---
  {
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    platform: "MacIntel",
    vendor: "Google Inc.",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: undefined,
    appVersion: "5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  },
  // --- macOS + Firefox ---
  {
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:127.0) Gecko/20100101 Firefox/127.0",
    platform: "MacIntel",
    vendor: "",
    vendorSub: "",
    product: "Gecko",
    productSub: "20100101",
    buildID: "20181001000000",
    oscpu: "Intel Mac OS X 10.15",
    appVersion: "5.0 (Macintosh)",
  },
  // --- Linux + Firefox ---
  {
    userAgent: "Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0",
    platform: "Linux x86_64",
    vendor: "",
    vendorSub: "",
    product: "Gecko",
    productSub: "20100101",
    buildID: "20181001000000",
    oscpu: "Linux x86_64",
    appVersion: "5.0 (X11)",
  },
  // --- Linux + Chrome ---
  {
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    platform: "Linux x86_64",
    vendor: "Google Inc.",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: undefined,
    appVersion: "5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  },

  // ===================== ABSURD / CHAOTIC PROFILES =====================

  // --- Windows running Safari (impossible in reality) ---
  {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    platform: "Win32",
    vendor: "Apple Computer, Inc.",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: undefined,
    appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
  },
  // --- Linux running Safari (also impossible) ---
  {
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    platform: "Linux x86_64",
    vendor: "Apple Computer, Inc.",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: "Linux x86_64",
    appVersion: "5.0 (X11; Linux x86_64) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
  },
  // --- PlayStation 5 browser ---
  {
    userAgent: "Mozilla/5.0 (PlayStation 5 4.02) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
    platform: "PlayStation 5",
    vendor: "Sony Interactive Entertainment",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: undefined,
    appVersion: "5.0 (PlayStation 5 4.02) AppleWebKit/605.1.15",
  },
  // --- PlayStation 4 browser ---
  {
    userAgent: "Mozilla/5.0 (PlayStation 4 3.11) AppleWebKit/537.73 (KHTML, like Gecko)",
    platform: "PlayStation 4",
    vendor: "Sony Interactive Entertainment",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: undefined,
    appVersion: "5.0 (PlayStation 4 3.11)",
  },
  // --- Nintendo Switch browser ---
  {
    userAgent: "Mozilla/5.0 (Nintendo Switch; WifiWebAuthApplet) AppleWebKit/606.4 (KHTML, like Gecko) NF/6.0.1.15.4 NintendoBrowser/5.1.0.20393",
    platform: "Nintendo Switch",
    vendor: "Nintendo",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: undefined,
    appVersion: "5.0 (Nintendo Switch; WifiWebAuthApplet)",
  },
  // --- Nintendo 3DS ---
  {
    userAgent: "Mozilla/5.0 (New Nintendo 3DS like iPhone) AppleWebKit/536.30 (KHTML, like Gecko) NX/3.0.0.5.22 Mobile NintendoBrowser/1.11.10160.EU",
    platform: "New Nintendo 3DS",
    vendor: "Nintendo",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: undefined,
    appVersion: "5.0 (New Nintendo 3DS like iPhone)",
  },
  // --- Smart TV (Samsung Tizen) ---
  {
    userAgent: "Mozilla/5.0 (SMART-TV; LINUX; Tizen 7.0) AppleWebKit/537.36 (KHTML, like Gecko) Version/7.0 TV Safari/537.36",
    platform: "Tizen 7.0",
    vendor: "Samsung",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: undefined,
    appVersion: "5.0 (SMART-TV; LINUX; Tizen 7.0)",
  },
  // --- Smart TV (LG webOS) ---
  {
    userAgent: "Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.211 Safari/537.36 WebAppManager",
    platform: "Web0S",
    vendor: "LG Electronics",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: undefined,
    appVersion: "5.0 (Web0S; Linux/SmartTV)",
  },
  // --- Smart Fridge (Samsung Family Hub — because why not, we ARE FingerFridge) ---
  {
    userAgent: "Mozilla/5.0 (Linux; Tizen 5.5; FamilyHub) AppleWebKit/537.36 (KHTML, like Gecko) SamsungFamilyHub/3.0 Chrome/85.0.4183.93 Safari/537.36",
    platform: "Tizen 5.5",
    vendor: "Samsung",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: undefined,
    appVersion: "5.0 (Linux; Tizen 5.5; FamilyHub)",
  },
  // --- Tesla car browser ---
  {
    userAgent: "Mozilla/5.0 (X11; GNU/Linux) AppleWebKit/601.1 (KHTML, like Gecko) Tesla/2024.14.3 QtCarBrowser Safari/601.1",
    platform: "Linux armv7l",
    vendor: "Tesla, Inc.",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: "Linux armv7l",
    appVersion: "5.0 (X11; GNU/Linux) Tesla/2024.14.3",
  },
  // --- Xbox browser ---
  {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox Series X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edge/44.18363.8131",
    platform: "Xbox Series X",
    vendor: "Microsoft",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: undefined,
    appVersion: "5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox Series X)",
  },
  // --- Kindle e-reader ---
  {
    userAgent: "Mozilla/5.0 (X11; U; Linux armv7l like Android; en-us) AppleWebKit/531.2+ (KHTML, like Gecko) Version/5.0 Safari/533.2+ Kindle/3.0+",
    platform: "Linux armv7l",
    vendor: "Amazon",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: "Linux armv7l",
    appVersion: "5.0 (X11; U; Linux armv7l like Android; en-us)",
  },
  // --- FreeBSD + Firefox (unusual but real) ---
  {
    userAgent: "Mozilla/5.0 (X11; FreeBSD amd64; rv:127.0) Gecko/20100101 Firefox/127.0",
    platform: "FreeBSD amd64",
    vendor: "",
    vendorSub: "",
    product: "Gecko",
    productSub: "20100101",
    buildID: "20181001000000",
    oscpu: "FreeBSD amd64",
    appVersion: "5.0 (X11)",
  },
  // --- Windows XP + Chrome (time traveler) ---
  {
    userAgent: "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36",
    platform: "Win32",
    vendor: "Google Inc.",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: undefined,
    appVersion: "5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36",
  },
  // --- macOS + Chrome but claiming to be a Raspberry Pi ---
  {
    userAgent: "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Raspbian Chromium/120.0.6099.216 Chrome/120.0.6099.216 Safari/537.36",
    platform: "Linux aarch64",
    vendor: "Google Inc.",
    vendorSub: "",
    product: "Gecko",
    productSub: "20030107",
    buildID: "",
    oscpu: "Linux aarch64",
    appVersion: "5.0 (X11; Linux aarch64) Raspbian Chromium/120.0.6099.216",
  },
];

const LANGUAGES = [
  { header: "en-US,en;q=0.9", js: ["en-US", "en"], primary: "en-US" },
  { header: "en-GB,en;q=0.9", js: ["en-GB", "en"], primary: "en-GB" },
  { header: "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7", js: ["fr-FR", "fr", "en-US", "en"], primary: "fr-FR" },
  { header: "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7", js: ["de-DE", "de", "en-US", "en"], primary: "de-DE" },
  { header: "es-ES,es;q=0.9,en;q=0.8", js: ["es-ES", "es", "en"], primary: "es-ES" },
  { header: "it-IT,it;q=0.9,en;q=0.8", js: ["it-IT", "it", "en"], primary: "it-IT" },
  { header: "pt-BR,pt;q=0.9,en;q=0.8", js: ["pt-BR", "pt", "en"], primary: "pt-BR" },
  { header: "ja-JP,ja;q=0.9,en;q=0.8", js: ["ja", "en"], primary: "ja" },
  { header: "ko-KR,ko;q=0.9,en;q=0.8", js: ["ko-KR", "ko", "en"], primary: "ko-KR" },
  { header: "zh-CN,zh;q=0.9,en;q=0.8", js: ["zh-CN", "zh", "en"], primary: "zh-CN" },
  { header: "ru-RU,ru;q=0.9,en;q=0.8", js: ["ru-RU", "ru", "en"], primary: "ru-RU" },
  { header: "ar-SA,ar;q=0.9,en;q=0.8", js: ["ar-SA", "ar", "en"], primary: "ar-SA" },
];

const SCREENS = [
  { width: 1920, height: 1080 },
  { width: 1366, height: 768 },
  { width: 1536, height: 864 },
  { width: 1440, height: 900 },
  { width: 2560, height: 1440 },
  { width: 1680, height: 1050 },
  { width: 1280, height: 720 },
  { width: 1600, height: 900 },
  { width: 3840, height: 2160 },  // 4K
  { width: 800, height: 600 },    // retro / IoT
  { width: 1024, height: 768 },   // iPad-ish / old monitors
  { width: 720, height: 480 },    // smart TV / console
];

const WEBGL_PROFILES = [
  { vendor: "Google Inc. (Intel)", renderer: "ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11)" },
  { vendor: "Google Inc. (NVIDIA)", renderer: "ANGLE (NVIDIA, NVIDIA GeForce GTX 1660 SUPER Direct3D11 vs_5_0 ps_5_0, D3D11)" },
  { vendor: "Google Inc. (AMD)", renderer: "ANGLE (AMD, AMD Radeon RX 580 Direct3D11 vs_5_0 ps_5_0, D3D11)" },
  { vendor: "Google Inc. (Intel)", renderer: "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)" },
  { vendor: "Google Inc. (NVIDIA)", renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)" },
  { vendor: "Intel Inc.", renderer: "Intel Iris OpenGL Engine" },
  { vendor: "ATI Technologies Inc.", renderer: "AMD Radeon Pro 5500M OpenGL Engine" },
  { vendor: "ARM", renderer: "Mali-G78 MP24" },                    // mobile GPU (Samsung)
  { vendor: "Qualcomm", renderer: "Adreno (TM) 740" },             // mobile GPU (Snapdragon)
  { vendor: "Broadcom", renderer: "VideoCore VI" },                 // Raspberry Pi
  { vendor: "NVIDIA", renderer: "Tegra X1 (rev B)" },              // Nintendo Switch / Shield
  { vendor: "Sony", renderer: "AMD RDNA 2 Custom" },               // PS5-ish
  { vendor: "Microsoft", renderer: "Xbox Series X GPU" },           // Xbox
];

const HARDWARE_CONCURRENCY = [1, 2, 4, 6, 8, 12, 16, 24, 32];
const DEVICE_MEMORY = [0.5, 1, 2, 4, 8, 16];

const TIMEZONES = [
  { zone: "America/New_York", offset: 300 },
  { zone: "America/Chicago", offset: 360 },
  { zone: "America/Los_Angeles", offset: 480 },
  { zone: "America/Sao_Paulo", offset: 180 },
  { zone: "Europe/London", offset: 0 },
  { zone: "Europe/Paris", offset: -60 },
  { zone: "Europe/Berlin", offset: -60 },
  { zone: "Europe/Moscow", offset: -180 },
  { zone: "Asia/Tokyo", offset: -540 },
  { zone: "Asia/Shanghai", offset: -480 },
  { zone: "Asia/Kolkata", offset: -330 },
  { zone: "Australia/Sydney", offset: -600 },
  { zone: "Pacific/Auckland", offset: -720 },
];

// Generate a complete coherent session profile
function generateProfile() {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const browser = pick(PROFILES);
  const lang = pick(LANGUAGES);
  const screen = pick(SCREENS);
  const webgl = pick(WEBGL_PROFILES);
  const tz = pick(TIMEZONES);

  // Taskbar height between 30-50px
  const taskbarHeight = 30 + Math.floor(Math.random() * 21);

  return {
    // Navigator
    userAgent: browser.userAgent,
    platform: browser.platform,
    vendor: browser.vendor,
    vendorSub: browser.vendorSub,
    product: browser.product,
    productSub: browser.productSub,
    buildID: browser.buildID,
    oscpu: browser.oscpu,
    appVersion: browser.appVersion,
    hardwareConcurrency: pick(HARDWARE_CONCURRENCY),
    deviceMemory: pick(DEVICE_MEMORY),
    doNotTrack: pick(["1", null, "unspecified"]),

    // Language
    language: lang.primary,
    languages: lang.js,
    acceptLanguage: lang.header,

    // Screen
    screenWidth: screen.width,
    screenHeight: screen.height,
    availWidth: screen.width,
    availHeight: screen.height - taskbarHeight,
    colorDepth: 24,

    // WebGL
    webglVendor: webgl.vendor,
    webglRenderer: webgl.renderer,

    // Timezone
    timezone: tz.zone,
    timezoneOffset: tz.offset,

    // Canvas noise seed (stable per session)
    canvasNoiseSeed: Math.random(),

    // Audio noise seed
    audioNoiseSeed: Math.random(),
  };
}
