document.addEventListener("DOMContentLoaded", function () {
    console.log("Popup loaded!");

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (!tabs || tabs.length === 0) {
            console.error("No active tab found!");
            return;
        }

        let currentUrl = tabs[0].url;
        console.log("Active URL:", currentUrl);

        let urlElement = document.getElementById("site-url");
        if (urlElement) {
            urlElement.textContent = currentUrl;
            checkUrl(currentUrl);
        } else {
            console.error("Element #site-url not found in popup.html");
        }
    });
});

function checkUrl(url) {
    console.log("Checking URL:", url);
    
    const API_KEY = "AIzaSyCU_KXjnPcM1KzzDnKn8X13pcpE-voUPC0";
    const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

    const requestBody = {
        client: {
            clientId: "ph1sherman",
            clientVersion: "1.0"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
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
        console.log("API Response:", data);

        let resultElement = document.getElementById("result");
        if (data.matches) {
            resultElement.textContent = "⚠️ UNSAFE!";
            resultElement.classList.add("unsafe");
            resultElement.classList.remove("safe");
        } else {
            resultElement.textContent = "✅ SAFE!";
            resultElement.classList.add("safe");
            resultElement.classList.remove("unsafe");
        }
    })
    .catch(error => {
        console.error("Error checking URL:", error);
        let resultElement = document.getElementById("result");
        resultElement.textContent = "⚠️ Error checking!";
        resultElement.classList.add("unsafe");
    });
}
