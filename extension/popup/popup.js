const btn = document.getElementById("toggle-btn");
const profileInfo = document.getElementById("profile-info");
const newSessionBtn = document.getElementById("new-session-btn");
const detailsToggle = document.getElementById("details-toggle");
const fullDetails = document.getElementById("full-details");
const reloadAllBtn = document.getElementById("reload-all-btn");
const clearAllBtn = document.getElementById("clear-all-btn");

function updateUI({ enabled, profile }) {
  btn.textContent = enabled ? "Yes" : "No";
  btn.className = enabled ? "btn on" : "btn off";

  reloadAllBtn.classList.toggle("hidden", !enabled);
  clearAllBtn.classList.toggle("hidden", !enabled);

  if (enabled && profile) {
    profileInfo.classList.remove("hidden");
    newSessionBtn.classList.remove("hidden");

    // Extract short browser name from UA
    let shortUA = profile.userAgent;
    if (shortUA.includes("Safari/") && !shortUA.includes("Chrome/") && !shortUA.includes("Firefox/")) {
      shortUA = "Safari " + (shortUA.match(/Version\/([\d.]+)/)?.[1] || "");
    } else if (shortUA.includes("Chrome/")) {
      shortUA = "Chrome " + shortUA.match(/Chrome\/([\d.]+)/)?.[1];
    } else if (shortUA.includes("Firefox/")) {
      shortUA = "Firefox " + shortUA.match(/Firefox\/([\d.]+)/)?.[1];
    } else if (shortUA.includes("PlayStation")) {
      shortUA = shortUA;
    } else if (shortUA.includes("Nintendo")) {
      shortUA = shortUA.match(/Nintendo \w+/)?.[0] || shortUA;
    }

    let shortPlatform = profile.platform;
    shortUA = `${shortPlatform} / ${shortUA}`;

    // Summary fields
    document.getElementById("info-ua").textContent = shortUA;
    document.getElementById("info-lang").textContent = profile.language;
    document.getElementById("info-screen").textContent = `${profile.screenWidth}x${profile.screenHeight}`;
    document.getElementById("info-gpu").textContent = profile.webglRenderer.replace(/ANGLE \(.*?, /, "").replace(/ Direct3D.*/, "");
    document.getElementById("info-tz").textContent = profile.timezone;
    document.getElementById("info-cores").textContent = `${profile.hardwareConcurrency} cores / ${profile.deviceMemory}GB RAM`;

    // Full detail fields
    document.getElementById("info-platform").textContent = profile.platform;
    document.getElementById("info-vendor").textContent = profile.vendor || "(empty)";
    document.getElementById("info-product").textContent = `${profile.product} / ${profile.productSub}`;
    document.getElementById("info-buildid").textContent = profile.buildID || "(empty)";
    document.getElementById("info-dnt").textContent = profile.doNotTrack === null ? "null" : profile.doNotTrack;
    document.getElementById("info-devmem").textContent = profile.deviceMemory ? `${profile.deviceMemory} GB` : "undefined";
    document.getElementById("info-languages").textContent = profile.languages.join(", ");
    document.getElementById("info-avail").textContent = `${profile.availWidth}x${profile.availHeight}`;
    document.getElementById("info-depth").textContent = `${profile.colorDepth} bits`;
    document.getElementById("info-glvendor").textContent = profile.webglVendor;
    document.getElementById("info-glrender").textContent = profile.webglRenderer;
    document.getElementById("info-tzoffset").textContent = `UTC${profile.timezoneOffset <= 0 ? "+" : "-"}${String(Math.abs(Math.floor(profile.timezoneOffset / 60))).padStart(2, "0")}:${String(Math.abs(profile.timezoneOffset % 60)).padStart(2, "0")}`;
    document.getElementById("info-acceptlang").textContent = profile.acceptLanguage;
    document.getElementById("info-canvas").textContent = `noise seed: ${profile.canvasNoiseSeed.toFixed(6)}`;
    document.getElementById("info-audio").textContent = `noise seed: ${profile.audioNoiseSeed.toFixed(6)}`;
  } else {
    profileInfo.classList.add("hidden");
    newSessionBtn.classList.add("hidden");
    fullDetails.classList.add("hidden");
  }
}

// Init
browser.runtime.sendMessage({ action: "getStatus" }).then(updateUI);

// Toggle protection
btn.addEventListener("click", () => {
  const willEnable = btn.classList.contains("off");
  btn.classList.remove("anim-on", "anim-off");
  void btn.offsetWidth;
  btn.classList.add(willEnable ? "anim-on" : "anim-off");
  browser.runtime.sendMessage({ action: "toggle" }).then(updateUI);
});

// New session
newSessionBtn.addEventListener("click", () => {
  browser.runtime.sendMessage({ action: "newSession" }).then(updateUI);
});

// Reload all: refresh fingerprint, and identity+mail only if they exist
reloadAllBtn.addEventListener("click", async () => {
  reloadAllBtn.classList.remove("spinning");
  void reloadAllBtn.offsetWidth;
  reloadAllBtn.classList.add("spinning");
  // New fingerprint
  const status = await browser.runtime.sendMessage({ action: "newSession" });
  updateUI(status);
  // Only refresh identity + mail if a fake ID is already generated
  if (!identityInfo.classList.contains("hidden")) {
    await browser.runtime.sendMessage({ action: "deleteMailbox" });
    const identity = await browser.runtime.sendMessage({ action: "generateIdentity" });
    updateIdentityUI(identity);
    const mailRes = await browser.runtime.sendMessage({ action: "getMailbox" });
    if (mailRes.success) {
      showMailbox(mailRes.address);
      refreshMessages();
    }
  }
});

// Clear all: remove identity + mailbox, keep fingerprint
clearAllBtn.addEventListener("click", async () => {
  clearAllBtn.classList.remove("shrinking");
  void clearAllBtn.offsetWidth;
  clearAllBtn.classList.add("shrinking");
  await browser.runtime.sendMessage({ action: "deleteMailbox" });
  await browser.runtime.sendMessage({ action: "clearIdentity" });
  currentIdentity = null;
  updateIdentityUI(null);
  hideMailbox();
});

// Expand/collapse fingerprint details
detailsToggle.addEventListener("click", () => {
  const isHidden = fullDetails.classList.toggle("hidden");
  detailsToggle.textContent = isHidden ? "show more" : "hide";
});

// --- Fake Identity ---
const genIdentityBtn = document.getElementById("gen-identity-btn");
const identityInfo = document.getElementById("identity-info");
const idDetailsToggle = document.getElementById("id-details-toggle");
const idFullDetails = document.getElementById("id-full-details");
const mailSection = document.getElementById("mail-section");
const passwordEl = document.getElementById("id-password");
const regenPasswordBtn = document.getElementById("regen-password-btn");

function generatePassword() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*_+-=?";
  const arr = new Uint8Array(23);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => chars[b % chars.length]).join("");
}

