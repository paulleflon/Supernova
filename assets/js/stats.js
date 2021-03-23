const statNames = {
	'highestScore': 'Meilleur score',
	'worstScore': 'Pire score',
	'totalScore': 'Score total',
	'gameTime': 'Temps de jeu',
	'shortestGame': 'Partie la plus courte',
	'longuestGame': 'Partie la plus longue',
	'gamesCount': 'Nombre de parties',
	'arrowsPressed': 'Nombre de flèches pressées',
	'speedTime': 'Temps passé en accélération',
	'obstaclesCount': 'Nombre d\'obstacles croisés',
	'coinCount': 'Nombre de pièces ramassées',
	'missedCoins': 'Nombre de pièces ratées',
}
// Ces stats seront affichées en étant mises en forme avec formatDuration (lib.js)
const timeStats = ['gameTime', 'shortestGame', 'longuestGame', 'speedTime'];

/**
 * Met à jour les statistiques
 * @param {Game} game Les données de la partie jouée 
 */
function updateStats(game) {
	const current = loadStats();
	const duration = Date.now() - game.startedAt;
	if (game.score > current.highestScore)
		current.highestScore = game.score;
	else if (game.score < current.worstScore || current.worstScore === 0)
		current.worstScore = game.score;
	current.totalScore += game.score;
	if (duration > current.longuestGame)
		current.longuestGame = duration;
	else if (duration < current.shortestGame || current.shortestGame === 0)
		current.shortestGame = duration;
	current.gameTime += duration;
	current.gamesCount++;
	current.arrowsPressed += game.stats.arrowsPressed;
	current.speedTime += game.stats.speedTime;
	current.obstaclesCount += game.stats.obstaclesCount;
	current.coinCount += game.stats.coinCount;
	current.missedCoins += game.stats.missedCoins;
	for (const s in statNames) {
		localStorage.setItem(`stat.${s}`, current[s].toString());
	}
}


/**
 * Affiche les statistiques dans la section `stats`
 */
function displayStats() {
	gameoverBgm.pause();
	if (mainBgm.paused) {
		mainBgm.currentTime = 0;
		mainBgm.play();
	}
	const stats = loadStats();
	const statsContainer = getId('stats-container');
	statsContainer.innerHTML = '';
	for (s in statNames) {
		const elm = document.createElement('div');
		elm.className = 'stat';
		let content;
		if (timeStats.includes(s))
			content = formatDuration(stats[s]);
		else
			content = stats[s];
		elm.innerHTML = `<div class='stat-title'>${statNames[s]}</div><div class='stat-value'>${content}</div>`;
		statsContainer.appendChild(elm);
	}
	switchSection('stats');
}

/**
 * Charge les statistiques à partir du localStorage
 * @returns {Record<string, number>} Les statistiques mappées par leurs id 
 */
function loadStats() {
	const obj = {};
	for (const s in statNames) {
		const loaded = parseInt(localStorage.getItem(`stat.${s}`));
		obj[s] = isNaN(loaded) ? 0 : loaded;
	}
	return obj;
}