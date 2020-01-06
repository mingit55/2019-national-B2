class Rect extends Clip {
    constructor(){
        super(...arguments);

        this.complate = false;
    }

    selectDown(e){
        if(!this.data) return false;

        const {X, Y} = this.getXY(e);
        const {x, y, w, h} = this.data;

        this.pos = {x: X - x, y: Y - y};

        return x <= X && X <= x + w && y <= Y && Y <= y + h;
    }

    selectMove(e){
        if(!this.pos) return;
        const {X, Y} = this.getXY(e);

        this.data.x = X - this.pos.x;
        this.data.y = Y - this.pos.y;
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

        if(this.data.w < 0) {
            this.data.w *= -1;
            this.data.x = this.cx - this.data.w;
        }
        if(this.data.h < 0){
            this.data.h *= -1;
            this.data.y = this.cy - this.data.h;
        }
    }

    mouseup(){
        this.app.unset();
        this.complate = true;
    }

    redraw(ctx){
        if(!this.data) return;

        const {x, y, w, h} = this.data;

        ctx.lineWidth = 5;
        ctx.strokeStyle = ctx.fillStyle = this.color;

        if(this.complate) ctx.fillRect(x, y, w, h);
        else ctx.strokeRect(x, y, w, h);

        if(this.active){
            ctx.strokeStyle = Clip.select_color;
            ctx.strokeRect(x, y, w, h);
        }
    }
}