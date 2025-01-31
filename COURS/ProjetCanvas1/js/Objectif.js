import ObjectGraphique from "./ObjectGraphique.js";

export default class Objectif extends ObjectGraphique {
    constructor(x, y, w, h, image, imageW, imageH) {
        super(x, y, w, h);
        this.image = image;
        this.imageW = imageW;
        this.imageH = imageH;
    }

    draw(ctx) {
        if (this.image instanceof Image) {
            const offsetX = (this.imageW - this.w) / 2;
            const offsetY = (this.imageH - this.h) / 2;
            
            ctx.drawImage(this.image, this.x - offsetX, this.y - offsetY, this.imageW, this.imageH);
        } else {
            ctx.fillStyle = this.image;
            ctx.fillRect(this.x, this.y, this.imageW, this.imageH);
        }
    }    
}
