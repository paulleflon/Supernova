/**
 * Un obstacle (Météorite par défaut) dans la partie
 * @class
 */
class Obstacle extends Sprite {
	/**
	 * @param {string} skin Le skin à appliquer sur l'obstacle
	 * @param {number} speed La vitesse de l'obstacle
	 * @param {HTMLElement} parent L'élément HTML dans lequel afficher l'Obstacle
	 */
	constructor(skin, speed, parent) {
		super({
			width: 100,
			height: 100,
			src: `assets/img/sprites/${skin}/obstacle.png`,
			hitbox: {
				width: 70,
				height: 70,
				y: -10
			},
			x: parent.offsetWidth,
			y: random(0, parent.offsetHeight - 100),
		});
		/**
		 * L'élément HTML dans lequel afficher l'obstacle
		 * @type {HTMLElement}
		 */
		this.parent = parent;
		/**
		 * La vitesse de l'obstacle
		 * @type {number}
		 */
		this.speed = speed;
		this.load();
	}

	/**
	 * Affiche l'obstacle à l'écran
	 */
	display() {
		super.display(this.parent);
	}

	/**
	 * Met à jour la position de l'obstacle
	 */
	update() {
		this.x -= this.speed;
		this.img.style.left = `${this.x}px`;
	}

	/**
	 * Affiche l'explostion de l'obstacle et le retire de l'écran lors de la défaite de la partie
	 */
	explode() {
		this.img.classList.add('hit');
		this.img.src = `assets/img/sprites/boom.gif?no-cache=${Math.random()}`;
		if (localStorage.getItem('muted') === 'true')
			return;
		GameAudio.playSound('boom');
		setTimeout(() => this.img.remove(), 1000);
	}

}