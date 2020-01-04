class Clip {
    static select_color = "rgb(233, 175, 74)";

    constructor(app, track){
        this.app = app;
        this.track = track;
        this.active = false;

        this.drawList = [() => this.redraw.apply(this)];
        this.startTime = 0;
        this.duration = this.track.$video.duration;

        this.$canvas = app.viewport.$canvas;
        this.ctx = app.viewport.ctx;

        this.color = app.color;
        this.lineWidth = app.lineWidth;
        this.font = `${app.fontSize} Nanum Gothic, sans-serif`;

        this.$line = this.template();
    }

    getXY(e){
        const {pageX, pageY} = e;
        const {offsetLeft, offsetTop, offsetWidth, offsetHeight} = this.app.$viewport;

        let left = offsetLeft;
        let top = offsetTop;
        let parent = this.app.$viewport.offsetParent;
        while(parent){
            left += parent.offsetLeft;
            top += parent.offsetTop;
            parent = parent.offsetParent;
        }

        let x = pageX - left;
        let y = pageY - top;

        return {
            X: x < 0 ? 0 : x > offsetWidth ? offsetWidth : x,
            Y: y < 0 ? 0 : y > offsetHeight ? offsetHeight : y
        };
    }

    template(){
        return $(`<div class="clip">
                    <div class="view-line d-flex">
                        <div class="left"></div>
                        <div class="center"></div>
                        <div class="right"></div>
                    </div>
                </div>`)[0];
    }
}