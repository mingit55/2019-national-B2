class Clip {
    static select_color = "rgb(233, 175, 74)";

    constructor(app, track){
        this.app = app;
        this.track = track;
        this.active = false;

        this.drawList = [() => this.redraw.apply(this)];
        
        this.selDownList = [e => this.selectDown.call(this, e)];
        this.selMoveList = [e => this.selectMove.call(this, e)];

        this.startTime = 0;
        this.duration = this.track.$video.duration;

        this.$canvas = app.viewport.$canvas;
        this.ctx = app.viewport.ctx;

        this.color = app.color;
        this.lineWidth = app.lineWidth;
        this.font = `${app.fontSize} Nanum Gothic, sans-serif`;

        this.$line = this.template();
    }


    // 클립 선택 체크하기 (병합된 것 포함)
    selectDownAll(e){
        return this.selDownList.reduce((p, c) => p && c(e), true);
    }
    
    selectMoveAll(e){
        return this.selMoveList.forEach(func => func(e));
    }

    setActive(bool){
        this.active = bool;
        bool ? this.$line.classList.add("active") : this.$line.classList.remove("active");
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
        let line = $(`<div class="clip">
                        <div class="view-line d-flex">
                            <div class="left"></div>
                            <div class="center"></div>
                            <div class="right"></div>
                        </div>
                    </div>`)[0];
        line.addEventListener("click", () => {
            this.track.clipList.forEach(clip => clip.setActive(false));
            this.setActive(true)
        });

        return line;
    }
}