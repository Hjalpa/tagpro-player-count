var trackedServer = "US East";

// let player play tagpro when icon clicked
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.update(tab.id, {
        url: "https://tagpro.koalabeast.com/games/find/"
    });
});

function changeTrackedServer(server) {
    trackedServer = server;

    chrome.storage.sync.set({server: trackedServer});

    // update immediately so player does not have to wait
    updatePlayerCount();
}

function updatePlayerCount() {
    // check player count
    $.ajax({
        type: "GET",
        url: "https://tagpro.koalabeast.com/stats",
        success: function(data) {
            // indicate player count in badge text
            chrome.browserAction.setBadgeText({
                text: data.players.toString()
            });

            if (data.players >= 7) {
                // green for enough players to join
                chrome.browserAction.setBadgeBackgroundColor({
                    color: "#1ABB07"
                });
            }
            else {
                // red for not enough players
                chrome.browserAction.setBadgeBackgroundColor({
                    color: "#DB0F35"
                });
            }
        },
        error: function() {
            chrome.browserAction.setBadgeText({
                text: "ERR"
            });

            // red for error
            chrome.browserAction.setBadgeBackgroundColor({
                color: "#DB0F35"
            });
        }
    });
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

    chrome.contextMenus.create({
        title: "Track US East",
        parentId: "server_choice",
        type: "radio",
        checked: trackedServer === "US East",
        contexts: ["browser_action"],
        onclick: function() {
            changeTrackedServer("US East");
        }
    });

    chrome.contextMenus.create({
        title: "Track US Central",
        parentId: "server_choice",
        type: "radio",
        checked: trackedServer === "US Central",
        contexts: ["browser_action"],
        onclick: function() {
            changeTrackedServer("US Central");
        }
    });

    chrome.contextMenus.create({
        title: "Track US West",
        parentId: "server_choice",
        type: "radio",
        checked: trackedServer === "US West",
        contexts: ["browser_action"],
        onclick: function() {
            changeTrackedServer("US West");
        }
    });

    chrome.contextMenus.create({
        title: "Track Europe",
        parentId: "server_choice",
        type: "radio",
        checked: trackedServer === "Europe",
        contexts: ["browser_action"],
        onclick: function() {
            changeTrackedServer("Europe");
        }
    });

    chrome.contextMenus.create({
        title: "Track Oceanic",
        parentId: "server_choice",
        type: "radio",
        checked: trackedServer === "Oceanic",
        contexts: ["browser_action"],
        onclick: function() {
            changeTrackedServer("Oceanic");
        }
    });
    
    (function() {
        // check player count initially
        updatePlayerCount();

        // check again in 60 seconds
        setTimeout(arguments.callee, 60000);
    })();
});
