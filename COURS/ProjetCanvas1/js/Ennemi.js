import ObjectGraphique from "./ObjectGraphique.js";

export default class Ennemi extends ObjectGraphique {
    constructor(x, y, w, h, direction, speed) {
        super(x, y, w, h);
        this.direction = direction; // 'x' or 'y'
        this.speed = speed;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}
