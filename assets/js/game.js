function resetDisplay() {
	const skin = localStorage.getItem('selectedSkin') || 'animalcrossing';
	const highscore = parseInt(localStorage.getItem('stat.highestScore'));
	if (highscore)
		getId('highscore').innerText = highscore;
	else
		getId('highscore').innerText = '';
	getId('scores').classList.remove('hidden');
	getId('endgame-screen').classList.remove('displayed');
	getId('game').style.background = `url(assets/img/sprites/${skin}/background.png) center center / cover`;

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
	const skin = localStorage.getItem('selectedSkin') || 'animalcrossing';
	const game = {
		lastShiftPress: null,
		obstacles: [],
		player: new Player(skin, getId('game')),
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
	shiftTimeHandler.bind(game);
	document.body.addEventListener('keydown', shiftTimeHandler, true);
	document.body.addEventListener('keyup', shiftTimeHandler, true);
	return game;
}

async function startGame(forceSwitch = true) {
	/* Réinitialisation de l'affichage */
	resetDisplay();
	if (forceSwitch)
		switchSection('game');

	/* Lancement de la bonne musique */
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
			game.obstacles.push(new Obstacle(game.skin, game.speed, getId('game')));
			game.obstacles[game.obstacles.length - 1].display();
			game.stats.obstaclesCount += 1;
			game.speed += 0.05;
		}
		if (frameCount % 500 === 0 && obstacleRate > 3)
			obstacleRate -= 3;

		game.player.update();
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
	}, 16);

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