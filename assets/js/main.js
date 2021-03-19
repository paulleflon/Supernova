const mainBgm = new Audio('assets/music/main-bgm.mp3');
mainBgm.loop = true;
const gameBgm = new Audio('assets/music/game-bgm.mp3');
gameBgm.loop = true;
const gameoverBgm = new Audio('assets/music/gameover.mp3');
gameoverBgm.loop = true;

const audioBtn = getId('menu-audio');
const muted = localStorage.getItem('muted') === 'true';
mainBgm.muted = gameBgm.muted = gameoverBgm.muted = muted;
if (muted)
	audioBtn.classList.add('muted');
audioBtn.addEventListener('click', () => {
	const muted = !(localStorage.getItem('muted') === 'true');
	mainBgm.muted = gameBgm.muted = gameoverBgm.muted = muted;
	audioBtn.classList.toggle('muted');
	localStorage.setItem('muted', muted);
});
// Ce bouton sert à forcer une première interaction entre l'utilisateur et la page avant de lancer le jeu
// Ceci permet d'éviter que le navigateur ne bloque les sons dans le menu (https://goo.gl/xX8pDD)
getId('intro').addEventListener('click', () => {
	displayMenu();
	getId('intro').remove();
});