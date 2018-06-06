function from_timestamp(timestamp) {
    let matches = timestamp.match(/(.*):(.*)\.(.*)/);
    let minutes = parseInt(matches[1]);
    let seconds = parseInt(matches[2]);
    let mseconds = parseInt(matches[3]);

    let mseconds_total = mseconds + 1000*(seconds + 60*minutes);

    return mseconds_total;
}

function initStandalone(div) {
  var style = "";
  var vid = div.data("id");

  let vtt_url = "http://localhost:3000/thumbnails/" + vid + ".vtt";

    var request = new XMLHttpRequest();
    request.open('GET', vtt_url, true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            if (type.indexOf("text") !== 1) {
                initStandalone2(div, request.responseText);
            }
        }
    }
}

function parseVTT(vtt) {
    let from = 0;
    let to = 0;
    let file = "";
    let x = 0;
    let y = 0;
    let w = 0;
    let h = 0;

    let thumbnails = [];

    for (let line of vtt.split("\n")) {
        var timings = /-->/;
        var payload = /jpg/;
        if (timings.test(line)) {
            var matches = line.match(/(.*) --> (.*)/);
            from = from_timestamp(matches[1]);
            to = from_timestamp(matches[2]);
        } else if (payload.test(line)) {
            var matches = line.match(/(.*)\?xywh=(.*),(.*),(.*),(.*)/);
            file = matches[1];
            x = matches[2];
            y = matches[3];
            w = matches[4];
            h = matches[5];

            thumbnails.push({from: from, to: to, file: file, x: x, y: y, w: w, h: h});
        }
    }
    return thumbnails;
}

function initStandalone2(div, vtt) {
  var style = "";
  var vid = div.data("id");
  var duration = from_timestamp(div.data("duration"));

  var thumbnails = parseVTT(vtt);

  var timelens = $(document.createElement("div"));
  div.after(timelens.get(0));
  timelens.attr("class", "timelens");
  timelens.attr("draggable", "false");

  var thumbnail = $(document.createElement("div"));
  timelens.append(thumbnail.get(0));
  thumbnail.attr("class", "thumbnail");
  thumbnail.attr("draggable", "false");

  var bar = $(document.createElement("img"));
  bar.attr("src", "timelines/" + vid + style + ".jpg");
  bar.attr("draggable", "false");
  timelens.append(bar.get(0));

  bar.mouseover(function(event) {
    bar.data("mouseover", true);
    thumbnail.fadeIn(100);
  });

  bar.mouseout(function(event) {
    bar.data("mouseover", false);
    thumbnail.fadeOut(100);
  });

  bar.mousemove(function(event) {
    x = event.offsetX ? event.offsetX : event.pageX - bar.offsetLeft;

    //marker.get(0).style.marginLeft = (x-11)+"px";

    //var i = Math.round(player.getCurrentTime()/player.getDuration()*THUMB_COUNT);

    let mseconds = (x/bar.width())*duration;

    let mt = null;
    for (let t of thumbnails) {
        if (mseconds >= t.from && mseconds <= t.to) {
            mt = t;
            break
        }
    }

    thumbnail.css(
      "background-position",
      -mt.x + "px " + -mt.y + "px"
    );
  thumbnail.css(
    "background-image",
    "url(thumbnails/"+mt.file+"), url(loading.png)"
  );
      thumbnail.css("width", mt.w);
      thumbnail.css("height", mt.h);
    thumbnail.get(0).style.marginLeft =
      x - mt.w / 2 - 5 +
      "px";
  });
}

function initIframe(iframe) {
  var vid = iframe
    .attr("src")
    .split("/")
    .pop();
  var url = iframe.attr("src");
  var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  var vid = url.match(regExp)[1];




  let vtt_url = "http://localhost:3000/thumbnails/" + vid + ".vtt";

    var request = new XMLHttpRequest();
    request.open('GET', vtt_url, true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            if (type.indexOf("text") !== 1) {
                initIframe2(iframe, request.responseText);
            }
        }
    }
}


