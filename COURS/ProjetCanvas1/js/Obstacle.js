import ObjectGraphique from "./ObjectGraphique.js";

export default class Obstacle extends ObjectGraphique {
    constructor(x, y, w, h, image) {
        super(x, y, w, h);
        this.image = image;
    }

    draw(ctx) {
        if (this.image instanceof Image) {
            ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
        } else {
            ctx.fillStyle = this.image;
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
    }
}