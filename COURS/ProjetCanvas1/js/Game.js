export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.keys = {};
        this.monsterX = 300;
        this.monsterY = 100;
    }

    async init(canvas) {
        this.ctx = this.canvas.getContext("2d");

        console.log("Game initialisé");

        // Load the background image
        this.backgroundImage = new Image();
        this.backgroundImage.src = "assets/images/fond_bobleponge.png";
        await new Promise((resolve) => {
            this.backgroundImage.onload = resolve;
        });

        // Add event listeners for keyboard input
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    start() {
        console.log("Game démarré");

        //this.drawGrid(10, 10, "red", 5);

        // on dessine un rectangle rouge (la couleur = syntaxe CSS)
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(10, 10, 100, 100);

        // on dessine un rectangle vert
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(120, 10, 150, 10);
        this.ctx.fillRect(120, 100, 10, 150);

        // utilsation de la fonction drawCircleImmediat
        this.drawCircleImmediat(500, 200, 200, "blue");

        // un rectangle en fil de fer, on remplac "fill" par "stroke"
        this.ctx.strokeStyle = "blue";
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(10, 120, 100, 100);

        // un arc de cercle, nous ne sommes plus en mode "direct"
        // mais en mode "bufferise" ou comme le nomme l'API
        // en mode "path"

        this.ctx.beginPath();
        this.ctx.arc(200, 200, 50, 0, Math.PI * 2);
        // un autre cercle plus petit, mais de 0 à PI seulement 
        this.ctx.arc(500, 200, 40, 0, Math.PI);

        // Pour ordonner le dessin, utilise la méthode
        // ctx.fill() ou ctx.stroke() qui dessineront tout
        // ce qui est bufferise (c'est à dire "dans le path/chemin");
        this.ctx.fill();
        this.ctx.stroke();

        // Même exemple mais avec deux cercles "bien séparés", pour cela
        // il faut utiliser beginPath() pour "vider" le path entre
        // les deux dessins
        this.ctx.fillStyle = "yellow";

        this.ctx.beginPath();
        this.ctx.arc(200, 100, 50, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(500, 400, 40, 0, Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.stroke();

        // dessine le monstre (le joueur)
        this.drawMonstre(this.monsterX, this.monsterY);

        // On démarre une animation à 60 images par seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    mainAnimationLoop() {
        // 1 - on efface le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the background image
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);

        // 2 - on dessine les objets à animer dans le jeu
        // ici on dessine le monstre
        this.update();
        this.drawMonstre(this.monsterX, this.monsterY);

        // 3 - On regarde l'état du clavier, manette, souris et on met à jour
        // l'état des objets du jeu en conséquence
        //this.update();

        // 4 - on demande au navigateur d'appeler la fonction mainAnimationLoop
        // à nouveau dans 1/60 de seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    update() {
        // Update monster position based on keys pressed
        if (this.keys["ArrowUp"]) this.monsterY -= 5;
        if (this.keys["ArrowDown"]) this.monsterY += 5;
        if (this.keys["ArrowLeft"]) this.monsterX -= 5;
        if (this.keys["ArrowRight"]) this.monsterX += 5;

        // Ensure the monster stays within the canvas bounds
        if (this.monsterX < 0) this.monsterX = 0;
        if (this.monsterX > this.canvas.width - 100) this.monsterX = this.canvas.width - 100;
        if (this.monsterY < 0) this.monsterY = 0;
        if (this.monsterY > this.canvas.height - 160) this.monsterY = this.canvas.height - 160; // Adjusted for shoe height
    }

    handleKeyDown(e) {
        this.keys[e.key] = true;
    }

    handleKeyUp(e) {
        this.keys[e.key] = false;
    }

    drawCircleImmediat(x, y, r, color) {
        // BONNE PRATIQUE : on sauvegarde le contexte
        // des qu'une fonction ou un bout de code le modifie
        // couleur, épaisseur du trait, systeme de coordonnées etc.
        this.ctx.save();

        // AUTRE BONNE PRATIQUE : on dessine toujours
        // en 0, 0 !!!! et on utilise les transformations
        // géométriques pour placer le dessin, le tourner, le rescaler
        // etc.
        this.ctx.fillStyle = color;
        this.ctx.beginPath();

        // on translate le systeme de coordonnées pour placer le cercle
        // en x, y
        this.ctx.translate(x, y);
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fill();

        // on restore le contexte à la fin
        this.ctx.restore();
    }

    drawGrid(nbLignes, nbColonnes, couleur, largeurLignes) {
        // dessine une grille de lignes verticales et horizontales
        // de couleur couleur
        this.ctx.save();

        this.ctx.strokeStyle = couleur;
        this.ctx.lineWidth = largeurLignes;

        let largeurColonnes = this.canvas.width / nbColonnes;
        let hauteurLignes = this.canvas.height / nbLignes;

        this.ctx.beginPath();

        // on dessine les lignes verticales
        for (let i = 1; i < nbColonnes; i++) {
            this.ctx.moveTo(i * largeurColonnes, 0);
            this.ctx.lineTo(i * largeurColonnes, this.canvas.height);
        }

        // on dessine les lignes horizontales
        for (let i = 1; i < nbLignes; i++) {
            this.ctx.moveTo(0, i * hauteurLignes);
            this.ctx.lineTo(this.canvas.width, i * hauteurLignes);
        }

        // gpu call pour dessiner d'un coup toutes les lignes
        this.ctx.stroke();

        this.ctx.restore();
    }

    drawMonstre(x, y) {
        // Ici on dessine un monstre
        this.ctx.save();

        // on déplace le systeme de coordonnées pour placer
        // le monstre en x, y.Tous les ordres de dessin
        // dans cette fonction seront par rapport à ce repère
        // translaté
        this.ctx.translate(x, y);
        //this.ctx.rotate(0.3);
        //this.ctx.scale(0.5, 0.5);

        // corps
        this.drawBody();


        // yeux
        this.drawEyes();

        // nez
        this.drawNose();

        // sourire
        this.drawSmile();

        // Les bras
        this.drawBrasGauche();
        this.drawBrasDroit();

        // Les jambes
        this.drawJambeGauche();
        this.drawJambeDroite();

        // restore
        this.ctx.restore();
    }

    // Méthode pour dessiner un cercle
    drawCircle(x, y, radius) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.ctx.fill();
    }

    drawBody() {
        // corps
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 90, 100, 12);
        this.ctx.fillStyle = "#914D03";
        this.ctx.fillRect(0, 102, 100, 15);

        // ceinture
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(3, 107, 17, 4);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(27, 107, 17, 4);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(55, 107, 17, 4);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(80, 107, 17, 4);


        // Dessiner la cravate (losange rouge)
        this.ctx.fillStyle = "red";
        this.ctx.beginPath();
        this.ctx.moveTo(50, 70); // Point supérieur
        this.ctx.lineTo(55, 90); // Point droit
        this.ctx.lineTo(50, 110); // Point inférieur
        this.ctx.lineTo(45, 90); // Point gauche
        this.ctx.closePath();
        this.ctx.fill();

        // tete du monstre
        this.ctx.fillStyle = "#F0EE0E";
        this.ctx.fillRect(0, 0, 100, 90);

        // Ajouter quelques cercles noirs de tailles variées à différents endroits
        this.ctx.fillStyle = "#C2C129";
        this.drawCircle(6, 25, 5); // Petit cercle
        this.drawCircle(10, 9, 8); // Cercle moyen
        this.drawCircle(10, 70, 7); // Cercle moyen
        this.drawCircle(90, 9, 6); // Cercle moyen
        this.drawCircle(80, 70, 6); // Petit cercle
        this.drawCircle(90, 55, 3); // Petit cercle


        // Dessiner la cravate (losange rouge)
        this.ctx.fillStyle = "red";
        this.ctx.beginPath();
        this.ctx.moveTo(50, 90); // Point supérieur
        this.ctx.lineTo(58, 103); // Point droit
        this.ctx.lineTo(50, 110); // Point inférieur
        this.ctx.lineTo(42, 103); // Point gauche
        this.ctx.closePath();
        this.ctx.fill();
    }


    // Méthode pour dessiner la jambe gauche
    drawJambeGauche() {
        this.ctx.save();

        this.ctx.translate(30, 117);

        // la jambe gauche
        this.ctx.fillStyle = "#F0EE0E";
        this.ctx.fillRect(0, 0, 5, 30);

        // le pantelon jambe gauche
        this.ctx.fillStyle = "#914D03";
        this.ctx.fillRect(-5, 0, 15, 10);

        // la chaussette gauche
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 19, 5, 12);

        // la chaussure gauche
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(-15, 30, 22, 11);

        this.ctx.restore();
    }

    // Méthode pour dessiner la jambe droite
    drawJambeDroite() {
        this.ctx.save();

        this.ctx.translate(60, 110);

        // la jambe droite
        this.ctx.fillStyle = "#F0EE0E";
        this.ctx.fillRect(5, 7, 5, 30);

        // le pantelon jambe droite
        this.ctx.fillStyle = "#914D03";
        this.ctx.fillRect(1, 6, 15, 10);

        // la chaussette jambe droite
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(5, 26, 5, 12);

        // la chaussure droite
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(1.5, 37, 22, 11);

        this.ctx.restore();
    }


    drawEyes() {
        this.drawCircleImmediat(32, 32, 18, "white");
        this.drawCircleImmediat(68, 32, 18, "white");
        // Contours des yeux
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        this.ctx.arc(32, 32, 18, 0, 2 * Math.PI, false);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(68, 32, 18, 0, 2 * Math.PI, false);
        this.ctx.stroke();

        // pupille
        this.drawCircleImmediat(32, 32, 8, "skyblue");
        this.drawCircleImmediat(68, 32, 8, "skyblue");
        //iris
        this.drawCircleImmediat(32, 32, 5, "black");
        this.drawCircleImmediat(68, 32, 5, "black");


        // Cils pour l'œil gauche
        this.ctx.beginPath();
        this.ctx.moveTo(20, 8);
        this.ctx.lineTo(24, 15);
        this.ctx.moveTo(32, 7);
        this.ctx.lineTo(32, 15);
        this.ctx.moveTo(44, 8);
        this.ctx.lineTo(40, 15);
        this.ctx.stroke();

        // Cils pour l'œil droit
        this.ctx.beginPath();
        this.ctx.moveTo(56, 8);
        this.ctx.lineTo(60, 15);
        this.ctx.moveTo(68, 7);
        this.ctx.lineTo(68, 15);
        this.ctx.moveTo(80, 8);
        this.ctx.lineTo(76, 15);
        this.ctx.stroke();
    }

    drawNose() {
        this.ctx.save();

        this.ctx.translate(50, 45);

        // on dessine le nez
        this.ctx.fillStyle = "#F0EE0E";
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1;

        // Dessiner le cercle plein
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 7, 0, 2 * Math.PI, false); // Cercle complet avec un rayon de 5
        this.ctx.fill();

        // Dessiner le contour sans la partie basse
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 7, 0, 0.5 * Math.PI, true); // Demi-cercle ouvert en bas avec un rayon de 5
        this.ctx.stroke();

        this.ctx.restore();
    }


    // Méthode pour dessiner un sourire
    drawSmile() {
        // Dessiner les dents
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(33, 64, 13, 10); // Première dent
        this.ctx.fillRect(53, 64, 13, 10); // Deuxième dent

        // Ajouter un contour noir aux dents sans la partie haute
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1;

        // Contour de la première dent
        this.ctx.beginPath();
        this.ctx.moveTo(33, 62); // Légèrement plus haut
        this.ctx.lineTo(33, 75);
        this.ctx.lineTo(46, 75);
        this.ctx.lineTo(46, 64); // Légèrement plus haut
        this.ctx.stroke();

        // Contour de la deuxième dent
        this.ctx.beginPath();
        this.ctx.moveTo(53, 64); // Légèrement plus haut
        this.ctx.lineTo(53, 75);
        this.ctx.lineTo(66, 75);
        this.ctx.lineTo(66, 63); // Légèrement plus haut
        this.ctx.stroke();

        // Dessiner le sourire
        this.ctx.beginPath();
        this.ctx.arc(50, 25, 40, Math.PI * 0.2, Math.PI * 0.8, false); // Bouche moins grande et moins incurvée
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    drawBrasGauche() {
        this.ctx.save();

        this.ctx.translate(-11.5, 90);
        this.ctx.rotate(-1.5);

        // on dessine le bras gauche
        this.ctx.fillStyle = "#F0EE0E";
        this.ctx.fillRect(-40, 2, 40, 5);

        // on dessine l'avant bras gauche
        this.drawAvantBrasGauche();

        this.ctx.restore();
    }

    drawAvantBrasGauche() {
        this.ctx.save();

        this.ctx.translate(0, 0);

        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, 15, 10);

        this.ctx.restore();
    }

    drawBrasDroit() {
        this.ctx.save();

        this.ctx.translate(110, 70);
        this.ctx.rotate(1.5);

        // on dessine le bras droit
        this.ctx.fillStyle = "#F0EE0E";
        this.ctx.fillRect(20, 2, 40, 5);

        // on dessine l'avant bras droit
        this.drawAvantBrasDroit();

        this.ctx.restore();
    }

    drawAvantBrasDroit() {
        this.ctx.save();

        this.ctx.translate(0, 0);

        this.ctx.fillStyle = "white";
        this.ctx.fillRect(5, 0, 15, 10);

        this.ctx.restore();
    }

}