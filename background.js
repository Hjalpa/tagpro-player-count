// let player play tagpro when icon clicked
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.update(tab.id, {
        url: "http://tagpro-sphere.koalabeast.com/games/find/"
    });
});

(function() {
    // check player count
    $.ajax({
        type: "GET",
        url: "http://tagpro-sphere.koalabeast.com/stats",
        success: function(data) {
            // indicate player count in badge text
            chrome.browserAction.setBadgeText({
                text: data.players.toString()
            });

            if (data.players >=7) {
                // green for enough players to join
                chrome.browserAction.setBadgeBackgroundColor({
                    color: "#5ADB27"
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

    // check again in 5 seconds
    setTimeout(arguments.callee, 5000);
})();
