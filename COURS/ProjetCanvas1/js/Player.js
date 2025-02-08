import ObjectGraphique from "./ObjectGraphique.js";
import { drawCircleImmediat } from "./utils.js";

export default class Player extends ObjectGraphique {
    constructor(x, y) {
        super(x, y, 60, 95);
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
        ctx.fillRect(0, 54, 60, 7);
        ctx.fillStyle = "#914D03";
        ctx.fillRect(0, 61, 60, 10);

        // ceinture
        ctx.fillStyle = "black";
        ctx.fillRect(1.8, 64, 10.2, 2.5);
        ctx.fillStyle = "black";
        ctx.fillRect(16.2, 64, 10.2, 2.5);
        ctx.fillStyle = "black";
        ctx.fillRect(33, 64, 10.2, 2.5);
        ctx.fillStyle = "black";
        ctx.fillRect(48, 64, 10.2, 2.5);

        // Dessiner la cravate (losange rouge)
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.moveTo(30, 42); // Point supérieur
        ctx.lineTo(33, 54); // Point droit
        ctx.lineTo(30, 66); // Point inférieur
        ctx.lineTo(27, 54); // Point gauche
        ctx.closePath();
        ctx.fill();

        // tete du monstre
        ctx.fillStyle = "#F0EE0E";
        ctx.fillRect(0, 0, 60, 54);

        // Ajouter trous de l'éponge tailles variées à différents endroits
        ctx.fillStyle = "#C2C129";
        this.drawCircle(ctx, 3.6, 15, 3); // Petit cercle
        this.drawCircle(ctx, 6, 5.4, 4.8); // Cercle moyen
        this.drawCircle(ctx, 6, 42, 4.2); // Cercle moyen
        this.drawCircle(ctx, 54, 5.4, 3.6); // Cercle moyen
        this.drawCircle(ctx, 48, 42, 3.6); // Petit cercle
        this.drawCircle(ctx, 54, 33, 1.8); // Petit cercle

        // Dessiner la cravate (losange rouge)
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.moveTo(30, 54); // Point supérieur
        ctx.lineTo(34.8, 61.8); // Point droit
        ctx.lineTo(30, 66); // Point inférieur
        ctx.lineTo(25.2, 61.8); // Point gauche
        ctx.closePath();
        ctx.fill();
    }

    // Méthode pour dessiner la jambe gauche
    drawJambeGauche(ctx) {
        ctx.save();

        ctx.translate(18, 70);

        // la jambe gauche
        ctx.fillStyle = "#F0EE0E";
        ctx.fillRect(0, 0, 3, 18);

        // le pantelon jambe gauche
        ctx.fillStyle = "#914D03";
        ctx.fillRect(-3, 0, 9, 6);

        // la chaussette gauche
        ctx.fillStyle = "white";
        ctx.fillRect(0, 11.4, 3, 7.2);

        // la chaussure gauche
        ctx.fillStyle = "black";
        ctx.fillRect(-9, 18, 13.2, 6.6);

        ctx.restore();
    }

    // Méthode pour dessiner la jambe droite
    drawJambeDroite(ctx) {
        ctx.save();

        ctx.translate(36, 66);

        // la jambe droite
        ctx.fillStyle = "#F0EE0E";
        ctx.fillRect(3, 4.2, 3, 18);

        // le pantelon jambe droite
        ctx.fillStyle = "#914D03";
        ctx.fillRect(0.6, 3.6, 9, 6);

        // la chaussette jambe droite
        ctx.fillStyle = "white";
        ctx.fillRect(3, 15.6, 3, 7.2);

        // la chaussure droite
        ctx.fillStyle = "black";
        ctx.fillRect(0.9, 22.2, 13.2, 6.6);

        ctx.restore();
    }

