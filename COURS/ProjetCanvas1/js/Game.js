import Player from "./Player.js";
import Obstacle from "./Obstacle.js";
import ObjetSouris from "./ObjetSouris.js";
import Objectif from "./Objectif.js";
import { rectsOverlap } from "./collisions.js";
import { initListeners } from "./ecouteurs.js";

export default class Game {
    objetsGraphiques = [];
    gameWon = false;

    constructor(canvas) {
        this.canvas = canvas;
        // etat du clavier
        this.inputStates = {
            mouseX: 0,
            mouseY: 0,
        };
    }

    async init(level = 'niveau/niveau1.json') {
        this.ctx = this.canvas.getContext("2d");

        this.player = new Player(100, 100);
        this.objetsGraphiques.push(this.player);

        // Un objert qui suite la souris, juste pour tester
        this.objetSouris = new ObjetSouris(200, 200, 25, 25, "transparent");
        this.objetsGraphiques.push(this.objetSouris);

        // Charger les obstacles et l'objectif depuis un fichier JSON
        await this.loadLevel(level);

        // On initialise les écouteurs de touches, souris, etc.
        initListeners(this.inputStates, this.canvas);

        console.log("Game initialisé");
    }

    async loadLevel(levelPath) {
        const response = await fetch(levelPath);
        const levelData = await response.json();

        const coralImage = new Image();
        coralImage.src = 'assets/images/corail.png';
        await new Promise(resolve => coralImage.onload = resolve);

        levelData.obstacles.forEach(obstacleData => {
            for (let i = 0; i < obstacleData.count; i++) {
                let x = obstacleData.x + (obstacleData.orientation === 'horizontal' ? i * 40 : 0);
                let y = obstacleData.y + (obstacleData.orientation === 'vertical' ? i * 40 : 0);
                let obstacle = new Obstacle(x, y, 40, 40, coralImage);
                this.objetsGraphiques.push(obstacle);
            }
        });

        // Ajouter l'objectif
        const objectifImage = new Image();
        objectifImage.src = 'assets/images/ananas.png';
        await new Promise(resolve => objectifImage.onload = resolve);

        const objectifData = levelData.objectif;
        this.objectif = new Objectif(objectifData.x, objectifData.y, objectifData.w, objectifData.h, objectifImage, objectifData.w * 2.8, objectifData.h * 2.8);
        this.objetsGraphiques.push(this.objectif);
    }

    start() {
        console.log("Game démarré");

        // On démarre une animation à 60 images par seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    mainAnimationLoop() {
        // 1 - on efface le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 2 - on dessine les objets à animer dans le jeu
        // ici on dessine le monstre
        this.drawAllObjects();

        // 3 - On regarde l'état du clavier, manette, souris et on met à jour
        // l'état des objets du jeu en conséquence
        this.update();

        // 4 - on demande au navigateur d'appeler la fonction mainAnimationLoop
        // à nouveau dans 1/60 de seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    drawAllObjects() {
        // Dessine tous les objets du jeu
        this.objetsGraphiques.forEach(obj => {
            obj.draw(this.ctx);
        });
    }

    update() {
        // Appelée par mainAnimationLoop
        // donc tous les 1/60 de seconde
        
        // Déplacement du joueur. 
        if (!this.gameWon) {
            this.movePlayer();
        }

        // on met à jouer la position de objetSouris avec la position de la souris
        // Pour un objet qui "suit" la souris mais avec un temps de retard, voir l'exemple
        // du projet "charQuiTire" dans le dossier COURS
        this.objetSouris.x = this.inputStates.mouseX;
        this.objetSouris.y = this.inputStates.mouseY;

        // On regarde si le joueur a atteint la sortie
        this.checkVictory();
    }

    movePlayer() {
        this.player.vitesseX = 0;
        this.player.vitesseY = 0;
        
        if(this.inputStates.ArrowRight) {
            this.player.vitesseX = 3;
        } 
        if(this.inputStates.ArrowLeft) {
            this.player.vitesseX = -3;
        } 

        if(this.inputStates.ArrowUp) {
            this.player.vitesseY = -3;
        } 

        if(this.inputStates.ArrowDown) {
            this.player.vitesseY = 3;
        } 

        this.player.move();

        this.testCollisionsPlayer();
    }

    testCollisionsPlayer() {
        // Teste collision avec les bords du canvas
        this.testCollisionPlayerBordsEcran();

        // Teste collision avec les obstacles
        this.testCollisionPlayerObstacles();
       
    }

    testCollisionPlayerBordsEcran() {
        // Raoppel : le x, y du joueur est en son centre, pas dans le coin en haut à gauche!
        if(this.player.x - this.player.w/2 < 0) {
            // On stoppe le joueur
            this.player.vitesseX = 0;
            // on le remet au point de contaxct
            this.player.x = this.player.w/2;
        }
        if(this.player.x + this.player.w/2 > this.canvas.width) {
            this.player.vitesseX = 0;
            // on le remet au point de contact
            this.player.x = this.canvas.width - this.player.w/2;
        }

        if(this.player.y - this.player.h/2 < 0) {
            this.player.y = this.player.h/2;
            this.player.vitesseY = 0;

        }
       
        if(this.player.y + this.player.h/2 > this.canvas.height) {
            this.player.vitesseY = 0;
            this.player.y = this.canvas.height - this.player.h/2;
        }
    }

    testCollisionPlayerObstacles() {
        this.objetsGraphiques.forEach(obj => {
            if(obj instanceof Obstacle) {
                if(rectsOverlap(this.player.x-this.player.w/2, this.player.y - this.player.h/2, this.player.w, this.player.h, obj.x, obj.y, obj.w, obj.h)) {
                    // collision

                    // ICI TEST BASIQUE QUI ARRETE LE JOUEUR EN CAS DE COLLIION.
                    // SI ON VOULAIT FAIRE MIEUX, ON POURRAIT PAR EXEMPLE REGARDER OU EST LE JOUEUR
                    // PAR RAPPORT A L'obstacle courant : il est à droite si son x est plus grand que le x de l'obstacle + la largeur de l'obstacle
                    // il est à gauche si son x + sa largeur est plus petit que le x de l'obstacle
                    // etc.
                    // Dans ce cas on pourrait savoir comment le joueur est entré en collision avec l'obstacle et réagir en conséquence
                    // par exemple en le repoussant dans la direction opposée à celle de l'obstacle...
                    // Là par défaut on le renvoie en x=10 y=10 et on l'arrête
                    console.log("Collision avec obstacle");
                    this.player.x = 10;
                    this.player.y = 10;
                    this.player.vitesseX = 0;
                    this.player.vitesseY = 0;
                }
            }
        });
    }

    checkVictory() {
        if (rectsOverlap(this.player.x - this.player.w / 2, this.player.y - this.player.h / 2, this.player.w, this.player.h, this.objectif.x, this.objectif.y, this.objectif.w, this.objectif.h)) {
            this.showVictoryPopup();
            this.player.vitesseX = 0;
            this.player.vitesseY = 0;
            this.gameWon = true;
        }
    }

    showVictoryPopup() {
        const popup = document.createElement('div');
        popup.className = 'victory-popup';
        popup.innerHTML = 'Félicitations ! Tu as remporté le niveau 1<br><button id="next-level-btn">Aller au niveau 2</button>';
        document.body.appendChild(popup);

        document.getElementById('next-level-btn').addEventListener('click', () => {
            popup.remove();
            this.loadNextLevel();
        });
    }

    async loadNextLevel() {
        this.objetsGraphiques = [];
        this.gameWon = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
        await this.init('niveau/niveau2.json');
        this.start();
    }
}