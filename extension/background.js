// Current session profile (generated on extension load or toggle)
let currentProfile = null;
let currentIdentity = null;
let enabled = false;

// Initialize state from storage
browser.storage.local.get({ enabled: false, profile: null, identity: null }).then((data) => {
  enabled = data.enabled;
  if (enabled && data.profile) {
    currentProfile = data.profile;
  } else if (enabled) {
    newSession();
  }
  if (data.identity) {
    currentIdentity = data.identity;
  }
});

function newSession() {
  currentProfile = generateProfile();
  browser.storage.local.set({ profile: currentProfile });
}

// --- HTTP Header interception ---
browser.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (!enabled || !currentProfile) return;

    const headers = details.requestHeaders;
    for (const header of headers) {
      const name = header.name.toLowerCase();
      if (name === "user-agent") {
        header.value = currentProfile.userAgent;
      } else if (name === "accept-language") {
        header.value = currentProfile.acceptLanguage;
      } else if (name === "referer") {
        // Replace referer with just the origin of the target URL
        try {
          const url = new URL(details.url);
          header.value = url.origin + "/";
        } catch (e) {
          // keep original
        }
      }
    }
    return { requestHeaders: headers };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);

// --- Messaging ---
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getStatus") {
    return Promise.resolve({ enabled, profile: currentProfile });
  }

  if (message.action === "toggle") {
    enabled = !enabled;
    if (enabled) {
      newSession();
    } else {
      currentProfile = null;
    }
    browser.storage.local.set({ enabled, profile: currentProfile });
    return Promise.resolve({ enabled, profile: currentProfile });
  }

  if (message.action === "newSession") {
    if (enabled) {
      newSession();
    }
    return Promise.resolve({ enabled, profile: currentProfile });
  }

  if (message.action === "getProfile") {
    return Promise.resolve(currentProfile);
  }

  if (message.action === "generateIdentity") {
    currentIdentity = generateIdentity();
    browser.storage.local.set({ identity: currentIdentity });
    return Promise.resolve(currentIdentity);
  }

  if (message.action === "getIdentity") {
    return Promise.resolve(currentIdentity);
  }
});
