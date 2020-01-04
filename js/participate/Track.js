class Track {
    constructor(app, id){
        this.id = id;
        this.app = app;

        this.$video = document.createElement("video");
        this.$video.controls = false;
        this.$video.src = `videos/movie${id}.mp4`;
        this.$video.width = app.width;
        this.$video.height = app.height;

        this.clipList = [];
        this.$list = $(`<div>
                            <div id="cursor"></div>
                            <div class="line"></div>
                        </div>`)[0];
    }

    addClip(clip){
        this.$list.prepend(clip.$line);
        this.clipList.unshift(clip);
    }
}