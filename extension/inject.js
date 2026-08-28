// FingerFridge — Page-level fingerprint spoofing
// This script runs in the page context (not content script sandbox)

(function () {
  "use strict";

  // Read profile from the script tag's data attribute
  const scriptTag = document.currentScript;
  if (!scriptTag) return;
  const profile = JSON.parse(scriptTag.getAttribute("data-profile"));
  if (!profile) return;

  // =========================================================================
  // 1. NAVIGATOR PROPERTIES
  // =========================================================================

  const navProps = {
    userAgent: profile.userAgent,
    platform: profile.platform,
    vendor: profile.vendor,
    vendorSub: profile.vendorSub,
    product: profile.product,
    productSub: profile.productSub,
    appVersion: profile.appVersion,
    language: profile.language,
    languages: Object.freeze([...profile.languages]),
    hardwareConcurrency: profile.hardwareConcurrency,
    deviceMemory: profile.deviceMemory,
    doNotTrack: profile.doNotTrack,
  };

  if (profile.buildID !== undefined && profile.buildID !== "") {
    navProps.buildID = profile.buildID;
  }
  if (profile.oscpu !== undefined) {
    navProps.oscpu = profile.oscpu;
  }

  for (const [prop, value] of Object.entries(navProps)) {
    try {
      Object.defineProperty(Navigator.prototype, prop, {
        get: () => value,
        configurable: true,
        enumerable: true,
      });
    } catch (e) {
      // Some properties may not be overridable
    }
  }

  // navigator.javaEnabled() → always false
  try {
    Navigator.prototype.javaEnabled = function () { return false; };
  } catch (e) {}

  // navigator.plugins — return standard 5-plugin PDF list (like Chrome)
  try {
    const fakePlugins = {
      length: 5,
      0: { name: "PDF Viewer", description: "Portable Document Format", filename: "internal-pdf-viewer" },
      1: { name: "Chrome PDF Viewer", description: "Portable Document Format", filename: "internal-pdf-viewer" },
      2: { name: "Chromium PDF Viewer", description: "Portable Document Format", filename: "internal-pdf-viewer" },
      3: { name: "Microsoft Edge PDF Viewer", description: "Portable Document Format", filename: "internal-pdf-viewer" },
      4: { name: "WebKit built-in PDF", description: "Portable Document Format", filename: "internal-pdf-viewer" },
      item: function (i) { return this[i] || null; },
      namedItem: function (name) {
        for (let i = 0; i < this.length; i++) {
          if (this[i].name === name) return this[i];
        }
        return null;
      },
      refresh: function () {},
      [Symbol.iterator]: function* () {
        for (let i = 0; i < this.length; i++) yield this[i];
      },
    };
    Object.defineProperty(Navigator.prototype, "plugins", {
      get: () => fakePlugins,
      configurable: true,
      enumerable: true,
    });
  } catch (e) {}

  // navigator.connection → undefined (Firefox doesn't support it)
  try {
    Object.defineProperty(Navigator.prototype, "connection", {
      get: () => undefined,
      configurable: true,
    });
  } catch (e) {}

  // navigator.getBattery → undefined
  try {
    delete Navigator.prototype.getBattery;
  } catch (e) {}

  // navigator.keyboard → undefined
  try {
    Object.defineProperty(Navigator.prototype, "keyboard", {
      get: () => undefined,
      configurable: true,
    });
  } catch (e) {}

  // =========================================================================
  // 2. SCREEN PROPERTIES
  // =========================================================================

  const screenProps = {
    width: profile.screenWidth,
    height: profile.screenHeight,
    availWidth: profile.availWidth,
    availHeight: profile.availHeight,
    colorDepth: profile.colorDepth,
    pixelDepth: profile.colorDepth,
  };

  for (const [prop, value] of Object.entries(screenProps)) {
    try {
      Object.defineProperty(Screen.prototype, prop, {
        get: () => value,
        configurable: true,
        enumerable: true,
      });
    } catch (e) {}
  }

  // window.screenX, screenY, screenLeft, screenTop → 0
  for (const prop of ["screenX", "screenY", "screenLeft", "screenTop"]) {
    try {
      Object.defineProperty(window, prop, {
        get: () => 0,
        configurable: true,
        enumerable: true,
      });
    } catch (e) {}
  }

  // window.outerWidth / outerHeight
  try {
    Object.defineProperty(window, "outerWidth", {
      get: () => profile.screenWidth,
      configurable: true,
    });
    Object.defineProperty(window, "outerHeight", {
      get: () => profile.availHeight,
      configurable: true,
    });
  } catch (e) {}

  // Toolbar bars — all visible
  for (const bar of ["toolbar", "menubar", "personalbar", "statusbar", "locationbar"]) {
    try {
      Object.defineProperty(window, bar, {
        get: () => ({ visible: true }),
        configurable: true,
      });
    } catch (e) {}
  }

  // =========================================================================
  // 3. CANVAS FINGERPRINTING
  // =========================================================================

  // Seeded PRNG for consistent noise within a session
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  const canvasRng = mulberry32(Math.floor(profile.canvasNoiseSeed * 2147483647));

  function addCanvasNoise(canvas) {
    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      // Add subtle noise to a few pixels
      const pixelsToModify = Math.max(1, Math.floor(data.length / 400));
      for (let i = 0; i < pixelsToModify; i++) {
        const idx = Math.floor(canvasRng() * (data.length / 4)) * 4;
        data[idx] = (data[idx] + Math.floor(canvasRng() * 3) - 1 + 256) % 256;     // R
        data[idx + 1] = (data[idx + 1] + Math.floor(canvasRng() * 3) - 1 + 256) % 256; // G
      }
      ctx.putImageData(imageData, 0, 0);
    } catch (e) {}
  }

  const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function (...args) {
    addCanvasNoise(this);
    return origToDataURL.apply(this, args);
  };

  const origToBlob = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (...args) {
    addCanvasNoise(this);
    return origToBlob.apply(this, args);
  };

  const origGetImageData = CanvasRenderingContext2D.prototype.getImageData;
  CanvasRenderingContext2D.prototype.getImageData = function (...args) {
    const imageData = origGetImageData.apply(this, args);
    const data = imageData.data;
    const pixelsToModify = Math.max(1, Math.floor(data.length / 400));
    for (let i = 0; i < pixelsToModify; i++) {
      const idx = Math.floor(canvasRng() * (data.length / 4)) * 4;
      data[idx] = (data[idx] + Math.floor(canvasRng() * 3) - 1 + 256) % 256;
    }
    return imageData;
  };

  // =========================================================================
  // 4. WEBGL FINGERPRINTING
  // =========================================================================

  const UNMASKED_VENDOR = 0x9245;   // UNMASKED_VENDOR_WEBGL
  const UNMASKED_RENDERER = 0x9246; // UNMASKED_RENDERER_WEBGL

  function patchWebGL(proto) {
    const origGetParameter = proto.getParameter;
    proto.getParameter = function (pname) {
      if (pname === UNMASKED_VENDOR) return profile.webglVendor;
      if (pname === UNMASKED_RENDERER) return profile.webglRenderer;
      return origGetParameter.call(this, pname);
    };

    const origGetExtension = proto.getExtension;
    proto.getExtension = function (name) {
      // Allow debug extension so getParameter works for unmasked values
      return origGetExtension.call(this, name);
    };
  }

  try { patchWebGL(WebGLRenderingContext.prototype); } catch (e) {}
  try { patchWebGL(WebGL2RenderingContext.prototype); } catch (e) {}

  // =========================================================================
  // 5. AUDIO FINGERPRINTING
  // =========================================================================

  const audioRng = mulberry32(Math.floor(profile.audioNoiseSeed * 2147483647));

  try {
    const origGetFloatFreq = AnalyserNode.prototype.getFloatFrequencyData;
    AnalyserNode.prototype.getFloatFrequencyData = function (array) {
      origGetFloatFreq.call(this, array);
      for (let i = 0; i < array.length; i += 10) {
        array[i] += (audioRng() - 0.5) * 0.001;
      }
    };
  } catch (e) {}

  try {
    const origGetByteFreq = AnalyserNode.prototype.getByteFrequencyData;
    AnalyserNode.prototype.getByteFrequencyData = function (array) {
      origGetByteFreq.call(this, array);
      for (let i = 0; i < array.length; i += 10) {
        array[i] = Math.max(0, Math.min(255, array[i] + Math.floor(audioRng() * 3) - 1));
      }
    };
  } catch (e) {}

  // Override AudioContext.sampleRate
  try {
    const origAudioContext = window.AudioContext || window.webkitAudioContext;
    if (origAudioContext) {
      const origProto = origAudioContext.prototype;
      const sampleRates = [44100, 48000];
      const fakeSampleRate = sampleRates[Math.floor(audioRng() * sampleRates.length)];

      Object.defineProperty(origProto, "sampleRate", {
        get: function () { return fakeSampleRate; },
        configurable: true,
      });
    }
  } catch (e) {}

  // =========================================================================
  // 6. TIMEZONE
  // =========================================================================

  try {
    const origDateGetTimezoneOffset = Date.prototype.getTimezoneOffset;
    Date.prototype.getTimezoneOffset = function () {
      return profile.timezoneOffset;
    };
  } catch (e) {}

  try {
    const origResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
    Intl.DateTimeFormat.prototype.resolvedOptions = function () {
      const result = origResolvedOptions.call(this);
      result.timeZone = profile.timezone;
      return result;
    };
  } catch (e) {}

  // =========================================================================
  // 7. FONTS — subtle offsetWidth/offsetHeight noise for font probing
  // =========================================================================

  const fontRng = mulberry32(Math.floor(profile.canvasNoiseSeed * 1073741823));

  try {
    const origOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
    const origOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight");

    if (origOffsetWidth && origOffsetWidth.get) {
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        get: function () {
          const val = origOffsetWidth.get.call(this);
          // Only add noise for very small or hidden elements (likely font probing)
          if (this.offsetParent === null || (val > 0 && val < 50)) {
            return val + (fontRng() > 0.5 ? 1 : 0);
          }
          return val;
        },
        configurable: true,
      });
    }

    if (origOffsetHeight && origOffsetHeight.get) {
      Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
        get: function () {
          const val = origOffsetHeight.get.call(this);
          if (this.offsetParent === null || (val > 0 && val < 50)) {
            return val + (fontRng() > 0.5 ? 1 : 0);
          }
          return val;
        },
        configurable: true,
      });
    }
  } catch (e) {}

  // =========================================================================
  // 8. PERMISSIONS API
  // =========================================================================

  try {
    const standardPermissions = {
      camera: "prompt",
      microphone: "prompt",
      geolocation: "prompt",
      notifications: "prompt",
      "persistent-storage": "prompt",
      push: "prompt",
      "midi": "prompt",
      "clipboard-read": "prompt",
      "clipboard-write": "granted",
    };

    const origQuery = Permissions.prototype.query;
    Permissions.prototype.query = function (desc) {
      const name = desc && desc.name;
      if (name && name in standardPermissions) {
        return Promise.resolve({
          state: standardPermissions[name],
          status: standardPermissions[name],
          onchange: null,
          addEventListener: function () {},
          removeEventListener: function () {},
          dispatchEvent: function () { return true; },
        });
      }
      return origQuery.call(this, desc);
    };
  } catch (e) {}

  // =========================================================================
  // 9. MEDIA DEVICES
  // =========================================================================

  try {
    const origEnumerateDevices = MediaDevices.prototype.enumerateDevices;
    MediaDevices.prototype.enumerateDevices = function () {
      return Promise.resolve([
        { deviceId: "", kind: "audioinput", label: "", groupId: "" },
        { deviceId: "", kind: "videoinput", label: "", groupId: "" },
      ]);
    };
  } catch (e) {}

  // =========================================================================
  // 10. MEDIA FORMATS — standardize to common set
  // =========================================================================

  try {
    const standardAudio = {
      "audio/aac": "maybe",
      "audio/flac": "probably",
      "audio/mpeg": "probably",
      'audio/ogg; codecs="vorbis"': "probably",
      'audio/ogg; codecs="opus"': "probably",
      'audio/ogg; codecs="flac"': "probably",
      'audio/wav; codecs="1"': "probably",
      'audio/webm; codecs="vorbis"': "probably",
      'audio/webm; codecs="opus"': "probably",
      'audio/mp4; codecs="mp4a.40.2"': "probably",
    };

    const standardVideo = {
      'video/mp4; codecs="flac"': "probably",
      'video/webm; codecs="vp9, opus"': "probably",
      'video/webm; codecs="vp8, vorbis"': "probably",
    };

    const origCanPlayType = HTMLMediaElement.prototype.canPlayType;
    HTMLMediaElement.prototype.canPlayType = function (type) {
      if (type in standardAudio) return standardAudio[type];
      if (type in standardVideo) return standardVideo[type];
      return origCanPlayType.call(this, type);
    };
  } catch (e) {}

  // =========================================================================
  // 11. SENSORS — report as not supported
  // =========================================================================

  for (const sensor of ["Accelerometer", "Gyroscope", "LinearAccelerationSensor", "AbsoluteOrientationSensor", "RelativeOrientationSensor", "ProximitySensor"]) {
    try {
      if (window[sensor]) {
        delete window[sensor];
      }
    } catch (e) {}
  }

})();
