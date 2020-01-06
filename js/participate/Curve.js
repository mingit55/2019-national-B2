class Curve extends Clip {
    constructor(){
        super(...arguments);
        this.history = [];
    }

    selectDown(e){
        const {X, Y} = this.getXY(e);
        let mw = parseInt(this.lineWidth); // 오차 범위 mistake width
        
        this.copy = Object.assign(this.history);
        this.pos = {x: X, y: Y};

        return this.history.some(path => {
            let check_x = path[0] - mw <= X && X <= path[0] + mw;
            let check_y = path[1] - mw <= Y && Y <= path[1] + mw;
            return check_x && check_y;
        });
    }

    selectMove(e){
        if(!this.pos) return;
        const {X, Y} = this.getXY(e);

        let move_x = X - this.pos.x;
        let move_y = Y - this.pos.y;
        
        this.history = this.copy.map(path => [
            path[0] + move_x,  // X
            path[1] + move_y   // Y
        ]);
    }

    mousemove(e){
        const {X, Y} = this.getXY(e);
        this.history.push([X, Y]);
    }

    mouseup(){
        this.app.unset();
    }

    redraw(ctx){
        if(this.history.length ===  0) return;
        if(this.active){
            ctx.strokeStyle = Clip.select_color;
            ctx.lineWidth = this.lineWidth * 3;

            ctx.beginPath();
            ctx.moveTo(this.history[0][0], this.history[0][1]);
            this.history.forEach(data => {
                ctx.lineTo(data[0], data[1]);
            });
            ctx.stroke();
        }

        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;

        ctx.beginPath();
        ctx.moveTo(this.history[0][0], this.history[0][1]);
        this.history.forEach(data => {
            ctx.lineTo(data[0], data[1]);
        });
        ctx.stroke();
        
    }
}