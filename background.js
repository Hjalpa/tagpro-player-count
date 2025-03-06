var trackedServer = "US East";

// let player play tagpro when icon clicked
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.update(tab.id, {
        url: "https://tagpro.koalabeast.com/games/find/"
    });
});

function changeTrackedServer(server) {
    trackedServer = server;
    chrome.storage.sync.set({server: trackedServer}, updatePlayerCount); // Update and then call updatePlayerCount
}

function updatePlayerCount() {
    // check player count
    $.ajax({
        type: "GET",
        url: "https://tagpro.koalabeast.com/stats",
        dataType: "json",  // Expect JSON data
        success: function(data) {
            if (!data || typeof data !== 'object') {
                console.error("Invalid data received from API:", data);
                setExtensionBadge("ERR", "#DB0F35"); // Error state
                return;
            }

            let ingamePlayers;

            if (data[trackedServer] && typeof data[trackedServer] === 'object' && 'ingame' in data[trackedServer]) {
                ingamePlayers = data[trackedServer].ingame;
            } else {
                console.warn(`'ingame' data not found for ${trackedServer}.`);
                setExtensionBadge("ERR", "#DB0F35");
                return;
            }

            setExtensionBadge(ingamePlayers.toString(), ingamePlayers >= 7 ? "#1ABB07" : "#DB0F35");

        },
        error: function(xhr, status, error) {
            console.error("Error fetching player count:", status, error);
            setExtensionBadge("ERR", "#DB0F35");
        }
    });
}

function setExtensionBadge(text, color) {
    chrome.browserAction.setBadgeText({ text: text });
    chrome.browserAction.setBadgeBackgroundColor({ color: color });
}


chrome.storage.sync.get("server", function(data) {
    if (data.server)
        trackedServer = data.server;

    // register radio buttons for all servers
    chrome.contextMenus.create({
        title: "Choose server to track",
        id: "server_choice",
        contexts: ["browser_action"]
    });

    const servers = ["Total", "US East", "US Central", "US West", "Europe", "Oceanic"];
    servers.forEach(server => {
        chrome.contextMenus.create({
            title: `Track ${server}`,
            parentId: "server_choice",
            type: "radio",
            checked: trackedServer === server,
            contexts: ["browser_action"],
            onclick: function() {
                changeTrackedServer(server);
            }
        });
    });
    
    // Initial update and set interval.
    updatePlayerCount(); // Call it immediately
    setInterval(updatePlayerCount, 60000); // Call it every 60 seconds
});
