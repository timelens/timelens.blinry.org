---
title: Plugins
---

If you're maintaining a website with video players on it, you can add Timelens support easily!

To use the web plugins, you need the `timelens.js` library, as well as the `timelens.css` file. You can install the `timelens` [npm package](https://www.npmjs.com/package/timelens):

    $ npm install timelens

Or you can simply download them from the [GitHub repository](https://github.com/timelens/timelens.js). Then, include them in the header of your website, like this:

    <script src="/path/to/timelens.js"></script>
    <link rel="stylesheet" href="/path/to/timelens.css">

You also need to run the Timelens command line tool on your videos, to generate the required image files, see [the usage section](/usage/) on how to do that. After that, you should have an image with the visual timeline, a VTT file specifying the positions of the preview thumbnails, as well as one or more thumbnail sheets in the same directory. On this page, we will use `/path/to/timeline.jpg` to refer to the location of the visual timeline, and `/path/to/thumbnails.vtt` to refer to the location of the thumbnails VTT.

## General-purpose JavaScript


Suppose you have an empty div, which you want to make into a Timelens user interface:

    <div id="timelens"></div>

Use this JavaScript to specify the div's id, and the locations of the timeline and the thumbnails VTT file:

    timelens("#timelens", {
        timeline: "/path/to/timeline.jpg",
        thumbnails: "/path/to/thumbnails.vtt"
    });

The result will look like this:

<div id="timelens" class="demo"></div>

To integrate Timelens with a video player which doesn't yet have a ready-made plugin (see below), you can use the callbacks `seek` and `position`:

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
            // The progress marker will be shown only if this callback is specified.

            return your_player.position();
        }
    });

<script>
timelens("#timelens", {timeline: "/timelines/talk.jpg", thumbnails: "/thumbnails/talk.vtt"});
</script>

## MediaElement.js

To add Timelens support to a *MediaElement.js* player, add a `data-timeline` attribute to your `<video>` tag, and add a subtitle track with the label `"thumbnails"`:

    <video id="mediaelement" src="/path/to/video.mp4" preload="auto" data-timeline="/path/to/timeline.jpg">
        <track kind="metadata" label="thumbnails" src="/path/to/thumbnails.vtt">
    </video>

Also, add a `"timelens"` entry to the features list when initializing the player:

    var player = new MediaElementPlayer(document.querySelector("#mediaelement"), {
        features: ["playpause", "progress", "volume", "timelens"]
    });

The result will look like this:

<video id="mediaelement" poster="/assets/images/talk-cover.png"
src="https://cdn.media.ccc.de/events/mrmcd/mrmcd18/webm-hd/mrmcd18-162-deu-Timelens_und_die_Zukunft_der_Videonavigation_webm-hd.webm" preload="auto" style="width: 100%; height: 100%;" data-timeline="/timelines/talk.jpg">
<track kind="metadata" label="thumbnails" src="/thumbnails/talk.vtt">
</video>

<script>
var player = new MediaElementPlayer(document.querySelector("#mediaelement"), {
    features: ["playpause", "progress", "volume", "fullscreen", "timelens"]
});
</script>

## Clappr

To add Timelens support to a *Clappr* player, prepare an empty div to hold the player:

    <div id="clappr"></div>

Then add a `TimelensPlugin` entry to the plugins list when initializing the player, and define the location of the timeline and the thumbnails file in the `timelens` parameter:

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

The result will look like this:

<div id="clappr2"></div>

<script>
    var player = new Clappr.Player({
        source: "https://cdn.media.ccc.de/events/mrmcd/mrmcd18/webm-hd/mrmcd18-162-deu-Timelens_und_die_Zukunft_der_Videonavigation_webm-hd.webm",
        parentId: "#clappr2",
        poster: "/assets/images/talk-cover.png",
        mediacontrol: {buttons: "#ccc"},
        plugins: {
            core: [TimelensPlugin]
        },
        timelens: {
            timeline: "/timelines/talk.jpg",
            thumbnails: "/thumbnails/talk.vtt"
        }
    });
</script>

## Looking for more background info?

[Read all about it](/about/){:.button}
