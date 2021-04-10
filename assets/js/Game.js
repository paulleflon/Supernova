/**
 * Représente les données d'une partie de Supernova
 * @class
 */
class Game {
	/**
	 * @param {string} skin Le skin à utiliser pendant cette partie
	 */
	constructor(skin) {
		/**
		  * Tableau contenant les pièces affichées dans la partie
		  * @type {Coin[]}
		  */
		this.coins = [];

		/**
		 * L'élément DOM dans lequel la partie est affichée
		 * @type {HTMLElement}
		 */
		this.container = getId('game');

		/**
		 * Le timestamp de la dernière pression sur la touche Shift. 
		 * 
		 * Sert à calculer la stat `speedTime` (Temps passé en accélération)
		 * @type {?number}
		 */
		this.lastShiftPress = null;

		/**
		 * Boucle (setInterval) de la partie
		 * @type {number}
		 */
		// Le type est number car la fonction setInterval retourne un nombre, l'ID de l'interval
		// Cet ID sert à stoppper l'interval avec clearInterval
		this.loop = undefined;

		/**
		 * Tableau contenant les obstacles affichés dans la partie
		 * @type {Obstacle[]}
		 */
		this.obstacles = [];

		/**
		 * Représente le personnage jouable durant la partie
		 * @type {Player}
		 */
		this.player = new Player(skin, this.container);

		/**
		 * Le score atteint
		 * @type {number}
		 */
		this.score = 0;

		/**
		 * Le skin utilisé dans cette partie
		 * @type {string}
		 */
		this.skin = skin;

		/**
		 * La vitesse des obstacles à l'écran
		 * @type {number}
		 */
		this.speed = 10;

		/**
		 * Timestamp correspondant au moment où la partie a commencé.
		 * 
		 * Sert à calculer la stat `gameTime` (Temps de jeu)
		 * @type {number}
		 */
		this.startedAt = Date.now();

		/**
		 * Les statistiques de cette partie
		 * @type {GameStats}
		 */
		this.stats = new GameStats();
	}

	/**
	 * Réinitialise les valeurs affichées dans le container de la partie 
	 */
	resetDisplay() {
		const highscore = parseInt(localStorage.getItem('stat.highestScore'));
		if (highscore)
			getId('highscore').innerText = highscore;
		else
			getId('highscore').innerText = '';

		this.container.style.background = `url(assets/img/sprites/${this.skin}/background.png) center center / cover`;
		getId('coin-icon').style.backgroundImage = `url(assets/img/sprites/${this.skin}/coin_1.png)`;
		getId('coins-count').innerText = '000';
		getId('endgame-screen').classList.remove('displayed');
		switchSection('game');
		// Pour que la transition (fondu/glissemnt) s'affiche correctement, on doit retirer la classe hidden 
		// Après l'affichage de la section game. Le timeout, même avec une durée "nulle" le permet
		// Sans ce timeout, les scores s'affichent sans transition
		setTimeout(() => getId('scores').classList.remove('hidden'), 0);
	}

	/**
	 * EventListener dédié au calcul du temps durant lequel la touche Shift a été pressée
	 * @param {KeyboardEvent} e L'événement clavier 
	 */
	shiftTimeHandler(e) {
		if (e.type === 'keydown' && e.key === 'Shift')
			this.lastShiftPress = Date.now();
		if (e.type === 'keyup' && e.key === 'Shift' && this.lastShiftPress)
			this.stats.speedTime += Date.now() - this.lastShiftPress;
	}

	/**
	 * Lance une partie de Supernova
	 */
	start() {
		this.resetDisplay();
		GameAudio.playMusic('game');
		this.player.display();
		// Function.call permet d'appeler une fonction en précisant la valeur de son `this` puis les arguments à lui passer
		// Lorsqu'une fonction est utilisée pour gérer un événement, le this est remplacé par l'élément dans lequel l'événement s'est produit
		// (Ici, l'object `document`). L'usage de call nous permet donc de remplacer le this par notre instance de Game. 
		document.body.addEventListener('keydown', (e) => this.shiftTimeHandler.call(this, e), true);
		document.body.addEventListener('keyup', (e) => this.shiftTimeHandler.call(this, e), true);

		let frameCount = 0;
		let obstacleRate = 30;
		this.loop = setInterval(() => {
			if (++frameCount % 5 === 0)
				getId('currentscore').innerText = ++this.score;

			if (frameCount % obstacleRate === 0) {
				const obstacle = new Obstacle(this.skin, this.speed, this.container);
				this.obstacles.push(obstacle);
				obstacle.display();
				this.stats.obstaclesCount += 1;
				this.speed += 0.05;
			}
			if (frameCount % 500 === 0 && obstacleRate > 3)
				obstacleRate -= 3;

			if (frameCount % 50 === 0) {
				const coin = new Coin(this.skin, this.container);
				this.coins.push(coin);
				coin.display(this.container);
			}
			this.player.update();
			this.updateObstacles();
			this.updateCoins();
		}, 16);
	}


