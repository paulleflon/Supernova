/* Paul Leflon - Aryelle Pocholle - Chloé Xu - Lévina Sun */
/**
 * Représente une pièce collectible 
 * @class
 */
class Coin extends Sprite {
	/**
	 * @param {string} skin Le skin à appliquer à la pièce
	 * @param {HTMLElement} parent L'élément HTML dans lequel afficher la pièce
	 */
	constructor(skin, parent) {
		super({
			height: 48,
			width: 48,
			hitbox: {
				width: 48,
				height: 48,
			},
			src: `assets/img/sprites/${skin}/coin_${random(1, 4)}.png`,
			x: parent.offsetWidth,
			y: random(0, parent.offsetHeight - 100),
			debug: false
		});
	}

	/**
	 * Met à jour l'emplacement de la pièce
	 */
	update() {
		this.x -= 10;
		this.img.style.left = `${this.x}px`;
	}

	/**
	 * Anime la prise de la pièce par le joueur et la retire de l'écran
	 */
	take() {
		this.img.classList.add('taken');
		setTimeout(() => this.img.remove(), 100);
	}
}