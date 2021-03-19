const menu = getId('main-menu');
const bg = getId('menu-background');
const contents = getId('menu-contents');

/* Effet de parallaxe */
menu.addEventListener('mousemove', e => {
	const PARALLAX_SMOOTHNESS = 100;
	const x = e.clientX;
	const y = e.clientY;
	const w = menu.clientWidth;
	const h = menu.clientWidth;
	// L'expression entre parenthèses calcule la position du curseur relative au centre de l'écran
	// La diviser sert à adoucir l'effet de parallaxe, plus le diviseur est grand, plus l'effet est discret
	const diffX = (x - w / 2) / PARALLAX_SMOOTHNESS;
	const diffY = (y - h / 2) / PARALLAX_SMOOTHNESS;
	contents.style.transform = `translate(${diffX}px, ${diffY}px)`;
	// On divise par 2 pour que l'arrière-plan bouge plus lentement que le premier-plan et ainsi
	// Créer un effet de parallaxe 
	bg.style.transform = `translate(${diffX / 2}px, ${diffY / 2}px)`;
});


/* Navigation */
// document#querySelectorAll retourne un objet NodeListOf sur lequel .forEach ne fonctionne pas
// Array#from permet donc de convertir ce NodeListOf donné en Array sur lequel on peut utiliser .forEach
const menuItems = Array.from(document.querySelectorAll('#main-menu #menu-items .menu-item'));
menuItems.forEach(elm => {
	elm.addEventListener('mouseenter', () => {
		playSound('menuclick');
	});
	elm.addEventListener('click', () => {
		menuAction(elm.getAttribute('menu-action'));
	});
});

function displayMenu() {
	gameoverBgm.pause();
	mainBgm.currentTime = 0;
	mainBgm.play();
	switchSection('main-menu');
	if (parseInt(localStorage.getItem('stat.totalScore')) >= 100000) {
		getId('menu-background').style.backgroundImage = `url(./assets/img/enorme.png)`;
		getId('menu-title').style.color = '#000';
		getId('menu-title').style.textShadow = '0px 0px 5px #000';
		getId('menu-audio').style.filter = 'invert(1)';
	}
}

/**
 * Réalise une action proposée par le menu
 * @param {string} action L'action à réaliser
 */
function menuAction(action) {
	switch (action) {
		case 'play':
			startGame();
			break;
		case 'stats':
			displayStats();
			break;
		case 'inventory':
			// switchSection('inventory');
			break;
	}
}