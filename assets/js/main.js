const mainBgm = new Audio('assets/music/main-bgm.mp3');
mainBgm.loop = true;
const gameBgm = new Audio('assets/music/game-bgm.mp3');
gameBgm.loop = true;
const gameoverBgm = new Audio('assets/music/gameover.mp3');
gameoverBgm.loop = true;

const GameAudio = new AudioManager({
	musics: {
		main: 'assets/music/main-bgm.mp3',
		game: 'assets/music/game-bgm.mp3',
		over: 'assets/music/gameover.mp3'
	},
	sounds: {
		click: 'assets/audio/menuclick.wav',
		boom: 'assets/audio/explosion.wav'
	}
})


// Ce bouton sert à forcer une première interaction entre l'utilisateur et la page avant de lancer le jeu
// Ceci permet d'éviter que le navigateur ne bloque les sons dans le menu (https://goo.gl/xX8pDD)
getId('intro').addEventListener('click', () => {
	displayMenu();
	getId('intro').remove();
});