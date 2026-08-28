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

### Fake Identity

Generate disposable identities with fictional characters from movies, anime, games and memes:

- **Name** — random fictional character with universe tag (e.g. "Gandalf Leblanc" from Lord of the Rings)
- **Email** — linked to a real temporary mailbox (see Temp Mail below)
- **Address & City** — humorous fictional locations (e.g. "Poudlard-sur-Mer", "Tatooine-les-Bains")
- **Phone & Zip** — randomly generated
- **Password** — 23-character cryptographically secure password with a regenerate button

### Temp Mail

Built-in disposable email powered by the mail.tm API:

- Auto-created when generating a fake identity
- Full inbox with sender, subject, date and unread indicators
- Read HTML emails rendered in a sandboxed iframe
- Copy address to clipboard with one click
- Refresh inbox and delete mailbox
- Automatic re-authentication on token expiry

### Settings

- **Force English language** — restrict fingerprint language to English variants (enabled by default)
- **Auto-renew every minute** — automatically regenerate fingerprint on a 60-second cycle with visual countdown bar (enabled by default)
- **Persist data on close** — keep or discard fingerprint, identity and mailbox data when the browser closes
- **Identity history** — log of recent identities with name, email, password and timestamp (up to 20 entries)

### UI

- Persistent sidebar panel (stays open while browsing)
- Toggle button with animated Yes/No state
- Quick-action buttons: reload all (fingerprint + identity + mail) and clear identity/mail
- Three color-coded sections: green (fingerprint), purple (fake ID), cyan (temp mail)
- Copy any value to clipboard by clicking on it
- Show more / hide toggles for detailed info
- Settings page with custom toggle switches

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

1. Click the FingerFridge icon in the toolbar to open the sidebar
2. Press the button to toggle protection (Yes/No)
3. Use the reload button to regenerate everything, or the clear button to remove identity and mail
4. Click **Generate** to create a fake identity with a real temp mailbox
5. Click **Create Mailbox** to add a temp email independently
6. Open the settings via the gear icon to configure auto-renew, language, persistence and history

## Project Structure

```
extension/
├── manifest.json       Permissions and extension config (Manifest V3)
├── profiles.js         Browser profile data (UA, languages, screens, GPUs)
├── identities.js       Fictional character database and identity generator
├── background.js       Session management, mail API, settings and history
├── content.js          Injects spoofing script into page context
├── inject.js           JS API overrides (navigator, canvas, WebGL, audio, etc.)
├── icons/
│   ├── icon-48.png
│   ├── icon-96.png
│   └── logo.png
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