	/**
	 * Met à jour l'état des pièces 
	 */
	updateCoins() {
		this.coins.forEach((coin, index) => {
			coin.update();
			if (coin.testCollision(this.player)) {
				coin.take();
				getId('coins-count').innerText = zero(++this.stats.coinCount, 3);
				this.coins.splice(index, 1);
			}
			if (coin.x + coin.width < 0) {
				coin.img.remove();
				this.stats.missedCoins++;
				// Array#shift supprime le premier élément de la liste
				// La première pièce de la liste est celle arrivée le plus tôt dans la liste
				// Ainsi, c'est aussi la première à sortir de l'écran
				// Donc on n'a pas besoin de spécifier l'index de l'élément à supprimer de la liste
				// On sait que c'est le premier
				this.coins.shift();
			}
		});
	}

	/**
	 * Met à jour l'état des obstacles 
	 */
	updateObstacles() {
		this.obstacles.forEach((obstacle, index) => {
			obstacle.update();
			if (obstacle.x + obstacle.width < 0) {
				obstacle.remove();
				// Même logique que pour les pièces
				this.obstacles.shift();
			}
			if (obstacle.testCollision(this.player)) {
				this.obstacles.splice(index, 1);
				obstacle.explode();
				this.lose();
			}
		});
	}

	/**
	 * Met à jour l'affichage et les données de sauvegarde à la perte de la partie
	 */
	lose() {
		clearInterval(this.loop);
		document.body.removeEventListener('keydown', this.shiftTimeHandler, true);
		document.body.removeEventListener('keyup', this.shiftTimeHandler, true);
		this.player.fall();
		this.stats.arrowsPressed = this.player.arrowsPressed;

		// Cet interval sert à faire perdurer le mouvement des obstacles même si la boucle de jeu principale s'est arrêtée
		// On peut ainsi les faire exploser chacun périodiquement pour un meilleur effet visuel
		const obstaclesMovement = setInterval(() => {
			this.obstacles.forEach(obstacle => {
				obstacle.update();
			});
		}, 16);
		// Cet interval justement sert à faire  exploser les obstacles restants toutes les 100ms
		const clearObstaclesInterval = setInterval(() => {
			if (this.obstacles.length === 0) {
				// Quand on a fait exploser tous les obstacles, on peut arrêter les deux boucles et afficher l'écran de fin de partie
				clearInterval(obstaclesMovement);
				clearInterval(clearObstaclesInterval);
				getId('endgame-screen').classList.add('displayed');
				return;
			}
			const removed = this.obstacles.shift();
			removed.explode();
		}, 100);

		this.coins.forEach(coin => {
			// On anime une disparition sur chaque pièce restante pendant que les obstacles explosent
			// L'animation dure 1500ms, on attend cette durée avant de supprimer la pièce du DOM
			coin.img.classList.add('game-end-remove');
			setTimeout(() => coin.img.remove(), 1500);
		});
		// Le score en partie prend 300ms à quitter l'écran (Transition CSS, game.css)
		// On attend 1 seconde pour afficher l'écran de fin de partie, pour laisser le temps aux obstacles restants d'exploser
		getId('scores').classList.add('hidden');
		setTimeout(() => getId('endgame-screen').classList.add('displayed'), 1000);
		// On modifie les valeurs de l'écran de fin de partie qui sera affiché dans 1 seconde
		document.querySelector('#endgame-score span').innerText = this.score;
		const best = parseInt(localStorage.getItem('stat.highestScore')) || 0;
		if (this.score > best)
			getId('endgame-newrecord').classList.add('displayed');
		else
			getId('endgame-newrecord').classList.remove('displayed');

		// On stocke l'EventListener dans une variable pour pouvoir l'annuler par la suite
		// Dans une fonction fléchée pour conserver le `this` relatif à notre instance de `Game`
		const endgameMenuHandler = (e) => {
			if (e.target.id === 'play')
				new Game(this.skin).start();
			else if (e.target.id === 'menu')
				displayMenu();
			else
				return;
			// Si on arrive ici, l'un des deux boutons a été pressé
			// Car sinon, on a appelé return et l'exécution de la fonction s'est arrêtée pour ce clic
			// On peut donc supprimer l'événement
			document.removeEventListener('click', endgameMenuHandler, true);
		}
		// On applique l'EventListener
		document.addEventListener('click', endgameMenuHandler, true);
		updateStats(this);
		let balance = parseInt(localStorage.getItem('balance')) || 0;
		balance += this.stats.coinCount;
		getId('inventory-balance-value').innerText = zero(balance, 3);
		localStorage.setItem('balance', balance.toString());
		GameAudio.playMusic('over');
	}

}