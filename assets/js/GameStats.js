/* Paul Leflon - Aryelle Pocholle - Chloé Xu - Lévina Sun */
/**
 * Représente les statistiques d'une partie de Supernova
 * @class
 */
class GameStats {
	constructor() {
		/**
		 * Nombre de pressions sur les touches flèches du clavier durant la partie
		 * @type {number}
		 */
		this.arrowsPress = 0;

		/**
		 * Temps passé en accélération (avec la touche Shift pressée)
		 * @type {number}
		 */
		this.speedTime = 0;

		/**
		 * Nombre de pièces ramassées durant la partie
		 * @type {number}
		 */
		this.coinCount = 0;

		/**
		 * Nombre d'obstacles croisés durant la partie
		 * @type {number}
		 */
		this.obstaclesCount = 0;

		/**
		 * Nombre de pièces ratées durant la partie
		 * @type {number}
		 */
		this.missedCoins = 0;
	}
}