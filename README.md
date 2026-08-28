# FingerFridge

A Firefox extension that protects users against browser fingerprinting from websites with morally questionable tracking practices. It also provides temporary email addresses and disposable identities to safeguard privacy online.

## Features

### Anti-Fingerprinting

Each session generates a randomized browser profile that spoofs:

- **HTTP Headers** — User-Agent, Accept-Language, Referer
- **Navigator properties** — platform, vendor, buildID, languages, hardwareConcurrency, deviceMemory, plugins, doNotTrack
- **Canvas** — injects subtle per-session noise into toDataURL / toBlob / getImageData
- **WebGL** — spoofs GPU vendor and renderer
- **Audio** — noise in frequency data, spoofed sampleRate
- **Screen** — resolution, availWidth/Height, colorDepth, outerWidth/Height
- **Timezone** — getTimezoneOffset and Intl.DateTimeFormat
- **Fonts** — noise on offsetWidth/Height to disrupt font probing
- **Permissions API** — standardized responses
- **MediaDevices** — fixed device enumeration
- **Media formats** — standardized canPlayType responses
- **Sensors** — removed (Accelerometer, Gyroscope, etc.)

### Fun Profiles

Includes realistic profiles (Chrome/Firefox on Windows/macOS/Linux) as well as intentionally absurd ones to confuse fingerprinters:

- Windows and Linux running Safari
- PlayStation 4 & 5, Xbox Series X
- Nintendo Switch & 3DS
- Samsung Smart TV, LG Smart TV
- Samsung Smart Fridge (FamilyHub)
- Tesla car browser
- Kindle e-reader
- Raspberry Pi
- Windows XP with Chrome 49
- FreeBSD

### Temporary Identity (coming soon)

- Disposable email address generation
- Random identity generation (name, address, etc.)

## Installation

### Development (temporary)

1. Open Firefox and go to `about:debugging`
2. Click **This Firefox**
3. Click **Load Temporary Add-on...**
4. Select `extension/manifest.json`

### Permanent (self-signed, unlisted)

1. Create an account on [addons.mozilla.org](https://addons.mozilla.org)
2. Get your API keys (JWT issuer + secret) from the developer settings
3. Sign the extension:
   ```bash
   npm install -g web-ext
   cd extension/
   web-ext sign --api-key=YOUR_JWT_ISSUER --api-secret=YOUR_JWT_SECRET --channel=unlisted
   ```
4. Install the generated `.xpi` file in Firefox

## Usage

1. Click the FingerFridge icon in the toolbar
2. Press the button to toggle protection (Yes/No)
3. Click **New Identity** to generate a fresh profile
4. Click **details** to see all spoofed values

## Project Structure

```
extension/
├── manifest.json       Permissions and extension config (Manifest V3)
├── profiles.js         Browser profile data (UA, languages, screens, GPUs)
├── background.js       HTTP header interception and session management
├── content.js          Injects spoofing script into page context
├── inject.js           JS API overrides (navigator, canvas, WebGL, audio, etc.)
├── icons/
│   ├── icon-48.png
│   └── icon-96.png
└── popup/
    ├── popup.html
    ├── popup.css
    └── popup.js
```

## Testing

Visit these sites with the extension enabled to verify fingerprint spoofing:

- [amiunique.org](https://amiunique.org)
- [browserleaks.com](https://browserleaks.com)
- [coveryourtracks.eff.org](https://coveryourtracks.eff.org)
