class TimelensPlugin extends Clappr.UICorePlugin {
    get name() {
        return 'timelens'
    }

    get attributes() {
        return {
            'class': this.name
        }
    }
    get template() {
        return "";
    }

    constructor(core) {
        super(core)
    }

    bindEvents() {
        this.listenTo(this.core.mediaControl, Clappr.Events.MEDIACONTROL_RENDERED, this._init)
    }

    _init() {
        var bar = jQuery(".bar-background");
        bar.timelens({
            timeline: this.core.options.timelens.timeline,
            thumbnails: this.core.options.timelens.thumbnails
        });
        bar.css("height", "10px");
    }

    _getOptions() {
        if (!("scrubThumbnails" in this.core.options)) {
            throw "'scrubThumbnails property missing from options object."
        }
        return this.core.options.scrubThumbnails
    }
}
