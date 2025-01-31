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
            ctx.drawImage(this.image, this.x, this.y, this.imageW, this.imageH);
        } else {
            ctx.fillStyle = this.image;
            ctx.fillRect(this.x, this.y, this.imageW, this.imageH);
        }
    }
}
