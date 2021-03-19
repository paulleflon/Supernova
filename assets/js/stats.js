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


function updateStats(data) {
	const current = loadStats();
	const duration = Date.now() - data.start;
	if (data.score > current.highestScore)
		current.highestScore = data.score;
	else if (data.score < current.worstScore || current.worstScore === 0)
		current.worstScore = data.score;
	current.totalScore += data.score;
	if (duration > current.longuestGame)
		current.longuestGame = duration;
	else if (duration < current.shortestGame || current.shortestGame === 0)
		current.shortestGame = duration;
	current.gameTime += duration;
	current.gamesCount++;
	current.arrowsPressed += data.stats.arrowsPressed;
	current.speedTime += data.stats.speedTime;
	current.obstaclesCount += data.stats.obstaclesCount;
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

function loadStats() {
	const obj = {};
	for (const s in statNames) {
		const loaded = parseInt(localStorage.getItem(`stat.${s}`));
		obj[s] = isNaN(loaded) ? 0 : loaded;
	}
	return obj;
}