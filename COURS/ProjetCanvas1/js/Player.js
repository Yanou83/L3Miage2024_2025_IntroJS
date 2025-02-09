import ObjectGraphique from "./ObjectGraphique.js";
import { drawCircleImmediat } from "./utils.js";

export default class Player extends ObjectGraphique {
    constructor(x, y) {
        super(x, y, 36, 57); // Slightly increased dimensions
        this.vitesseX = 0;
        this.vitesseY = 0;
        this.angle = 0;
        this.scaleFactor = 0.7;

        // Adapter la hitbox à la nouvelle taille
        this.w *= 0.75;
        this.h *= 0.75;
    }

    draw(ctx) {
        // Ici on dessine un monstre
        ctx.save();

        // on déplace le systeme de coordonnées pour placer
        // le monstre en x, y.Tous les ordres de dessin
        // dans cette fonction seront par rapport à ce repère
        // translaté
        ctx.translate(this.x, this.y);
        ctx.scale(this.scaleFactor, this.scaleFactor);
        ctx.rotate(this.angle);
        // on recentre le monstre. Par défaut le centre de rotation est dans le coin en haut à gauche
        // du rectangle, on décale de la demi largeur et de la demi hauteur pour 
        // que le centre de rotation soit au centre du rectangle.
        // Les coordonnées x, y du monstre sont donc au centre du rectangle....
        ctx.translate(-this.w / 2, -this.h / 2);
        //this.ctx.scale(0.5, 0.5);

        // corps
        this.drawBody(ctx);

        // yeux
        this.drawEyes(ctx);

        // nez
        this.drawNose(ctx);

        // sourire
        this.drawSmile(ctx);

        // Les bras
        this.drawBrasGauche(ctx);
        this.drawBrasDroit(ctx);

        // Les jambes
        this.drawJambeGauche(ctx);
        this.drawJambeDroite(ctx);

        // restore
        ctx.restore();

        // super.draw() dessine une croix à la position x, y
        // pour debug
        super.draw(ctx);
    }

    // Méthode pour dessiner un cercle
    drawCircle(ctx, x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    drawBody(ctx) {
        // corps
        ctx.fillStyle = "white";
        ctx.fillRect(0, 32, 36, 4.2);
        ctx.fillStyle = "#914D03";
        ctx.fillRect(0, 36.6, 36, 6);

        // ceinture
        ctx.fillStyle = "black";
        ctx.fillRect(1.08, 38.4, 6.12, 1.5);
        ctx.fillRect(9.72, 38.4, 6.12, 1.5);
        ctx.fillRect(19.8, 38.4, 6.12, 1.5);
        ctx.fillRect(28.8, 38.4, 6.12, 1.5);

        // Dessiner la cravate (losange rouge)
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.moveTo(18, 25.2); // Point supérieur
        ctx.lineTo(19.8, 32.4); // Point droit
        ctx.lineTo(18, 39.6); // Point inférieur
        ctx.lineTo(16.2, 32.4); // Point gauche
        ctx.closePath();
        ctx.fill();

        // tete du monstre
        ctx.fillStyle = "#F0EE0E";
        ctx.fillRect(0, 0, 36, 32);

        // Ajouter trous de l'éponge tailles variées à différents endroits
        ctx.fillStyle = "#C2C129";
        this.drawCircle(ctx, 2.16, 9, 1.8); // Petit cercle
        this.drawCircle(ctx, 3.6, 3.24, 2.88); // Cercle moyen
        this.drawCircle(ctx, 3.6, 25.2, 2.52); // Cercle moyen
        this.drawCircle(ctx, 32.4, 3.24, 2.16); // Cercle moyen
        this.drawCircle(ctx, 28.8, 25.2, 2.16); // Petit cercle
        this.drawCircle(ctx, 32.4, 19.8, 1.08); // Petit cercle
    }

    // Méthode pour dessiner la jambe gauche
    drawJambeGauche(ctx) {
        ctx.save();
        ctx.translate(10.8, 42);
        ctx.fillStyle = "#F0EE0E";
        ctx.fillRect(0, 0, 1.8, 10.8);
        ctx.fillStyle = "#914D03";
        ctx.fillRect(-1.8, 0, 5.4, 3.6);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 6.84, 1.8, 4.32);
        ctx.fillStyle = "black";
        ctx.fillRect(-5.4, 10.8, 7.92, 3.96);
        ctx.restore();
    }

    // Méthode pour dessiner la jambe droite
    drawJambeDroite(ctx) {
        ctx.save();
        ctx.translate(21.6, 39.6);
        ctx.fillStyle = "#F0EE0E";
        ctx.fillRect(1.8, 2.52, 1.8, 10.8);
        ctx.fillStyle = "#914D03";
        ctx.fillRect(0.36, 2.16, 5.4, 3.6);
        ctx.fillStyle = "white";
        ctx.fillRect(1.8, 9.36, 1.8, 4.32);
        ctx.fillStyle = "black";
        ctx.fillRect(0.54, 12.96, 7.92, 3.96);
        ctx.restore();
    }

