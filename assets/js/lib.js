/* Paul Leflon - Aryelle Pocholle - Chloé Xu - Lévina Sun */
/**
 * Retourne un nombre entier aléatoire	
 * @param {number} a Le minimum
 * @param {number} b Le maximum
 */
function random(a, b) {
	return Math.floor(Math.random() * (b - a)) + a;
}

/**
 * Ajoute des zéros au début d'un nombre pour lui donner le nombre de chiffres voulu
 * @param {number} x Le nombre à formatter
 * @param {number} n Le nombre de chiffres nécessaires au nombre
 */
function zero(x, n) {
	if (x.toString().length >= n)
		return `${x}`;
	return '0'.repeat(n - x.toString().length) + x;
}
/**
 * Raccourci pour `document#getElementById`
 * @param {string} id L'ID de l'élément HTML à récupérer
 */
function getId(id) {
	return document.getElementById(id);
}

/**
 * Change la section de jeu affichée (Menu, Paramètres, Stats, etc...)
 * @param {string} id L'id de la catégorie 
 */
function switchSection(id) {
	const displayed = document.querySelector('.game-section.displayed');
	if (displayed && displayed.id === id)
		return;
	getId(id).classList.add('displayed');
	if (displayed)
		displayed.classList.remove('displayed');
}

/**
 * Met en forme une durée en un format lisible
 * @param {number} ms La durée à mettre en forme, en millisecondes
 * @returns {string} La durée mise en forme
 */
function formatDuration(ms) {
	let seconds = Math.floor(ms / 1000);
	const hours = Math.floor(seconds / 3600);
	seconds -= hours * 3600;
	const minutes = Math.floor(seconds / 60);
	seconds -= minutes * 60;
	let str = '';
	// On affiche les heures uniquement si elles sont supérieures à 0
	// Par contre on affiche toujours les minutes et secondes peu importe leurs valeurs
	if (hours > 0)
		str += `${zero(hours, 4)}:`;
	str += `${zero(minutes, 2)}:${zero(seconds, 2)}`;
	return str;
}