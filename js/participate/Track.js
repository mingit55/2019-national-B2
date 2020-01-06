class Track {
    constructor(app, id){
        this.id = id;
        this.app = app;

        this.$video = document.createElement("video");
        this.$video.controls = false;
        this.$video.src = `videos/movie${id}.mp4`;
        this.$video.width = app.width;
        this.$video.height = app.height;

        this.init();
    }

    init(){
        this.clipList = [];
        this.$list = $(`<div>
                            <div id="cursor"></div>
                            <div class="line"></div>
                        </div>`)[0];

        this.$cursor = this.$list.querySelector("#cursor");

        this.seek = false;
        this.cursorEvent();
    }

    getX(e){
        const {left} = $(this.app.$cliplist).offset();
        const {offsetWidth} = this.app.$cliplist;

        let x = e.clientX - left;
        x = x < 0 ? 0 : x > offsetWidth ? offsetWidth : x;

        return x;
    }

    cursorEvent(){
        this.$cursor.addEventListener("mousedown", () => this.seek = true);
        window.addEventListener("mouseup", () => this.seek = false);
        window.addEventListener("mousemove", e => {
            if(e.which !== 1 || !this.seek) return;

            this.$video.currentTime = this.$video.duration * this.getX(e) / this.app.$cliplist.offsetWidth;
        });
    }

    addClip(clip){
        this.$list.prepend(clip.$line);
        this.clipList.push(clip);
    }

    seekCursor(){
        const {currentTime, duration} = this.$video;
        this.$cursor.style.left = (100 * currentTime / duration) + "%";
    }

    deleteAll(){
        this.$video.pause();
        this.$video.currentTime = 0;
        this.seekCursor();

        this.$list.remove();
        this.init();
        this.app.$cliplist.append(this.$list);
    }

    selectDelete(){
        this.clipList.forEach((clip, i) => {
            if(!clip.active) return;
            clip.$line.remove();
            this.clipList.splice(i, 1);
        })
    }
}