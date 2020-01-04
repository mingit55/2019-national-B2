class Text extends Clip {
    constructor(){
        super(...arguments);

        window.addEventListener("mousedown", () => {
            if(this.input) this.inputComplate();
        });
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
    }

    inputComplate = () => {
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
    }
}