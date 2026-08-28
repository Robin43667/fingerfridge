const btn = document.getElementById("toggle-btn");
const profileInfo = document.getElementById("profile-info");
const newSessionBtn = document.getElementById("new-session-btn");
const detailsToggle = document.getElementById("details-toggle");
const fullDetails = document.getElementById("full-details");

function updateUI({ enabled, profile }) {
  btn.textContent = enabled ? "Yes" : "No";
  btn.className = enabled ? "btn on" : "btn off";

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
  browser.runtime.sendMessage({ action: "toggle" }).then(updateUI);
});

// New session
newSessionBtn.addEventListener("click", () => {
  browser.runtime.sendMessage({ action: "newSession" }).then(updateUI);
});

// Expand/collapse details
detailsToggle.addEventListener("click", () => {
  const isHidden = fullDetails.classList.toggle("hidden");
  detailsToggle.textContent = isHidden ? "details" : "hide";
});