function updateIdentityUI(identity) {
  if (!identity) {
    identityInfo.classList.add("hidden");
    mailSection.classList.add("hidden");
    return;
  }
  identityInfo.classList.remove("hidden");
  mailSection.classList.remove("hidden");
  document.getElementById("id-name").textContent = `${identity.firstName} ${identity.lastName}`;
  document.getElementById("id-universe").textContent = `(${identity.universe})`;
  document.getElementById("id-email").textContent = identity.email;
  document.getElementById("id-phone").textContent = identity.phone;
  document.getElementById("id-address").textContent = identity.street;
  document.getElementById("id-city").textContent = identity.city;
  document.getElementById("id-zip").textContent = identity.zip;
  passwordEl.textContent = identity.password || generatePassword();
}

regenPasswordBtn.addEventListener("click", () => {
  passwordEl.textContent = generatePassword();
  regenPasswordBtn.classList.remove("spinning");
  void regenPasswordBtn.offsetWidth; // force reflow
  regenPasswordBtn.classList.add("spinning");
});

// Expand/collapse identity details
idDetailsToggle.addEventListener("click", () => {
  const isHidden = idFullDetails.classList.toggle("hidden");
  idDetailsToggle.textContent = isHidden ? "show more" : "hide";
});

genIdentityBtn.addEventListener("click", async () => {
  const identity = await browser.runtime.sendMessage({ action: "generateIdentity" });
  updateIdentityUI(identity);
  // Sync mailbox UI — a mailbox may have been auto-created
  const mailRes = await browser.runtime.sendMessage({ action: "getMailbox" });
  if (mailRes.success) {
    showMailbox(mailRes.address);
    refreshMessages();
  }
});

