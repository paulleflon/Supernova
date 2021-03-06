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

getId('intro').addEventListener('click', () => {
	displayMenu();
	// displayStats();
	getId('intro').remove();
});
audioBtn.addEventListener('click', () => {
	const muted = !(localStorage.getItem('muted') === 'true');
	mainBgm.muted = gameBgm.muted = gameoverBgm.muted = muted;
	audioBtn.classList.toggle('muted');
	localStorage.setItem('muted', muted);
})