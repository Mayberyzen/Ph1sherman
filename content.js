console.log("Ph1sherman content script loaded.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "check_url") {
        console.log("Checking URL:", message.url);
        sendResponse({ status: "URL check initiated" });
    }
});