function initIframe2(iframe, vtt) {
  var thumbnails = parseVTT(vtt);

  var vid = iframe
    .attr("src")
    .split("/")
    .pop();
  var url = iframe.attr("src");
  var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  var vid = url.match(regExp)[1];

  var style = "";
  var hidePlayer = false;
  var klass = iframe.attr("class");
  if (klass) {
    //        style = klass.match(/timelens(-\w+)/)[1];
        if (klass.match(/timelens-hide-player/)) {
            var hidePlayer = true;
        }
  }

  iframe.attr(
    "src",
    iframe.attr("src") +
      "&enablejsapi=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3"
  );
  iframe.attr(
    "style",
    (iframe.attr("style") || "") + "margin-bottom: 0; padding-bottom: 0"
  );

  var width = iframe.attr("width");

  iframe.attr("id", vid + style);

  var timelens = $(document.createElement("div"));
  iframe.parent().after(timelens.get(0));
  timelens.attr("class", "timelens");
  timelens.attr("draggable", "false");

  var thumbnail = $(document.createElement("div"));
  timelens.append(thumbnail.get(0));
  thumbnail.attr("class", "thumbnail");
  /*thumbnail.css(
    "background",
    "url(thumbnails/" + vid + style + ".jpg), url(loading.png)"
  );*/
  thumbnail.attr("draggable", "false");

  var bar = $(document.createElement("img"));
  bar.attr("src", "timelines/" + vid + style + ".jpg");
  bar.attr("draggable", "false");
  timelens.append(bar.get(0));

    if (!hidePlayer) {
      var marker = $(document.createElement("div"));
      marker.attr("draggable", "false");
      marker.attr("class", "marker");
      timelens.append(marker.get(0));

      bar.click(function(event) {
        x = event.offsetX ? event.offsetX : event.pageX - bar.offsetLeft;
        x = x / bar.width() * player.getDuration();
        player.seekTo(x, true);
      });
    }

  bar.mousedown(function(event) {
    bar.data("mousedown", true);
  });

  bar.mouseup(function(event) {
    bar.data("mousedown", false);
  });

  bar.mouseover(function(event) {
    bar.data("mouseover", true);
    thumbnail.fadeIn(100);
  });

  bar.mouseout(function(event) {
    bar.data("mouseover", false);
    thumbnail.fadeOut(100);
  });

  bar.mousemove(function(event) {
    x = event.offsetX ? event.offsetX : event.pageX - bar.offsetLeft;

      if (!hidePlayer) {
        if (bar.data("mousedown")) {
          //bar.click(event);
          x = x / bar.width() * player.getDuration();
          player.seekTo(x, true);
        }
      }

    var duration = player.getDuration();
    let mseconds = (x/bar.width())*duration*1000;

    let mt = null;
    for (let t of thumbnails) {
        if (mseconds >= t.from && mseconds <= t.to) {
            mt = t;
            break
        }
    }

    thumbnail.css(
      "background-position",
      -mt.x + "px " + -mt.y + "px"
    );
  thumbnail.css(
    "background-image",
    "url(thumbnails/"+mt.file+"), url(loading.png)"
  );
      thumbnail.css("width", mt.w);
      thumbnail.css("height", mt.h);
    thumbnail.get(0).style.marginLeft =
      x - mt.w / 2 - 5 +
      "px";
  });

  var player = new YT.Player(vid + style, {
    playerVars: { controls: 0, modestbranding: 1, rel: 0, iv_load_policy: 3 },
    events: {
      onReady: function() {
        // nop
      }
    }
  });

  //var thumbnail = $(document.createElement("img"));
  //thumbnail.attr("src", "thumbnails/"+vid+style+".jpg");
  //thumbnail.append(thumbnail.get(0));

    if (!hidePlayer) {
  setInterval(function() {
    marker.get(0).style.marginLeft =
      player.getCurrentTime() / player.getDuration() * bar.width() - 11 + "px";

    //var n = Math.round(player.getCurrentTime()/player.getDuration()*THUMB_COUNT);
    //var tx = n % THUMB_COLUMNS;
    //var ty = Math.floor(n/THUMB_COLUMNS);
    //thumbnail.css("background-position", (-tx*THUMB_WIDTH)+"px "+(-ty*THUMB_HEIGHT)+"px");
    //thumbnail.get(0).style.marginLeft = (player.getCurrentTime()/player.getDuration()*bar.width()-THUMB_WIDTH/2)+"px";
  }, 1 / 30);
    }
}

//function initPlayer(div) {
//    var playerdiv = document.createElement("div");
//    var vid = div.attr("id");
//    playerdiv.id = "player-"+vid;
//    div.append(playerdiv);
//
//    var timelens = document.createElement("div");
//    div.append(timelens);
//    $(timelens).attr("class", "timelens");
//    $(timelens).attr("style", "width: "+WIDTH+"px");
//
//    var bar = document.createElement("img");
//    $(bar).attr("src", "timelines/"+vid+".jpg");
//    timelens.append(bar);
//    $(bar).click(function(event) {
//        x = event.offsetX?(event.offsetX):event.pageX-bar.offsetLeft;
//        x = x/WIDTH*player.getDuration();
//        player.seekTo(x, true);
//    });
//
//    var marker = document.createElement("div");
//    timelens.append(marker);
//
//    var player = new YT.Player("player-"+vid, {
//        width: ""+WIDTH,
//        height: ""+9/16*WIDTH,
//        videoId: vid,
//        playerVars: { 'controls': 0, 'modestbranding': 1, 'rel': 0, 'iv_load_policy': 3 },
//        events: {
//            'onReady': function() {
//                // nop
//            }
//
//        }
//    });
//
//    setInterval(function(){
//        marker.style.marginLeft = (player.getCurrentTime()/player.getDuration()*WIDTH-10)+"px";
//    }, 1/30);
//}

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
  $("iframe")
    .not(".timelens-none")
    .each(function() {
      initIframe($(this));
    });
  $(".timelens-standalone")
    .each(function() {
      initStandalone($(this));
    });
}
