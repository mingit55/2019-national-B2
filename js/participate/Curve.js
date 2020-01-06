class Curve extends Clip {
    constructor(){
        super(...arguments);
        this.history = [];
    }

    selectDown(e){
        const {X, Y} = this.getXY(e);
        let mw = parseInt(this.lineWidth); // 오차 범위 mistake width

        let result = this.history.some(path => {
            let check_x = path[0] - mw <= X && X <= path[0] + mw;
            let check_y = path[1] - mw <= Y && Y <= path[1] + mw;
            return check_x && check_y;
        });
        if(result) {
            this.copy = Object.assign(this.history);
            this.pos = {x: X, y: Y};
        }

        return result;
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

    redraw(){
        if(this.history.length ===  0) return;
        if(this.active){
            this.ctx.strokeStyle = Clip.select_color;
            this.ctx.lineWidth = this.lineWidth * 3;

            this.ctx.beginPath();
            this.ctx.moveTo(this.history[0][0], this.history[0][1]);
            this.history.forEach(data => {
                this.ctx.lineTo(data[0], data[1]);
            });
            this.ctx.stroke();
        }

        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.lineWidth;

        this.ctx.beginPath();
        this.ctx.moveTo(this.history[0][0], this.history[0][1]);
        this.history.forEach(data => {
            this.ctx.lineTo(data[0], data[1]);
        });
        this.ctx.stroke();
        
    }
}