    drawEyes(ctx) {
        drawCircleImmediat(ctx, 11.52, 11.52, 6.48, "white");
        drawCircleImmediat(ctx, 24.48, 11.52, 6.48, "white");
        // Contours des yeux
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.arc(11.52, 11.52, 6.48, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(24.48, 11.52, 6.48, 0, 2 * Math.PI, false);
        ctx.stroke();

        // pupille
        drawCircleImmediat(ctx, 11.52, 11.52, 2.88, "skyblue");
        drawCircleImmediat(ctx, 24.48, 11.52, 2.88, "skyblue");
        //iris
        drawCircleImmediat(ctx, 11.52, 11.52, 1.8, "black");
        drawCircleImmediat(ctx, 24.48, 11.52, 1.8, "black");

        // Cils pour l'œil gauche
        ctx.beginPath();
        ctx.moveTo(7.2, 2.88);
        ctx.lineTo(8.64, 5.4);
        ctx.moveTo(11.52, 2.52);
        ctx.lineTo(11.52, 5.4);
        ctx.moveTo(15.84, 2.88);
        ctx.lineTo(14.4, 5.4);
        ctx.stroke();

        // Cils pour l'œil droit
        ctx.beginPath();
        ctx.moveTo(20.16, 2.88);
        ctx.lineTo(21.6, 5.4);
        ctx.moveTo(24.48, 2.52);
        ctx.lineTo(24.48, 5.4);
        ctx.moveTo(28.8, 2.88);
        ctx.lineTo(27.36, 5.4);
        ctx.stroke();
    }

    drawNose(ctx) {
        ctx.save();

        ctx.translate(18, 16.2);

        // on dessine le nez
        ctx.fillStyle = "#F0EE0E";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.6;

        // Dessiner le cercle plein
        ctx.beginPath();
        ctx.arc(0, 0, 2.52, 0, 2 * Math.PI, false);
        ctx.fill();

        // Dessiner le contour 
        ctx.beginPath();
        ctx.arc(0, 0, 2.52, 0, 0.5 * Math.PI, true); 
        ctx.stroke();

        ctx.restore();
    }

    // Méthode pour dessiner un sourire
    drawSmile(ctx) {
        // Dessiner les dents
        ctx.fillStyle = "white";
        ctx.fillRect(11.88, 23.04, 4.68, 3.6); // Première dent
        ctx.fillRect(19.08, 23.04, 4.68, 3.6); // Deuxième dent

        // Ajouter un contour noir aux dents 
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.6;

        // Contour de la première dent
        ctx.beginPath();
        ctx.moveTo(11.88, 22.32); 
        ctx.lineTo(11.88, 27);
        ctx.lineTo(16.56, 27);
        ctx.lineTo(16.56, 23.04); 
        ctx.stroke();

        // Contour de la deuxième dent
        ctx.beginPath();
        ctx.moveTo(19.08, 23.04);
        ctx.lineTo(19.08, 27);
        ctx.lineTo(23.76, 27);
        ctx.lineTo(23.76, 22.68); 
        ctx.stroke();

        // Dessiner le sourire
        ctx.beginPath();
        ctx.arc(18, 9, 14.4, Math.PI * 0.2, Math.PI * 0.8, false); 
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1.2;
        ctx.stroke();
    }

    drawBrasGauche(ctx) {
        ctx.save();

        ctx.translate(-4.14, 32.4);
        ctx.rotate(-1.5);

        // on dessine le bras gauche
        ctx.fillStyle = "#F0EE0E";
        ctx.fillRect(-14.4, 0.72, 14.4, 1.8);

        // on dessine l'avant bras gauche
        this.drawAvantBrasGauche(ctx);

        ctx.restore();
    }

    drawAvantBrasGauche(ctx) {
        ctx.save();

        ctx.translate(0, 0);

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 5.4, 3.6);

        ctx.restore();
    }

    drawBrasDroit(ctx) {
        ctx.save();

        ctx.translate(39.6, 25.2);
        ctx.rotate(1.5);

        // on dessine le bras droit
        ctx.fillStyle = "#F0EE0E";
        ctx.fillRect(7.2, 0.72, 14.4, 1.8);

        // on dessine l'avant bras droit
        this.drawAvantBrasDroit(ctx);

        ctx.restore();
    }

    drawAvantBrasDroit(ctx) {
        ctx.save();

        ctx.translate(0, 0);

        ctx.fillStyle = "white";
        ctx.fillRect(1.8, 0, 5.4, 3.6);

        ctx.restore();
    }

    move() {
        this.x += this.vitesseX;
        this.y += this.vitesseY;
    }
}