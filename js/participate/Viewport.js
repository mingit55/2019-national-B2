class Viewport {
    constructor(app){
        this.app = app;
        this.current_track = null;

        this.$canvas = document.createElement("canvas");
        this.$canvas.width = app.width;
        this.$canvas.height = app.height;

        this.ctx = this.$canvas.getContext("2d");
        this.ctx.lineCap = "round";

        app.$viewport.append(this.$canvas);

        this.frame();
    }

    set track(input){
        if(this.current_track){
            this.current_track.$video.pause();
            this.current_track.$video.remove();
            this.current_track.$list.remove();
        }
        this.current_track = input;       

        this.app.$viewport.prepend(input.$video);
        this.app.$cliplist.append(input.$list);
    }

    select(e){
        this.pause();

        let clipList = this.current_track.clipList.reverse();
        clipList.forEach(x => x.setActive(false)); // reverse 문제 해결바람
        let clip = this.current_track.clipList.find(x => x.selectDownAll(e));
        if(clip) clip.setActive(true);

        clipList.reverse();

        return clip; // 해당되는 클립을 리턴해야함
    }


    // View Method

    frame(){
        this.render();
        

        requestAnimationFrame(() => {
            this.frame();
        });
    }

    render(){
        this.ctx.clearRect(0, 0, this.app.width, this.app.height);
        if(this.current_track)
            this.current_track.clipList.forEach(clip => {
                clip.drawList.forEach(draw => draw());
            });
    }

    play(){
        this.current_track.$video.play();
    }

    pause(){
        this.current_track.$video.pause();
    }
}