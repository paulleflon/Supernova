/**
 * Représente une pièce collectible 
 * @class
 */
class Coin extends Sprite {
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
			y: Math.floor(Math.random() * (parent.offsetHeight - 100)),
			debug: false
		});
	}

	update() {
		this.x -= 10;
		this.img.style.left = `${this.x}px`;
	}

	take() {
		this.img.classList.add('taken');
		setTimeout(() => this.img.remove(), 100);
	}
}