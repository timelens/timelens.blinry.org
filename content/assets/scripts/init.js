// Load the Iframe Player API code asynchronously.
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// When the YouTube API is ready...
function onYouTubeIframeAPIReady() {
    // ... do the following for all iframe elements:
    $("iframe").each(function() {
        // Get the ID of the YouTube video.
        var url = $(this).attr("src");
        var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        var vid = url.match(regExp)[1];

        // Assign a random ID to the iframe, and set some options we like,
        // see https://developers.google.com/youtube/player_parameters.
        var randomID = Math.random().toString(36).substring(2, 15);
        $(this).attr("id", randomID);
        $(this).attr("src", $(this).attr("src") + "?enablejsapi=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3");

        // Initialize the player.
        var player = new YT.Player(randomID, {
            events: {
                onReady: function(event) {
                    // Insert a new, empty div after the iframe's parent.
                    var timelens = $(document.createElement("div"));
                    $("#" + randomID).parent().after(timelens);

                    // Initialize Timelens on that div.
                    timelens.timelens({
                        timeline: "timelines/" + vid + ".jpg",
                        thumbnails: "thumbnails/" + vid + ".vtt",
                        duration: player.getDuration(),
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
$(function() {
    $(".timelens-standalone").each(function() {
        $(this).timelens({
            timeline: "timelines/" + $(this).data("id") + ".jpg",
            thumbnails: "thumbnails/" + $(this).data("id") + ".vtt",
            duration: parseInt($(this).data("duration"))
        });
    });

    $("video").mediaelementplayer({
        features: ["playpause", "progress", "volume", "timelens"],
        timeline: "/timelines/6558.jpg",
        thumbnails: "/thumbnails/6558.vtt"
    });
});
