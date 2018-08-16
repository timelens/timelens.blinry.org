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
        var bar = document.querySelector(".bar-background");
        timelens(bar, {
            timeline: this.core.options.timelens.timeline,
            thumbnails: this.core.options.timelens.thumbnails
        });
        bar.style.height = "10px";
    }

    _getOptions() {
        if (!("scrubThumbnails" in this.core.options)) {
            throw "'scrubThumbnails property missing from options object."
        }
        return this.core.options.scrubThumbnails
    }
}
