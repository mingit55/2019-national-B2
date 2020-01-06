Number.prototype.parseTimer = function(){
    let intNo = parseInt(this);

    let hour = parseInt(intNo / 3600);
    hour = hour < 10 ? "0" + hour : hour;

    let min = parseInt(intNo / 60) % 60;
    min = min < 10 ? "0" + min : min;

    let sec = intNo % 60;
    sec = sec < 10 ? "0" + sec : sec;

    let msec = this.toFixed(2).substr(-2, 2);

    return `${hour}:${min}:${sec}:${msec}`;
};

class App {
    static movieselect = new Event("movieselect");

    constructor(){
        // Property
        this.no_video = $(`<div id="no-video"></div>`)[0];
        this.trackList = [];
        this.tool = null;
        this.clip = null;

        this.curve = () => new Curve(this, this.viewport.current_track);
        this.rect = () => new Rect(this, this.viewport.current_track);
        this.text = () => new Text(this, this.viewport.current_track);

        this.$viewport = document.querySelector("#viewport");
        this.width = this.$viewport.offsetWidth;
        this.height = this.$viewport.offsetHeight;

        // DOM
        this.$playtime = {
            currentTime: document.querySelector("#play-time .current-time"),
            duration: document.querySelector("#play-time .duration")
        };
        this.$cliptime = {
            startTime: document.querySelector("#clip-time .start-time"),
            duration: document.querySelector("#clip-time .duration")
        }

        this.$cliplist = document.querySelector("#clip-list");
        this.$movies = document.querySelectorAll("#movie-list .movie");

        this.$tools = [
            document.querySelector("#curve-btn"),
            document.querySelector("#rect-btn"),
            document.querySelector("#text-btn"),
            document.querySelector("#select-btn"),
        ];

        this.$buttons = {
            play: document.querySelector("#play-btn"),
            pause: document.querySelector("#pause-btn"),
            all_del: document.querySelector("#alldel-btn"),
            select_del: document.querySelector("#seldel-btn"),
            download: document.querySelector("#download-btn"),
            merge: document.querySelector("#merge-btn"),
        };

        // Viewport
        this.viewport = new Viewport(this);


        // Process
        this.$viewport.append(this.no_video);
        this.event();
    }

    get color(){
        return document.querySelector("#color-input").value;
    }
    get lineWidth(){
        return document.querySelector("#width-input").value;
    }
    get fontSize(){
        return document.querySelector("#size-input").value;
    }

    unset(){
        this.clip = null;
    }

    event(){
        window.addEventListener("mousedown", e => {
            if(e.target !== this.$viewport || !this.tool || !this.viewport.current_track || e.which !== 1) return;
            this.viewport.pause();
            if(this.clip) return false;
            if(this.tool === "select") this.clip = this.viewport.select(e);
            else {
                this.clip = this[this.tool]();
                this.viewport.current_track.addClip(this.clip);
                this.clip.mousedown && this.clip.mousedown(e);
            }
        });

        window.addEventListener("mousemove", e => {
            if(!this.tool || !this.clip || !this.viewport.current_track || e.which !== 1) return;
            if(this.tool === "select") this.clip.selectMoveAll(e);
            else  this.clip.mousemove && this.clip.mousemove(e);
        });

        window.addEventListener("mouseup", e => {
            if(!this.tool || !this.clip || !this.viewport.current_track || e.which !== 1) return;
            this.clip.mouseup && this.clip.mouseup(e);
        });
        

        // 영화 선택하기
        this.$movies.forEach(movie => {
            movie.addEventListener("click", e => {
                this.no_video.remove();
                let id = e.target.dataset.id;
                let track = this.trackList.find(track => track.id === id);
                if(!track){
                    track = new Track(this, id);
                    this.trackList.push(track);
                }
                this.viewport.track = track;
            });
        })

        // 도구 선택
        const toolTrigger = e => {
            if(!this.viewport.current_track) return alert("동영상을 선택해주세요.");

            let exist = document.querySelector(".tool.active");
            exist && exist.classList.remove("active");
            e.target.classList.add("active");

            this.tool = e.target.dataset.name;
        };
        this.$tools.forEach(tool => {
            tool.addEventListener("click", toolTrigger);
        });

        // 재생 버튼
        this.$buttons.play.addEventListener("click", () => {
            if(this.viewport.current_track){
                this.viewport.play();
            }
        });

        // 정지 버튼
        this.$buttons.pause.addEventListener("click", () => {
            if(this.viewport.current_track){
                this.viewport.pause();
            }
        });

        // 전체 삭제
        this.$buttons.all_del.addEventListener("click", () => {
            this.viewport.current_track.deleteAll();
        });
        
        // 선택 삭제
        this.$buttons.select_del.addEventListener("click", () => {
            this.viewport.current_track.selectDelete();
        });
    }
}

window.addEventListener("load", () => {
    window.app = new App();
});