/**
 * Gère l'audio du jeu
 * @class
 */
class AudioManager {
	/**
	 * @param {object} paths Chemins vers les musiques/sons
	 */
	constructor(paths) {
		/**
		 * Si l'utilisateur a décidé de désactiver la musique dans le jeu
		 * @type {boolean}
		 */
		this.disabled = localStorage.getItem('muted') === 'true';
		/**
		 * Les musiques du jeu mappées par leur ID
		 * @type {Map<string, Audio>}
		 */
		this.musics = new Map();

		/**
		 * Les bruitages du jeu mappés par leur ID
		 * @type {Map<string, Audio>}
		 */
		this.sounds = new Map();

		/**
		 * L'id de la musique en train d'être jouée
		 * @type {string}
		 * @private
		 */
		this._nowPlaying;

		Object.keys(paths.musics).forEach(key => {
			const audio = new Audio(paths.musics[key]);
			audio.loop = true;
			audio.muted = this.disabled;
			this.musics.set(key, audio);
		});
		Object.keys(paths.sounds).forEach(key => {
			const audio = new Audio(paths.sounds[key]);
			this.sounds.set(key, audio);
		});
	}

	/**
	 * Active/Désactive l'audio dans le jeu et sauvegarde ce paramètre dans le localStorage
	 */
	toggle() {
		this.disabled = !this.disabled;
		localStorage.setItem('muted', this.disabled.toString());
		this.musics.forEach(audio => audio.muted = this.disabled);
	}

	/**
	 * L'objet Audio de la musique en cours, si il y'en a une
	 * @type {?HTMLAudioElement}
	 */
	get nowPlaying() {
		if (this._nowPlaying)
			return this.musics.get(this._nowPlaying);
	}

	/**
	 * Met en pause la musique en cours
	 */
	pause() {
		if (this.nowPlaying)
			this.nowPlaying.pause();
	}

	/**
	 * Joue une musique
	 * @param {string} name Le nom de la musique à jouer
	 */
	playMusic(name) {
		if (!this.musics.has(name))
			return console.warn(`'${name}' music not found`);
		if (this.nowPlaying) {
			this.nowPlaying.pause();
			this.nowPlaying.currentTime = 0;
		}
		this._nowPlaying = name;
		this.musics.get(name).play();
	}

	/**
	 * Joue un bruitage
	 * @param {string} name Le nom du bruitage à jouer
	 */
	playSound(name) {
		if (this.disabled)
			return;
		if (!this.sounds.has(name))
			return console.warn(`'${name}' sound not found`);
		// Cloner l'objet Audio nous permet de jouer le même bruitage plusieurs fois en même temps
		// Le son se chevauche au lieu de revenir au début comme une musique
		// Utile quand les obstacles explosent tous dans un court laps de temps ou quand l'utilisateur
		// Survole des options du menu rapidement
		const sound = this.sounds.get(name).cloneNode();
		sound.play();
	}
}