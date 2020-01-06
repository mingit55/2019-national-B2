class Text extends Clip {
    constructor(){
        super(...arguments);

        // 마우스 다운시 $input이 존재하면 텍스트 완성으로 인식
        window.addEventListener("mousedown", () => {
            if(this.input) this.inputComplate();
        });
    }

    getPosition(){
        if(!this.measure) return;
        let {actualBoundingBoxAscent, actualBoundingBoxDescent} = this.measure;

        let w = this.measure.width;
        let h = parseInt(this.font) + actualBoundingBoxAscent + actualBoundingBoxDescent;
        let x = this.data.x;
        let y = this.data.y - parseInt(this.font);
    
        return {w: w, h: h, x: x, y: y};
    }

    selectDown(e){
        if(!this.data) return;

        const {X, Y} = this.getXY(e);
        const {x, y, w, h} = this.getPosition();

        let result = x <= X && X <= x + w && y <= Y && Y <= y + h;
        if(result){
            this.pos = {x: X - x, y: Y - y};
        }

        return result;
    }

    selectMove(e){
        const {X, Y} = this.getXY(e);

        this.data.x = X - this.pos.x;
        this.data.y = Y - this.pos.y;
    }
    
    mousedown(e){
        const {X, Y} = this.getXY(e);

        let input = this.input = document.createElement("input");
        input.style.left = X + "px";
        input.style.top = Y + "px";
        input.style.font = this.font;
        input.style.color = this.color;

        this.app.$viewport.append(input);
    
        input.addEventListener("keydown", e => e.keyCode === 13 && inputComplate());
    }

    mouseup(){
        if(this.input) this.input.focus();
        if(this.active) this.app.unset();
    }

    inputComplate(){
        this.ctx.font = this.font;
        this.measure = this.ctx.measureText(this.input.value);

        this.data = {
            x: this.input.offsetLeft,
            y: this.input.offsetTop + this.input.offsetHeight,
            text: this.input.value
        };

        this.app.unset();
        this.input.remove();
        this.input = null;
    };

    redraw(){
        if(!this.data) return;

        const {x, y, text} = this.data;
        this.ctx.fillStyle = this.color;
        this.ctx.font = this.font;
        this.ctx.fillText(text, x, y);    

        if(this.active){
            const {x, y, w, h} = this.getPosition();
            this.ctx.strokeStyle = Clip.select_color;
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x, y, w, h);
        }
    }
}