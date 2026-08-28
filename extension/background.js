// Current session profile (generated on extension load or toggle)
let currentProfile = null;
let currentIdentity = null;
let enabled = false;

// Mailbox state
let mailbox = null; // { address, password, token, id }

// Settings
let settings = {
  forceEnglish: true,
  autoRenew: true,
  persist: false,
  historyEnabled: false,
};
let identityHistory = []; // last N identities
const MAX_HISTORY = 20;
let autoRenewTimer = null;

const MAIL_API = "https://api.mail.tm";

// Initialize state from storage
browser.storage.local.get({ enabled: false, profile: null, identity: null, mailbox: null, settings: null, identityHistory: [] }).then((data) => {
  enabled = data.enabled;
  if (data.settings) {
    settings = { ...settings, ...data.settings };
  }
  identityHistory = data.identityHistory || [];
  if (enabled && data.profile) {
    currentProfile = data.profile;
  } else if (enabled) {
    newSession();
  }
  if (data.identity) {
    currentIdentity = data.identity;
  }
  if (data.mailbox) {
    mailbox = data.mailbox;
  }
  if (settings.autoRenew && enabled) {
    startAutoRenew();
  }
});

function newSession() {
  currentProfile = generateProfile(settings);
  browser.storage.local.set({ profile: currentProfile });
}

function generateSecurePassword() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*_+-=?";
  const arr = new Uint8Array(23);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => chars[b % chars.length]).join("");
}

function startAutoRenew() {
  stopAutoRenew();
  autoRenewTimer = setInterval(() => {
    if (enabled) newSession();
  }, 60000);
}

function stopAutoRenew() {
  if (autoRenewTimer) {
    clearInterval(autoRenewTimer);
    autoRenewTimer = null;
  }
}

// Clear non-persistent data on browser startup if persist is off
if (!settings.persist) {
  browser.storage.local.remove(["profile", "identity", "mailbox", "identityHistory"]);
}

