import ObjectGraphique from "./ObjectGraphique.js";

export default class Ennemi extends ObjectGraphique {
    constructor(x, y, w, h, direction = "horizontal", speed = 2) {
        super(x, y, w, h);
        this.direction = direction; // "horizontal" ou "vertical"
        this.speed = speed;
        this.vitesseX = direction === "horizontal" ? speed : 0;
        this.vitesseY = direction === "vertical" ? speed : 0;

        // Charger l'image de Plankton
        this.image = new Image();
        this.image.src = "assets/images/plankton.png";
    }

    update(canvas) {
        // Déplacement de l'ennemi
        this.x += this.vitesseX;
        this.y += this.vitesseY;

        // Détection des collisions avec les bords du canvas
        if (this.direction === "horizontal") {
            if (this.x <= 0 || this.x + this.w >= canvas.width) {
                this.vitesseX *= -1; // Inverser la direction
            }
        } else {
            if (this.y <= 0 || this.y + this.h >= canvas.height) {
                this.vitesseY *= -1; // Inverser la direction
            }
        }
    }

    draw(ctx) {
        const scaleFactor = 1.2; // Augmente la taille de Plankton de 50%
        const drawWidth = this.w * scaleFactor;
        const drawHeight = this.h * scaleFactor;
        const drawX = this.x - (drawWidth - this.w) / 2; // Centrer l'image
        const drawY = this.y - (drawHeight - this.h) / 2;
    
        if (this.image.complete) { 
            ctx.save();
            ctx.translate(drawX + drawWidth / 2, drawY + drawHeight / 2); // Centrer la transformation
    
            if (this.vitesseX < 0) {
                ctx.scale(-1, 1); // Retourner horizontalement si l'ennemi va à gauche
            }
    
            ctx.drawImage(this.image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
            ctx.restore();
        } else {
            ctx.fillStyle = "red";
            ctx.fillRect(drawX, drawY, drawWidth, drawHeight);
        }
    }
    

    checkCollisionsWithObstacles(obstacles) {
        obstacles.forEach(obstacle => {
            if (this.collidesWith(obstacle)) {
                // Si l'ennemi se déplace horizontalement, inverser vitesseX
                if (this.vitesseX !== 0) {
                    this.vitesseX *= -1;
                    this.x += this.vitesseX; // Évite que l'ennemi reste bloqué
                }
                // Si l'ennemi se déplace verticalement, inverser vitesseY
                if (this.vitesseY !== 0) {
                    this.vitesseY *= -1;
                    this.y += this.vitesseY; // Évite que l'ennemi reste bloqué
                }
            }
        });
    }

    // Méthode pour tester la collision entre l'ennemi et un obstacle
    collidesWith(obstacle) {
        return (
            this.x < obstacle.x + obstacle.w &&
            this.x + this.w > obstacle.x &&
            this.y < obstacle.y + obstacle.h &&
            this.y + this.h > obstacle.y
        );
    }

}
