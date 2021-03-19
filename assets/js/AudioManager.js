/**
 * Gère l'audio de l'application
 */
class AudioManager {
	/**
	 * @param {object} paths Chemins vers les musiques/sons
	 */
	constructor(paths = {}) {
		this.musics = new Map();
		this.sounds = new Map();
		Object.keys(paths.musics).forEach(key => {
			const audio = new Audio(paths.musics[key]);
			this.musics.set(key, audio);
		});
		Object.keys(paths.sounds).forEach(key => {
			const audio = new Audio(paths.musics[key]);
			this.musics.set(key, audio);
		});
	}

	/**
	 * 
	 * @param {string} name Le nom de la musique à jouer
	 */
	playMusic(name) {

	}

}