// --- Sidebar toggle via toolbar icon ---
browser.action.onClicked.addListener(() => {
  browser.sidebarAction.toggle();
});

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
    return (async () => {
      // Create a mailbox if none exists
      if (!mailbox) {
        try {
          const domainsRes = await fetch(`${MAIL_API}/domains`);
          const domainsData = await domainsRes.json();
          const domain = domainsData["hydra:member"]?.[0]?.domain;
          if (domain) {
            const rand = Math.random().toString(36).substring(2, 10);
            const address = `fridge_${rand}@${domain}`;
            const password = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
            const createRes = await fetch(`${MAIL_API}/accounts`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ address, password }),
            });
            if (createRes.ok) {
              const account = await createRes.json();
              const tokenRes = await fetch(`${MAIL_API}/token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address, password }),
              });
              if (tokenRes.ok) {
                const tokenData = await tokenRes.json();
                mailbox = { address, password, token: tokenData.token, id: account.id };
                browser.storage.local.set({ mailbox });
              }
            }
          }
        } catch (e) { /* continue without mailbox */ }
      }

      currentIdentity = generateIdentity();
      // Override email with real temp mail address
      if (mailbox) {
        currentIdentity.email = mailbox.address;
      }
      // Generate password
      currentIdentity.password = generateSecurePassword();
      browser.storage.local.set({ identity: currentIdentity });

      // Save to history if enabled
      if (settings.historyEnabled) {
        identityHistory.unshift({
          name: `${currentIdentity.firstName} ${currentIdentity.lastName}`,
          email: currentIdentity.email,
          password: currentIdentity.password,
          universe: currentIdentity.universe,
          date: new Date().toISOString(),
        });
        if (identityHistory.length > MAX_HISTORY) {
          identityHistory = identityHistory.slice(0, MAX_HISTORY);
        }
        browser.storage.local.set({ identityHistory });
      }

      return currentIdentity;
    })();
  }

  if (message.action === "getIdentity") {
    return Promise.resolve(currentIdentity);
  }

  if (message.action === "clearIdentity") {
    currentIdentity = null;
    browser.storage.local.remove("identity");
    return Promise.resolve({ success: true });
  }

  // --- Mailbox ---
  if (message.action === "createMailbox") {
    return (async () => {
      try {
        // Get available domains
        const domainsRes = await fetch(`${MAIL_API}/domains`);
        const domainsData = await domainsRes.json();
        const domain = domainsData["hydra:member"]?.[0]?.domain;
        if (!domain) throw new Error("No domains available");

        // Generate random address
        const rand = Math.random().toString(36).substring(2, 10);
        const address = `fridge_${rand}@${domain}`;
        const password = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

        // Create account
        const createRes = await fetch(`${MAIL_API}/accounts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, password }),
        });
        if (!createRes.ok) throw new Error(`Account creation failed: ${createRes.status}`);
        const account = await createRes.json();

        // Get auth token
        const tokenRes = await fetch(`${MAIL_API}/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, password }),
        });
        if (!tokenRes.ok) throw new Error(`Auth failed: ${tokenRes.status}`);
        const tokenData = await tokenRes.json();

        mailbox = {
          address,
          password,
          token: tokenData.token,
          id: account.id,
        };
        browser.storage.local.set({ mailbox });
        return { success: true, address };
      } catch (e) {
        return { success: false, error: e.message };
      }
    })();
  }

  if (message.action === "getMailbox") {
    return Promise.resolve(mailbox ? { success: true, address: mailbox.address } : { success: false });
  }

  if (message.action === "getMessages") {
    if (!mailbox) return Promise.resolve({ success: false, error: "No mailbox" });
    return (async () => {
      try {
        const res = await fetch(`${MAIL_API}/messages`, {
          headers: { Authorization: `Bearer ${mailbox.token}` },
        });
        if (res.status === 401) {
          // Token expired, re-authenticate
          const tokenRes = await fetch(`${MAIL_API}/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address: mailbox.address, password: mailbox.password }),
          });
          if (!tokenRes.ok) throw new Error("Re-auth failed");
          const tokenData = await tokenRes.json();
          mailbox.token = tokenData.token;
          browser.storage.local.set({ mailbox });
          // Retry
          const retry = await fetch(`${MAIL_API}/messages`, {
            headers: { Authorization: `Bearer ${mailbox.token}` },
          });
          const data = await retry.json();
          return { success: true, messages: data["hydra:member"] || [] };
        }
        const data = await res.json();
        return { success: true, messages: data["hydra:member"] || [] };
      } catch (e) {
        return { success: false, error: e.message };
      }
    })();
  }

  if (message.action === "getMessage") {
    if (!mailbox) return Promise.resolve({ success: false, error: "No mailbox" });
    return (async () => {
      try {
        const res = await fetch(`${MAIL_API}/messages/${message.id}`, {
          headers: { Authorization: `Bearer ${mailbox.token}` },
        });
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = await res.json();
        return { success: true, message: data };
      } catch (e) {
        return { success: false, error: e.message };
      }
    })();
  }

  if (message.action === "deleteMailbox") {
    if (!mailbox) return Promise.resolve({ success: true });
    return (async () => {
      try {
        await fetch(`${MAIL_API}/accounts/${mailbox.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${mailbox.token}` },
        });
      } catch (e) { /* ignore */ }
      mailbox = null;
      browser.storage.local.remove("mailbox");
      return { success: true };
    })();
  }

  // --- Settings ---
  if (message.action === "getSettings") {
    return Promise.resolve({ settings, identityHistory });
  }

  if (message.action === "updateSettings") {
    const prev = { ...settings };
    settings = { ...settings, ...message.settings };
    browser.storage.local.set({ settings });

    // Handle auto-renew toggle
    if (settings.autoRenew && enabled) {
      startAutoRenew();
    } else {
      stopAutoRenew();
    }

    // Handle persist toggle — if turned off, clear stored data
    if (prev.persist && !settings.persist) {
      browser.storage.local.remove(["profile", "identity", "mailbox", "identityHistory"]);
    }

    // Handle force-english: regenerate profile if enabled
    if (settings.forceEnglish !== prev.forceEnglish && enabled) {
      newSession();
    }

    return Promise.resolve({ success: true, profile: currentProfile });
  }

  if (message.action === "getHistory") {
    return Promise.resolve(identityHistory);
  }

  if (message.action === "clearHistory") {
    identityHistory = [];
    browser.storage.local.set({ identityHistory });
    return Promise.resolve({ success: true });
  }
});
