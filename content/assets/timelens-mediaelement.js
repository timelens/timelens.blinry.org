'use strict';

Object.assign(mejs.MepDefaults, {
    // Any variable that can be configured by the end user belongs here.
    // Make sure is unique by checking API and Configuration file.
    // Add comments about the nature of each of these variables.
});


Object.assign(MediaElementPlayer.prototype, {
    buildtimelens(player, controls, layers, media) {
        const t = this;

        let vid = media.querySelector("video");
        let timeline = vid.dataset.timeline;


        let thumbnailsTrack = vid.querySelector("track[label=\"thumbnails\"]");
        let thumbnails = thumbnailsTrack.src;

        console.log(thumbnails);

        let slider = controls.querySelector('.' + t.options.classPrefix + 'time-slider');
        slider.style.height = "40px";
        slider.style["margin-top"] = "-15px";
        $(slider).timelens({
            timeline: timeline,
            thumbnails: thumbnails
        });
    },

    cleantimelens(player, controls, layers, media) {}
});
