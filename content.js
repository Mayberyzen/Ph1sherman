console.log("Ph1sherman content script loaded.");

// Example functionality (modify if needed)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "check_url") {
        console.log("Checking URL:", message.url);
        sendResponse({ status: "URL check initiated" });
    }
});
