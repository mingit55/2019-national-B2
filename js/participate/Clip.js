class Clip {
    static select_color = "rgb(233, 175, 74)";

    constructor(app, track){
        this.app = app;
        this.track = track;
        this.active = false;
        this.merge = false;

        this.mergeList = [this];

        this.startTime = 0;
        this.duration = this.track.$video.duration;

        this.$canvas = app.viewport.$canvas;
        this.ctx = app.viewport.ctx;

        this.color = app.color;
        this.lineWidth = app.lineWidth;
        this.font = `${app.fontSize} Nanum Gothic, sans-serif`;

        this.line_pos = null;
        this.$line = this.template();
        this.$viewline = this.$line.firstElementChild;
    }

    outerHTML(){
        let active = this.active;
        this.active = false;

        let canvas = document.createElement("canvas");
        canvas.width = this.app.width;
        canvas.height = this.app.height;

        let ctx = canvas.getContext("2d");
        
        this.mergeList.forEach(clip => clip.redraw(ctx));
        let url = canvas.toDataURL("image/png");

        let image = document.createElement("img");
        image.classList.add("clip");
        let style = image.style;
        style.position = "absolute";
        style.left = "0";
        style.top = "0";
        style.pointerEvents = "none";

        image.dataset.startTime = this.startTime.toFixed(2);
        image.dataset.duration = this.duration.toFixed(2);

        image.src = url;
        image.width = this.app.width;
        image.height = this.app.height;


        this.active = active;

        return image.outerHTML;
    }


    // 클립 선택 체크하기 (병합된 것 포함)
    selectDownAll(e){
        return this.mergeList
                        .map(clip => clip.selectDown(e))
                        .reduce((p, c) => p || c);
    }
    
    selectMoveAll(e){
        return this.mergeList.forEach(clip => clip.selectMove(e));
    }

    setActive(bool){
        this.mergeList.forEach(clip => clip.active = bool);
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
        let line = $(`<div class="clip" draggable="true">
                        <div class="view-line d-flex">
                            <div class="left" data-movement="left"></div>
                            <div class="center" data-movement="center"></div>
                            <div class="right" data-movement="right"></div>
                        </div>
                        <input type="checkbox" class="merge-check">
                    </div>`)[0];

        line.addEventListener("click", e => {
            if(this.app.tool !== "select") return;
            this.track.clipList.forEach(clip => clip.setActive(false));
            this.setActive(true)
        });

        // 클립 드롭 다운
        line.addEventListener("dragstart", e => {
            if(!e.target.classList.contains("clip")) return false;
            this.track.dragTarget = e.target;
        })
        line.addEventListener("dragover", e => e.preventDefault());
        line.addEventListener("drop", e => {
            let dropped = e.target;
            $(e.target).closest(".clip");
            while(dropped && !dropped.classList.contains("clip")) dropped = dropped.parentElement;
            if(!dropped.classList.contains("clip")) return;
            this.track.swap(dropped);
        });

        // 클립 시간 조정하기
        line.querySelectorAll(".left, .center, .right").forEach(item => {
            item.addEventListener("mousedown", e => {
                if(this.active)
                    this.line_pos = {
                        movement: e.target.dataset.movement,
                        x: this.$viewline.offsetLeft,
                        w: this.$viewline.offsetWidth,
                        fx: this.track.getX(e)
                    }; 
            });
        });
        window.addEventListener("mouseup", () => this.line_pos = null);

        window.addEventListener("mousemove", e => {
            if(e.which !== 1 || this.line_pos === null) return;

            const {offsetWidth} = this.app.$cliplist;
            let x = this.$viewline.offsetLeft;
            let w = this.$viewline.offsetWidth;

            let cx = this.track.getX(e);

            if(this.line_pos.movement === "left"){
                x = cx > this.line_pos.x + this.line_pos.w - 30 ? this.line_pos.x + this.line_pos.w - 30 : cx;
                w = this.line_pos.w + this.line_pos.x - x;
            }
            else if(this.line_pos.movement === "center"){
                let offset = this.line_pos.fx - this.line_pos.x;
                x = cx - offset;
                x = x + w > offsetWidth ? offsetWidth - w : x < 0 ? 0 : x;
            }
            else if(this.line_pos.movement === "right"){
                w = cx - this.line_pos.x;
                w = w < 30 ? 30 : w + x > offsetWidth ? offsetWidth - x : w;
            }

            this.$viewline.style.width = w + "px";
            this.$viewline.style.left = x + "px";
            
            this.startTime = this.track.$video.duration * x / offsetWidth;
            this.duration = this.track.$video.duration * w / offsetWidth;
        });

        line.querySelector(".merge-check").addEventListener("click", e => {
            e.stopPropagation();

            this.merge = e.target.checked;
        });

        return line;
    }
}