// make `timelens` available as a jQuery object method
(function($) {
    $.fn.timelens = function(options) {
        initTimelens(this);
        return this;
    };
}(jQuery));

// convert av WebVTT timestamp (which has the format [HH:]MM:SS.mmm) to milliseconds
function from_timestamp(timestamp) {
    let matches = timestamp.match(/(.*):(.*)\.(.*)/);

    let minutes = parseInt(matches[1]);
    let seconds = parseInt(matches[2]);
    let mseconds = parseInt(matches[3]);

    let mseconds_total = mseconds + 1000 * (seconds + 60 * minutes);

    return mseconds_total;
}

// get the video ID from an embedded YouTube video, or, alteratively,
// if `element` is not an iframe, from the `id` data-attribute
function getID(element) {
    if (element.is("iframe")) {
        var vid = element
            .attr("src")
            .split("/")
            .pop();
        var url = element.attr("src");
        var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        return url.match(regExp)[1];
    } else {
        return element.data("id");
    }
}

// how far is the mouse into the timeline, in a range from 0 to 1?
function progressAtMouse(event, timeline) {
    x = event.offsetX ? event.offsetX : event.pageX - timeline.offsetLeft;
    return x / timeline.width();
}

// load VTT file asynchronously, then continue with the initialization
function initTimelens(element) {
    let vid = getID(element);
    let vtt_url = "thumbnails/" + vid + ".vtt";

    var request = new XMLHttpRequest();
    request.open('GET', vtt_url, true);
    request.send(null);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            if (type.indexOf("text") !== 1) {
                initTimelens2(element, request.responseText);
            }
        }
    }
}

// actual Timelens initialization
function initTimelens2(element, vtt) {
    var thumbnails = parseVTT(vtt);
    var vid = getID(element);

    // select mode based on which element we get
    var mode = "standalone";
    if (element.is("iframe")) {
        mode = "youtube";
    }

    if (mode == "youtube") {
        // hide controls, branding, related videos, and video annotations,
        // and enable player to be controlled via the JavaScript API
        element.attr(
            "src",
            element.attr("src") +
            "&enablejsapi=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3"
        );

        // set id of the Iframe to the video ID, so we can find it later
        element.attr("id", vid);
    }

    // create main .timelens div, which will contain all new elements
    var timelens = $(document.createElement("div"));
    timelens.attr("class", "timelens");

    // create .thumbnail div, which contains the preview thumbnails
    var thumbnail = $(document.createElement("div"));
    thumbnail.attr("class", "thumbnail");

    // create .timeline img, which displays the visual timeline
    var timeline = $(document.createElement("img"));
    timeline.attr("src", "timelines/" + vid + ".jpg");
    // prevent the timeline image to be dragged
    timeline.attr("draggable", "false");

    // for YouTube videos, we want to append the Timelens interface to the parent,
    // because the Iframe will be wrapped in another div for responsiveness;
    // for other elements, we want to append it directly
    var root = element;
    if (mode == "youtube") {
        var root = element.parent();
    }

    // assemble everything together
    root.after(timelens.get(0));
    timelens.append(thumbnail.get(0));
    timelens.append(timeline.get(0));

    if (mode == "youtube") {
        // create .marker div, which is used to display the current position
        var marker = $(document.createElement("div"));
        marker.attr("class", "marker");
        timelens.append(marker.get(0));

        // when clicking the timeline, seek to the respective position
        timeline.click(function(event) {
            var progress = progressAtMouse(event, timeline, player);
            player.seekTo(progress * player.getDuration(), true);
        });
    }

    // fade thumbnail in/out when mouse enters/leaves the timeline
    timeline.mouseover(function(event) {
        thumbnail.fadeIn(100);
    });
    timeline.mouseout(function(event) {
        thumbnail.fadeOut(100);
    });

    timeline.mousemove(function(event) {
        // get duration in milliseconds
        if (mode == "youtube") {
            var duration = player.getDuration() * 1000;
        } else {
            var duration = from_timestamp(element.data("duration"));
        }

        // calculate click position in milliseconds
        var progress = progressAtMouse(event, timeline);
        let mseconds = (x / timeline.width()) * duration;

        // find the first entry in `thumbnails` which contains the current position
        let active_thumbnail = null;
        for (let t of thumbnails) {
            if (mseconds >= t.from && mseconds <= t.to) {
                active_thumbnail = t;
                break
            }
        }

        // set respective background image
        thumbnail.css(
            "background-image",
            "url(thumbnails/" + active_thumbnail.file + "), url(loading.png)"
        );
        // move background to the correct location
        thumbnail.css("background-position", -active_thumbnail.x + "px " + -active_thumbnail.y + "px");

        // set thumbnail div to correct size
        thumbnail.css("width", active_thumbnail.w);
        thumbnail.css("height", active_thumbnail.h);

        // move thumbnail div to the correct position
        thumbnail.get(0).style.marginLeft = x - active_thumbnail.w / 2 - 5 + "px";
    });

    if (mode == "youtube") {
        var player = new YT.Player(vid, {
            events: {
                onReady: function() {
                    // move marker to the correct position each second
                    setInterval(function() {
                        marker.get(0).style.marginLeft = player.getCurrentTime() / player.getDuration() * timeline.width() - 11 + "px";
                    }, 1);
                }
            }
        });
    }
}

// parse a VTT file pointing to JPEG files using media fragment notation
function parseVTT(vtt) {
    let from = 0;
    let to = 0;

    let thumbnails = [];

    for (let line of vtt.split("\n")) {
        if (/-->/.test(line)) {
            // parse a "cue timings" part
            var matches = line.match(/(.*) --> (.*)/);

            from = from_timestamp(matches[1]);
            to = from_timestamp(matches[2]);
        } else if (/jpg/.test(line)) {
            // parse a "cue payload" part
            var matches = line.match(/(.*)\?xywh=(.*),(.*),(.*),(.*)/);

            thumbnails.push({
                from: from,
                to: to,
                file: matches[1],
                x: matches[2],
                y: matches[3],
                w: matches[4],
                h: matches[5],
            });
        }
    }

    return thumbnails;
}
