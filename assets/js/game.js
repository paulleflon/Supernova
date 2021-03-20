function resetDisplay() {
	const skin = localStorage.getItem('selectedSkin') || 'default';
	const highscore = parseInt(localStorage.getItem('stat.highestScore'));
	if (highscore)
		getId('highscore').innerText = highscore;
	else
		getId('highscore').innerText = '';

	getId('game').style.background = `url(assets/img/sprites/${skin}/background.png) center center / cover`;
	getId('coin-icon').style.backgroundImage = `url(assets/img/sprites/${skin}/coin_1.png)`;
	getId('coins-count').innerText = '000';
	getId('scores').classList.remove('hidden');
	getId('endgame-screen').classList.remove('displayed');

}

/**
 * EventListener dédié au calcul du temps durant lequel la touche Shift a été pressée
 * @param {KeyboardEvent} e L'événement clavier 
 */
function shiftTimeHandler(e) {
	if (e.type === 'keydown' && e.key === 'Shift')
		this.lastShiftPress = Date.now();
	if (e.type === 'keyup' && e.key === 'Shift' && this.lastShiftPress)
		this.stats.speedTime += Date.now() - this.lastShiftPress;
};

function initGame() {
	const skin = localStorage.getItem('selectedSkin') || 'default';
	const container = getId('game');
	const game = {
		container,
		lastShiftPress: null,
		obstacles: [],
		coins: [],
		player: new Player(skin, container),
		score: 0,
		skin,
		speed: 10,
		start: Date.now(),
		stats: {
			arrowsPressed: 0,
			speedTime: 0,
			coinCount: 0,
			obstaclesCount: 0,
			missedCoins: 0
		},
	};
	game.player.display();
	document.body.addEventListener('keydown', (e) => shiftTimeHandler.call(game, e), true);
	document.body.addEventListener('keyup', (e) => shiftTimeHandler.call(game, e), true);
	return game;
}

async function startGame(forceSwitch = true) {
	/* Réinitialisation de l'affichage */
	resetDisplay();
	if (forceSwitch)
		switchSection('game');

	/* Lancement de la bonne musique */
	//// NEED REFACTOR: AudioManager
	gameoverBgm.pause();
	mainBgm.pause();
	gameBgm.currentTime = 0;
	gameBgm.play();
	/* Initialisation de la partie */
	const game = initGame();

	let frameCount = 0;
	let obstacleRate = 30;
	game.loop = setInterval(function () {
		if (++frameCount % 5 === 0)
			getId('currentscore').innerText = ++game.score;

		if (frameCount % obstacleRate === 0) {
			game.obstacles.push(new Obstacle(game.skin, game.speed, game.container));
			game.obstacles[game.obstacles.length - 1].display();
			game.stats.obstaclesCount += 1;
			game.speed += 0.05;
		}
		if (frameCount % 500 === 0 && obstacleRate > 3)
			obstacleRate -= 3;

		if (frameCount % 50 === 0) {
			game.coins.push(new Coin(game.skin, game.container));
			game.coins[game.coins.length - 1].display(game.container);
		}

		game.player.update();
		updateObstacles(game);
		updateCoins(game);
	}, 16);

}

/**
 * Met à jour l'état des pièces 
 * @param {object} game Les données de la partie
 */
function updateCoins(game) {
	game.coins.forEach((coin, index) => {
		coin.update();
		if (coin.testCollision(game.player)) {
			coin.img.remove();
			getId('coins-count').innerText = zero(++game.stats.coinCount, 3);
			game.coins.splice(index, 1);
		}
		if (coin.x + coin.width < 0) {
			coin.img.remove();
			game.stats.missedCoins++;
			game.coins.shift();
		}
	});
}

function updateObstacles(game) {
	game.obstacles.forEach((obstacle, index) => {
		obstacle.update();
		if (obstacle.x + obstacle.width < 0) {
			obstacle.remove();
			game.obstacles.shift();
		}
		if (obstacle.testCollision(game.player)) {
			game.obstacles.splice(index, 1);
			obstacle.explode();
			document.body.removeEventListener('keydown', shiftTimeHandler, true);
			document.body.removeEventListener('keyup', shiftTimeHandler, true);
			lose(game);
		}
	});
}

function lose(game) {
	clearInterval(game.loop);
	game.player.fall();
	game.stats.arrowsPressed = game.player.arrowsPressed;
	const obstaclesMovement = setInterval(function () {
		game.obstacles.forEach(obstacle => {
			obstacle.update();
		});
	}, 16);
	const clearObstaclesInterval = setInterval(function () {
		if (game.obstacles.length === 0) {
			clearInterval(obstaclesMovement);
			clearInterval(clearObstaclesInterval);
			getId('endgame-screen').classList.add('displayed');
			return;
		}
		const removed = game.obstacles.shift();
		removed.explode();
	}, 100);
	game.coins.forEach(coin => {
		coin.img.classList.add('fadeOut');
		setTimeout(() => coin.img.remove(), 300);
	});
	getId('scores').classList.add('hidden');
	document.querySelector('#endgame-score span').innerText = game.score;
	const best = parseInt(localStorage.getItem('stat.highestScore')) || 0;
	if (game.score > best)
		getId('endgame-newrecord').classList.add('displayed');
	else
		getId('endgame-newrecord').classList.remove('displayed');

	setTimeout(() => getId('endgame-screen').classList.add('displayed'), 1000);
	function endgameMenuHandler(e) {
		if (e.type === 'click') {
			if (e.target.id === 'play')
				startGame(false);
			else if (e.target.id === 'menu')
				displayMenu();
			else return;
			document.removeEventListener('click', endgameMenuHandler, true);
			document.removeEventListener('keydown', endgameMenuHandler, true);
		}
	}
	document.addEventListener('click', endgameMenuHandler, true);
	updateStats(game);
	gameBgm.pause();
	gameoverBgm.currentTime = 0;
	gameoverBgm.play();
}