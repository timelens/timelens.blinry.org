---
title: Integrations
---

All web integrations require the `timelens.js` library, as well as the default CSS file. Simply include them in the header of your website, like this:

    <script src="/path/to/timelens.js"></script>
    <link rel="stylesheet" href="/path/to/timelens.css">

## General-purpose JavaScript

<div id="timelens" class="demo"></div>

Suppose you have a div with the id `timelens`, and you want it to hold the visual timeline of a video, and show thumbnails on mouseover.
Use this JavaScript to specify the location of the timeline and the thumbnails VTT file:

    timelens("#timelens", {
        timeline: "/path/to/timeline.jpg",
        thumbnails: "/path/to/thumbnails.vtt"
    });

To integrate Timelens with a video player, you can use the callbacks `seek` and `position`:

    timelens("#timelens", {
        timeline: "/path/to/timeline.jpg",
        thumbnails: "/path/to/thumbnails.vtt"
        seek: function(position) {
            // This is called when the user clicks on the timeline.
            // `position` specifies the seek position in seconds.
            your_player.seek(position);
        },
        position: function() {
            // This is called when the code wants to know the current player position,
            // to update the position of the progress marker correctly.
            // It should return the current position in seconds.
            return your_player.position();
        }
    });

<script>
timelens("#timelens", {timeline: "/timelines/6558.jpg", thumbnails: "/thumbnails/6558.vtt"});
</script>

## MediaElement.js

<script src="/assets/mediaelement/mediaelement-and-player.min.js"></script>

<link rel="stylesheet" href="/assets/mediaelement/mediaelementplayer.min.css" />
<script src="/assets/timelens-mediaelement.js"></script>

<video class="mediaelement" data-id="2291" poster="https://static.media.ccc.de/media/congress/2014/6558-hd_preview.jpg" id="mejs_6321571297311233_html5" src="https://cdn.media.ccc.de/congress/2014/webm-hd/31c3-6558-de-en-Traue_keinem_Scan_den_du_nicht_selbst_gefaelscht_hast_webm-hd.webm" preload="auto" style="width: 100%; height: 100%;" data-timeline="/timelines/6558.jpg">
<track kind="metadata" label="thumbnails" src="/thumbnails/6558.vtt">
</video>

Include timelens-mediaelement.js in your website's `<head>`.
Then you can simply add a `timelens` entry to the features list when initializing the player, and everything will just work:

    var player = new MediaElementPlayer(document.querySelector("#mediaelement"), {
        features: ["playpause", "progress", "volume", "timelens"]
    });

<script>
var player = new MediaElementPlayer(document.querySelector(".mediaelement"), {
    features: ["playpause", "progress", "volume", "timelens"]
});
</script>

## Clappr

<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/clappr@latest/dist/clappr.min.js"></script>

<script type="text/javascript" src="/assets/timelens-clappr.js"></script>

<div id="clappr" style="width: 100%; height: 100%"></div>

<script>
    var player = new Clappr.Player({
        source: "https://berlin-ak.ftp.media.ccc.de//congress/2014/webm-hd/31c3-6558-de-en-Traue_keinem_Scan_den_du_nicht_selbst_gefaelscht_hast_webm-hd.webm",
        parentId: "#clappr",
        poster: "https://static.media.ccc.de/media/congress/2014/6558-hd_preview.jpg",
        plugins: {
            core: [TimelensPlugin]
        },
        timelens: {
            timeline: "/timelines/6558.jpg",
            thumbnails: "/thumbnails/6558.vtt"
        }
    });
</script>

Include timelens-clappr.js in your website's `<head>`.
Then you can simply add a `TimelensPlugin` entry to the plugins list when initializing the player, and define the location of the timeline and the thumbnails file in the `timelens` parameter:

    var player = new Clappr.Player({
        source: "/path/to/video.mp4",
        parentId: "#clappr",
        plugins: {
            core: [TimelensPlugin]
        },
        timelens: {
            timeline: "/path/to/timeline.jpg",
            thumbnails: "/path/to/thumbnails.vtt"
        }
    });
