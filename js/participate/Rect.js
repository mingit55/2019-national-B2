class Rect extends Clip {
    constructor(){
        super(...arguments);

        this.complate = false;
    }

    select(e){
        if(!this.data) return false;

        const {X, Y} = this.getXY(e);
        const {x, y, w, h} = this.data;

        console.log(x <= X && X <= x + w && y <= Y && Y <= y + h);
        return x <= X && X <= x + w && y <= Y && Y <= y + h;
    }

    mousedown(e){
        const {X, Y} = this.getXY(e);
        this.cx = X;
        this.cy = Y;
        this.data = { x: X, y: Y, w: 1, h: 1 };
    }

    mousemove(e){
        if(!this.data) return;

        const {X, Y} = this.getXY(e);
        
        this.data.w = X - this.cx;
        this.data.h = Y - this.cy;
    }

    mouseup(){
        this.app.unset();
        this.complate = true;
    }

    redraw(){
        if(!this.data) return;

        const {x, y, w, h} = this.data;

        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = this.ctx.fillStyle = this.color;

        if(this.complate) this.ctx.fillRect(x, y, w, h);
        else this.ctx.strokeRect(x, y, w, h);

        if(this.active){
            this.ctx.strokeStyle = Clip.select_color;
            this.ctx.strokeRect(x, y, w, h);
        }
    }
}