// Load saved identity on popup open
browser.runtime.sendMessage({ action: "getIdentity" }).then((identity) => {
  if (identity) updateIdentityUI(identity);
});

// Copy to clipboard on click (shared handler)
document.addEventListener("click", (e) => {
  const target = e.target.closest(".copiable");
  if (!target) return;
  navigator.clipboard.writeText(target.textContent).then(() => {
    target.classList.add("copied");
    const original = target.textContent;
    target.textContent = "copied!";
    setTimeout(() => {
      target.textContent = original;
      target.classList.remove("copied");
    }, 800);
  });
});

// --- Temp Mail ---
const createMailBtn = document.getElementById("create-mail-btn");
const mailNoBox = document.getElementById("mail-no-box");
const mailBox = document.getElementById("mail-box");
const mailAddress = document.getElementById("mail-address");
const mailRefreshBtn = document.getElementById("mail-refresh-btn");
const mailDeleteBtn = document.getElementById("mail-delete-btn");
const mailInbox = document.getElementById("mail-inbox");
const mailEmpty = document.getElementById("mail-empty");
const mailList = document.getElementById("mail-list");
const mailView = document.getElementById("mail-view");
const mailBackBtn = document.getElementById("mail-back-btn");
const mailViewFrom = document.getElementById("mail-view-from");
const mailViewSubject = document.getElementById("mail-view-subject");
const mailViewDate = document.getElementById("mail-view-date");
const mailViewBody = document.getElementById("mail-view-body");
const mailLoading = document.getElementById("mail-loading");
const mailError = document.getElementById("mail-error");

function showMailLoading(show) {
  mailLoading.classList.toggle("hidden", !show);
}

function showMailError(msg) {
  if (msg) {
    mailError.textContent = msg;
    mailError.classList.remove("hidden");
  } else {
    mailError.classList.add("hidden");
  }
}

function showMailbox(address) {
  mailNoBox.classList.add("hidden");
  mailBox.classList.remove("hidden");
  mailAddress.textContent = address;
}

