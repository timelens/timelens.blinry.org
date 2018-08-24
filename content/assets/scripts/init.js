// Load the Iframe Player API code asynchronously.
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// When the YouTube API is ready...
function onYouTubeIframeAPIReady() {
    // ... do the following for all iframe elements:
    var iframes = document.querySelectorAll("iframe");

    [].forEach.call(iframes, function(iframe) {
        // Get the ID of the YouTube video.
        var url = iframe.src;
        var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        var vid = url.match(regExp)[1];

        // Assign a random ID to the iframe, and set some options we like,
        // see https://developers.google.com/youtube/player_parameters.
        var randomID = Math.random()
            .toString(36)
            .substring(2, 15);
        iframe.id = randomID;
        iframe.src =
            iframe.src +
            "?enablejsapi=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3";

        // Initialize the player.
        var player = new YT.Player(randomID, {
            events: {
                onReady: function(event) {
                    // Insert a new, empty div after the iframe's parent.
                    var tl = document.createElement("div");
                    iframe.parentNode.parentNode.insertBefore(
                        tl,
                        iframe.parentNode.nextSibling
                    );

                    // Initialize Timelens on that div.
                    timelens(tl, {
                        timeline: "timelines/" + vid + ".jpg",
                        thumbnails: "thumbnails/" + vid + ".vtt",
                        duration: function() {
                            return player.getDuration();
                        },
                        position: function() {
                            return player.getCurrentTime();
                        },
                        seek: function(seconds) {
                            player.seekTo(seconds, true);
                        }
                    });
                }
            }
        });
    });
}

// Also, for all .timelens-standalone elements, initialize Timelens.
document.addEventListener("DOMContentLoaded", function() {
    var nemo = document.querySelector(".timelens-standalone");
    timelens(nemo, {
        timeline: "timelines/" + nemo.dataset.id + ".jpg",
        thumbnails: "thumbnails/" + nemo.dataset.id + ".vtt"
    });
});
