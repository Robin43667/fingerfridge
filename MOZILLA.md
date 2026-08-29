# FingerFridge — Mozilla Add-on Review Notes

## What does this extension do?

FingerFridge is an open-source anti-fingerprinting extension for Firefox. It protects users against browser fingerprinting by randomizing JavaScript API outputs that websites commonly use to build unique device profiles. It also provides disposable identities and temporary email addresses to help users protect their privacy online.

## Why is this extension useful?

Browser fingerprinting is a widespread tracking technique that works even without cookies. Major privacy organizations like the EFF ([Cover Your Tracks](https://coveryourtracks.eff.org)) have documented how websites combine dozens of browser properties to create a unique identifier for each visitor.

Several extensions already address individual fingerprinting vectors on AMO:
- **CanvasBlocker** (37,000+ users) — canvas and audio fingerprint protection
- **Canvas Fingerprint Defender** (1,000+ users) — canvas noise injection
- **WebGL Fingerprint Defender** (1,500+ users) — WebGL spoofing
- **Font Fingerprint Defender** (1,500+ users) — font enumeration protection
- **Fingerprint Defender** (500+ users) — multi-vector noise approach

FingerFridge combines all these protections into a single extension with a unified interface, so users don't need to install and manage multiple add-ons. It follows the same noise-injection approach proven by these established extensions rather than outright blocking APIs, which can break websites.

## How does it work?

The extension operates through two mechanisms:

1. **HTTP header modification** (`webRequest` / `webRequestBlocking`): Spoofs the User-Agent and Accept-Language headers to match the randomized profile. This is the same approach used by many privacy extensions on AMO.

2. **JavaScript API overrides** (`content_scripts` + `inject.js`): Injects a script into page context at `document_start` that overrides fingerprinting-related APIs with per-session randomized values. The script is fully bundled with the extension (not fetched remotely) and runs as an IIFE with `"use strict"`.

### Protected APIs

| Category | Technique | Approach |
|----------|-----------|----------|
| Canvas 2D | `toDataURL`, `toBlob`, `getImageData` | Per-session noise via seeded PRNG |
| WebGL | `getParameter` (vendor/renderer) | Reports randomized GPU strings |
| Audio | `getFloatFrequencyData`, `getByteFrequencyData`, `sampleRate` | Subtle noise injection |
| Navigator | `userAgent`, `platform`, `languages`, `hardwareConcurrency`, etc. | Randomized per session |
| Screen | `width`, `height`, `colorDepth`, `availWidth`, etc. | Spoofed to match profile |
| Timezone | `getTimezoneOffset`, `Intl.DateTimeFormat` | Randomized offset |
| Fonts | `offsetWidth`, `offsetHeight` | Small noise on probe-sized elements only |
| Permissions | `navigator.permissions.query` | Standardized responses |
| Media Devices | `navigator.mediaDevices.enumerateDevices` | Fixed device list |
| Media Formats | `HTMLMediaElement.canPlayType` | Standardized format support |
| Sensors | `Accelerometer`, `Gyroscope`, etc. | Removed from `window` |

All overrides use standard `Object.defineProperty` on prototypes. No `eval()`, no `Function()` constructor, no dynamic code generation.

## Permissions justification

| Permission | Reason |
|------------|--------|
| `storage` | Persist user settings, current profile, identity and mailbox state across sessions |
| `webRequest` | Intercept outgoing HTTP headers to spoof User-Agent and Accept-Language |
| `webRequestBlocking` | Required by Firefox to modify request headers synchronously |
| `<all_urls>` (host) | Fingerprint protection must apply to all websites |
| `content_scripts` (`<all_urls>`) | Inject the spoofing script into every page at `document_start` |
| `web_accessible_resources` (`inject.js`) | Allow the content script to load the page-context spoofing script |

No permissions are requested beyond what is strictly necessary. The extension does **not** request `tabs`, `history`, `bookmarks`, `downloads`, `notifications`, or any other unrelated permission.

## External connections

The extension makes **no external connections** for fingerprint spoofing. All spoofing logic runs entirely locally.

The only external connection is to the **[mail.tm](https://mail.tm) public API** (`https://api.mail.tm`), used exclusively for the optional temporary email feature. This connection:
- Only occurs when the user explicitly clicks "Generate Identity" or "Create Mailbox"
- Is never triggered automatically or in the background
- Creates a disposable mailbox on mail.tm's free public service
- Sends no user data, browsing history, or fingerprint information
- Can be ignored entirely — the anti-fingerprinting features work without it

## Data collection

**This extension collects no data whatsoever.**

- No telemetry, analytics, or crash reporting
- No data is sent to the developer or any third party
- No browsing history, URLs, or page content is accessed or stored
- All generated profiles and identities are stored locally in `browser.storage.local` and can be cleared by the user at any time
- The optional persistence setting is off by default — all data is cleared on browser restart unless the user explicitly enables persistence

## Code transparency

- All source code is unminified, unobfuscated, and thoroughly commented
- No external JavaScript libraries or dependencies
- No build step required — the extension runs exactly as written
- No CDN resources, remote scripts, or dynamically loaded code
- The `inject.js` file is bundled with the extension and loaded via `browser.runtime.getURL()`

## Safety

- The extension **does not modify page content** — it only alters API return values used for fingerprinting
- It **does not block any API** — all protected APIs remain functional and return plausible values
- It **does not interfere with website functionality** — noise injection is subtle and designed to prevent tracking without breaking sites
- It **cannot access or modify cookies, passwords, form data, or any user content**
- The `inject.js` script removes itself from the DOM immediately after loading (`script.onload = () => script.remove()`)

## Comparison with approved extensions

FingerFridge follows the same proven approach as extensions already approved and recommended on AMO:

| Feature | CanvasBlocker | Fingerprint Defender | FingerFridge |
|---------|:---:|:---:|:---:|
| Canvas noise | Yes | Yes | Yes |
| WebGL spoofing | No | No | Yes |
| Audio noise | Yes | Yes | Yes |
| Font protection | No | No | Yes |
| Navigator spoofing | Partial | No | Yes |
| Screen spoofing | No | Yes | Yes |
| Timezone spoofing | No | No | Yes |
| Header spoofing | No | No | Yes |
| AMO status | Recommended | Listed | Pending |

FingerFridge is essentially the combination of CanvasBlocker + Font Fingerprint Defender + WebGL Fingerprint Defender + additional protections, packaged as a single user-friendly extension with a sidebar UI.
