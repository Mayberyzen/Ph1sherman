chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url && tab.url.startsWith("http")) {
        let domain = extractMainDomain(tab.url);

        chrome.storage.local.get(["checkedDomains"], (data) => {
            let checkedDomains = data.checkedDomains || [];

            if (!checkedDomains.includes(domain)) {
                checkedDomains.push(domain);
                chrome.storage.local.set({ checkedDomains: checkedDomains });

                console.log(`✅ Checking domain: ${domain}`);
                checkSite(tab.url);
            } else {
                console.log(`⏩ Skipping already verified domain: ${domain}`);
            }
        });
    }
});
function extractMainDomain(url) {
    try {
        let hostname = new URL(url).hostname;
        let domainParts = hostname.split(".");
        if (domainParts.length > 2) {
            return domainParts.slice(-2).join("."); 
        }
        return hostname;
    } catch (error) {
        console.error("Error extracting domain:", error);
        return url;
    }
}

function checkSite(url) {
    console.log("Checking site:", url);

    const API_KEY = "AIzaSyCU_KXjnPcM1KzzDnKn8X13pcpE-voUPC0"; 
    const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

    const requestBody = {
        client: { clientId: "ph1sherman", clientVersion: "1.0" },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url: url }]
        }
    };

    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Safe Browsing API Response:", data);

        if (data.matches) {
            showNotification("🚨 WARNING!", "This site is unsafe!");
        } else {
            showNotification("✅ Safe Site", "This site is secure.");
        }
    })
    .catch(error => {
        console.error("Error checking URL:", error);
        showNotification("⚠️ Error", "Could not verify site safety.");
    });
}

function showNotification(title, message) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icon48.png"),
        title: title,
        message: message,
        priority: 2
    });
}
