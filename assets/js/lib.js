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
 * Raccourci pour `document.getElementById`
 * @param {string} id L'ID de l'élément HTML à récupérer
 */
function getId(id) {
	return document.getElementById(id);
}
/**
 * Change la section de jeu affichée (Menu, Paramètres, Stats, etc...)
 * @param {string} id L'id de la catégorie 
 */
async function switchSection(id) {
	const displayed = document.querySelector('.game-section.displayed');
	getId(id).classList.add('displayed');
	getId(id).focus();
	if (displayed) {
		displayed.classList.remove('displayed');
		displayed.blur();
	}
}

function playSound(file) {
	if (localStorage.getItem('muted') === 'true')
		return;
	const audio = new Audio(`assets/audio/${file}.wav`);
	audio.play();
}
/**
 * Version async de setTimeout
 * @param {number} ms La durée de pause
 */
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function formatDuration(ms) {
	let seconds = Math.floor(ms / 1000);
	console.log('hey');
	const hours = Math.floor(seconds / 3600);
	seconds -= hours * 3600;
	const minutes = Math.floor(seconds / 60);
	seconds -= minutes * 60;
	return `${zero(hours, 4)}:${zero(minutes, 2)}:${zero(seconds, 2)}`;
}

