// Content script: runs at document_start before page scripts
// Fetches the current profile from background and injects the spoofing script

(async () => {
  const response = await browser.runtime.sendMessage({ action: "getStatus" });

  if (!response.enabled || !response.profile) return;

  // Inject the profile data and spoofing script into the page context
  const script = document.createElement("script");
  script.setAttribute("data-profile", JSON.stringify(response.profile));
  script.src = browser.runtime.getURL("inject.js");
  (document.documentElement || document.head || document.body).appendChild(script);
  script.onload = () => script.remove();
})();