function hideMailbox() {
  mailNoBox.classList.remove("hidden");
  mailBox.classList.add("hidden");
  mailView.classList.add("hidden");
  mailList.innerHTML = "";
  mailEmpty.style.display = "";
}

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function renderMessages(messages) {
  mailList.innerHTML = "";
  if (!messages || messages.length === 0) {
    mailEmpty.style.display = "";
    return;
  }
  mailEmpty.style.display = "none";
  for (const msg of messages) {
    const item = document.createElement("div");
    item.className = `mail-item${msg.seen ? "" : " unread"}`;
    item.dataset.id = msg.id;
    const from = document.createElement("span");
    from.className = "mail-item-from";
    from.textContent = msg.from?.address || "unknown";
    const subject = document.createElement("span");
    subject.className = "mail-item-subject";
    subject.textContent = msg.subject || "(no subject)";
    const date = document.createElement("span");
    date.className = "mail-item-date";
    date.textContent = formatDate(msg.createdAt);
    item.append(from, subject, date);
    item.addEventListener("click", () => openMessage(msg.id));
    mailList.appendChild(item);
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function openMessage(id) {
  showMailLoading(true);
  showMailError(null);
  const res = await browser.runtime.sendMessage({ action: "getMessage", id });
  showMailLoading(false);
  if (!res.success) {
    showMailError(res.error);
    return;
  }
  const msg = res.message;
  mailInbox.classList.add("hidden");
  mailView.classList.remove("hidden");
  mailViewFrom.textContent = msg.from?.address || "unknown";
  mailViewSubject.textContent = msg.subject || "(no subject)";
  mailViewDate.textContent = formatDate(msg.createdAt);

  // Get HTML content (mail.tm returns html as array or string)
  let html = msg.html;
  if (Array.isArray(html)) html = html.join("");

  if (html && html.length > 0) {
    // Sanitize: strip scripts, keep basic formatting
    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/on\w+="[^"]*"/gi, "")
      .replace(/on\w+='[^']*'/gi, "");
    // Use iframe for proper HTML email rendering
    mailViewBody.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.sandbox = "allow-same-origin";
    iframe.style.cssText = "width:100%;border:none;background:#fff;";
    mailViewBody.appendChild(iframe);
    const blob = new Blob([cleaned], { type: "text/html" });
    iframe.src = URL.createObjectURL(blob);
    // Auto-resize iframe to fit content
    const resize = () => {
      iframe.style.height = iframe.contentDocument.body.scrollHeight + "px";
    };
    iframe.onload = resize;
    setTimeout(resize, 200);
  } else {
    mailViewBody.textContent = msg.text || "(empty)";
  }
}

async function refreshMessages() {
  showMailLoading(true);
  showMailError(null);
  const res = await browser.runtime.sendMessage({ action: "getMessages" });
  showMailLoading(false);
  if (!res.success) {
    showMailError(res.error);
    return;
  }
  renderMessages(res.messages);
}

// Create mailbox
createMailBtn.addEventListener("click", async () => {
  showMailLoading(true);
  showMailError(null);
  const res = await browser.runtime.sendMessage({ action: "createMailbox" });
  showMailLoading(false);
  if (res.success) {
    showMailbox(res.address);
    refreshMessages();
    // Update email in fake ID section
    const emailEl = document.getElementById("id-email");
    if (emailEl && identityInfo.classList.contains("hidden") === false) {
      emailEl.textContent = res.address;
    }
  } else {
    showMailError(res.error);
  }
});

// Refresh
mailRefreshBtn.addEventListener("click", () => {
  mailView.classList.add("hidden");
  mailInbox.classList.remove("hidden");
  refreshMessages();
});

// Back from message view
mailBackBtn.addEventListener("click", () => {
  mailView.classList.add("hidden");
  mailInbox.classList.remove("hidden");
  refreshMessages();
});

// Delete mailbox
mailDeleteBtn.addEventListener("click", async () => {
  showMailLoading(true);
  await browser.runtime.sendMessage({ action: "deleteMailbox" });
  showMailLoading(false);
  hideMailbox();
});

// Load existing mailbox on popup open
browser.runtime.sendMessage({ action: "getMailbox" }).then((res) => {
  if (res.success) {
    showMailbox(res.address);
    refreshMessages();
  }
});

// --- Settings ---
const settingsBtn = document.getElementById("settings-btn");
const settingsView = document.getElementById("settings-view");
const settingsBackBtn = document.getElementById("settings-back-btn");
const mainView = document.getElementById("main-view");

const optForceEnglish = document.getElementById("opt-force-english");
const optAutoRenew = document.getElementById("opt-auto-renew");
const optPersist = document.getElementById("opt-persist");
const optHistory = document.getElementById("opt-history");
const historyList = document.getElementById("history-list");

// Load settings on popup open
browser.runtime.sendMessage({ action: "getSettings" }).then(({ settings, identityHistory }) => {
  optForceEnglish.checked = settings.forceEnglish;
  optAutoRenew.checked = settings.autoRenew;
  optPersist.checked = settings.persist;
  optHistory.checked = settings.historyEnabled;
  renderHistory(identityHistory);
  if (settings.autoRenew && !autoRenewInterval) {
    startAutoRenewUI();
  }
});

function renderHistory(history) {
  historyList.innerHTML = "";
  if (!history || history.length === 0) {
    historyList.textContent = "";
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "history-empty";
    emptyDiv.textContent = "No history yet";
    historyList.appendChild(emptyDiv);
    return;
  }
  for (const item of history) {
    const el = document.createElement("div");
    el.className = "history-item";
    const infoDiv = document.createElement("div");
    const nameSpan = document.createElement("span");
    nameSpan.className = "history-item-name";
    nameSpan.textContent = item.name;
    const emailSpan = document.createElement("span");
    emailSpan.className = "history-item-email";
    emailSpan.textContent = item.email;
    infoDiv.append(nameSpan, emailSpan);
    if (item.password) {
      const pwSpan = document.createElement("span");
      pwSpan.className = "history-item-password";
      pwSpan.textContent = item.password;
      infoDiv.appendChild(pwSpan);
    }
    const dateSpan = document.createElement("span");
    dateSpan.className = "history-item-date";
    dateSpan.textContent = formatDate(item.date);
    el.append(infoDiv, dateSpan);
    historyList.appendChild(el);
  }
}

async function saveSetting(key, value) {
  const res = await browser.runtime.sendMessage({
    action: "updateSettings",
    settings: { [key]: value },
  });
  // If force-english changed and profile was regenerated, update UI
  if (key === "forceEnglish" && res.profile) {
    updateUI({ enabled: true, profile: res.profile });
  }
}

const autoRenewBarWrap = document.getElementById("auto-renew-bar-wrap");
const autoRenewBar = document.getElementById("auto-renew-bar");
let autoRenewInterval = null;
let autoRenewTick = null;
let autoRenewStart = 0;
const RENEW_MS = 60000;

function startAutoRenewUI() {
  stopAutoRenewUI();
  autoRenewBarWrap.classList.remove("hidden");
  autoRenewStart = Date.now();
  autoRenewBar.style.transform = "scaleX(1)";

  autoRenewTick = setInterval(() => {
    const elapsed = Date.now() - autoRenewStart;
    const ratio = Math.max(0, 1 - elapsed / RENEW_MS);
    autoRenewBar.style.transform = `scaleX(${ratio})`;
  }, 200);

  autoRenewInterval = setInterval(async () => {
    autoRenewStart = Date.now();
    autoRenewBar.style.transform = "scaleX(1)";
    const status = await browser.runtime.sendMessage({ action: "newSession" });
    if (status.enabled && status.profile) {
      updateUI(status);
    }
  }, RENEW_MS);
}

function stopAutoRenewUI() {
  autoRenewBarWrap.classList.add("hidden");
  autoRenewBar.style.transform = "scaleX(1)";
  if (autoRenewInterval) {
    clearInterval(autoRenewInterval);
    autoRenewInterval = null;
  }
  if (autoRenewTick) {
    clearInterval(autoRenewTick);
    autoRenewTick = null;
  }
}

optForceEnglish.addEventListener("change", () => saveSetting("forceEnglish", optForceEnglish.checked));
optAutoRenew.addEventListener("change", () => {
  saveSetting("autoRenew", optAutoRenew.checked);
  if (optAutoRenew.checked) {
    startAutoRenewUI();
  } else {
    stopAutoRenewUI();
  }
});
optPersist.addEventListener("change", () => saveSetting("persist", optPersist.checked));
optHistory.addEventListener("change", () => {
  saveSetting("historyEnabled", optHistory.checked);
  if (!optHistory.checked) {
    browser.runtime.sendMessage({ action: "clearHistory" });
    renderHistory([]);
  }
});

settingsBtn.addEventListener("click", () => {
  settingsBtn.classList.remove("spin-gear");
  void settingsBtn.offsetWidth;
  settingsBtn.classList.add("spin-gear");
  setTimeout(() => {
    mainView.classList.add("hidden");
    settingsView.classList.remove("hidden");
    settingsBtn.classList.add("hidden");
    settingsBackBtn.classList.remove("hidden");
    document.querySelector(".header-row h1").textContent = "Fridge Settings";
    // Refresh history
    browser.runtime.sendMessage({ action: "getHistory" }).then(renderHistory);
  }, 350);
});

settingsBackBtn.addEventListener("click", () => {
  settingsView.classList.add("hidden");
  mainView.classList.remove("hidden");
  settingsBackBtn.classList.add("hidden");
  settingsBtn.classList.remove("hidden");
  document.querySelector(".header-row h1").textContent = "Are you a fridge ?";
});
