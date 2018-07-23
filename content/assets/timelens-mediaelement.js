'use strict';

/**
 * [Name of feature]
 *
 * [Description]
 */

// If plugin needs translations, put here English one in this format:
// mejs.i18n.en["mejs.id1"] = "String 1";
// mejs.i18n.en["mejs.id2"] = "String 2";

// Feature configuration
Object.assign(mejs.MepDefaults, {
    // Any variable that can be configured by the end user belongs here.
    // Make sure is unique by checking API and Configuration file.
    // Add comments about the nature of each of these variables.
});


Object.assign(MediaElementPlayer.prototype, {

    // Public variables (also documented according to JSDoc specifications)

    /**
     * Feature constructor.
     *
     * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
     * @param {MediaElementPlayer} player
     * @param {HTMLElement} controls
     * @param {HTMLElement} layers
     * @param {HTMLElement} media
     */
    buildtimelens(player, controls, layers, media) {
        // This allows us to access options and other useful elements already set.
        // Adding variables to the object is a good idea if you plan to reuse
        // those variables in further operations.
        const t = this;

        let slider = controls.querySelector('.' + t.options.classPrefix + 'time-slider');
        slider.style.background = "red";
        $(slider).timelens({
            timeline: t.options.timeline,
            thumbnails: t.options.thumbnails,
            duration: function() {
                return t.getDuration();
            }
        });

        // All code required inside here to keep it private;
        // otherwise, you can create more methods or add variables
        // outside of this scope
    },

    // Optionally, each feature can be destroyed setting a `clean` method

    /**
     * Feature destructor.
     *
     * Always has to be prefixed with `clean` and the name that was used in MepDefaults.features list
     * @param {MediaElementPlayer} player
     * @param {HTMLElement} controls
     * @param {HTMLElement} layers
     * @param {HTMLElement} media
     */
    cleantimelens(player, controls, layers, media) {}

    // Other optional public methods (all documented according to JSDoc specifications)
});