    drawEyes(ctx) {
        drawCircleImmediat(ctx, 19.2, 19.2, 10.8, "white");
        drawCircleImmediat(ctx, 40.8, 19.2, 10.8, "white");
        // Contours des yeux
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(19.2, 19.2, 10.8, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(40.8, 19.2, 10.8, 0, 2 * Math.PI, false);
        ctx.stroke();

        // pupille
        drawCircleImmediat(ctx, 19.2, 19.2, 4.8, "skyblue");
        drawCircleImmediat(ctx, 40.8, 19.2, 4.8, "skyblue");
        //iris
        drawCircleImmediat(ctx, 19.2, 19.2, 3, "black");
        drawCircleImmediat(ctx, 40.8, 19.2, 3, "black");

        // Cils pour l'œil gauche
        ctx.beginPath();
        ctx.moveTo(12, 4.8);
        ctx.lineTo(14.4, 9);
        ctx.moveTo(19.2, 4.2);
        ctx.lineTo(19.2, 9);
        ctx.moveTo(26.4, 4.8);
        ctx.lineTo(24, 9);
        ctx.stroke();

        // Cils pour l'œil droit
        ctx.beginPath();
        ctx.moveTo(33.6, 4.8);
        ctx.lineTo(36, 9);
        ctx.moveTo(40.8, 4.2);
        ctx.lineTo(40.8, 9);
        ctx.moveTo(48, 4.8);
        ctx.lineTo(45.6, 9);
        ctx.stroke();
    }

    drawNose(ctx) {
        ctx.save();

        ctx.translate(30, 27);

        // on dessine le nez
        ctx.fillStyle = "#F0EE0E";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;

        // Dessiner le cercle plein
        ctx.beginPath();
        ctx.arc(0, 0, 4.2, 0, 2 * Math.PI, false);
        ctx.fill();

        // Dessiner le contour 
        ctx.beginPath();
        ctx.arc(0, 0, 4.2, 0, 0.5 * Math.PI, true);
        ctx.stroke();

        ctx.restore();
    }

    // Méthode pour dessiner un sourire
    drawSmile(ctx) {
        // Dessiner les dents
        ctx.fillStyle = "white";
        ctx.fillRect(19.8, 38.4, 7.8, 6); // Première dent
        ctx.fillRect(31.8, 38.4, 7.8, 6); // Deuxième dent

        // Ajouter un contour noir aux dents 
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;

        // Contour de la première dent
        ctx.beginPath();
        ctx.moveTo(19.8, 37.2);
        ctx.lineTo(19.8, 45);
        ctx.lineTo(27.6, 45);
        ctx.lineTo(27.6, 38.4);
        ctx.stroke();

        // Contour de la deuxième dent
        ctx.beginPath();
        ctx.moveTo(31.8, 38.4);
        ctx.lineTo(31.8, 45);
        ctx.lineTo(39.6, 45);
        ctx.lineTo(39.6, 37.8);
        ctx.stroke();

        // Dessiner le sourire
        ctx.beginPath();
        ctx.arc(30, 15, 24, Math.PI * 0.2, Math.PI * 0.8, false);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawBrasGauche(ctx) {
        ctx.save();

        ctx.translate(-6.9, 54);
        ctx.rotate(-1.5);

        // on dessine le bras gauche
        ctx.fillStyle = "#F0EE0E";
        ctx.fillRect(-24, 1.2, 24, 3);

        // on dessine l'avant bras gauche
        this.drawAvantBrasGauche(ctx);

        ctx.restore();
    }

    drawAvantBrasGauche(ctx) {
        ctx.save();

        ctx.translate(0, 0);

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 9, 6);

        ctx.restore();
    }

    drawBrasDroit(ctx) {
        ctx.save();

        ctx.translate(66, 42);
        ctx.rotate(1.5);

        // on dessine le bras droit
        ctx.fillStyle = "#F0EE0E";
        ctx.fillRect(12, 1.2, 24, 3);

        // on dessine l'avant bras droit
        this.drawAvantBrasDroit(ctx);

        ctx.restore();
    }

    drawAvantBrasDroit(ctx) {
        ctx.save();

        ctx.translate(0, 0);

        ctx.fillStyle = "white";
        ctx.fillRect(3, 0, 9, 6);

        ctx.restore();
    }

    move() {
        this.x += this.vitesseX;
        this.y += this.vitesseY;
    }
}