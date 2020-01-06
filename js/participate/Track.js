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

    swap(dropped){
        if(!this.dragTarget) return false;

        // DOM 교체
        let droppedNext = dropped.nextElementSibling;
        this.app.$cliplist.firstElementChild.insertBefore(dropped, this.dragTarget);
        if(droppedNext === this.dragTarget) this.app.$cliplist.firstElementChild.insertBefore(this.dragTarget, dropped);
        else this.app.$cliplist.firstElementChild.insertBefore(this.dragTarget, droppedNext);

        // 배열 교체
        let idxA = this.clipList.findIndex(clip => clip.$line === this.dragTarget);
        let idxB = this.clipList.findIndex(clip => clip.$line === dropped);
        
        let temp = this.clipList[idxA];
        this.clipList[idxA] = this.clipList[idxB];
        this.clipList[idxB] = temp;
    }

    merge(){
        // 병합 목록을 배열에서 배제
        let mergeList = this.clipList.filter(x => x.merge);
        this.clipList = this.clipList.filter(x => !x.merge);
        
        if(mergeList.length === 1) return alert("병합할 클립이 없습니다!");

        mergeList.forEach(x => {
            x.$line.remove();
        });

        // 병합하기
        let startTime = mergeList.reduce((p, c) => Math.min(p, c.startTime), this.$video.duration);
        let endTime = mergeList.reduce((p, c) => Math.max(p, c.startTime + c.duration), 0)
        let duration = endTime - startTime;
        let active = mergeList.reduce((p, c) => p || c.active, false);
        mergeList.forEach(x => x.active = active);

        let clip = mergeList.shift();
        clip.startTime = startTime;
        clip.duration = duration;
        clip.$viewline.style.width = this.app.$cliplist.offsetWidth * duration / this.$video.duration + "px";
        clip.$viewline.style.left = this.app.$cliplist.offsetWidth * startTime / this.$video.duration + "px";

        clip.mergeList = clip.mergeList.concat(mergeList);

        clip.$line.querySelector("input").checked = false;

        this.app.$cliplist.firstElementChild.prepend(clip.$line);      
        this.clipList.push(clip);
    }
}