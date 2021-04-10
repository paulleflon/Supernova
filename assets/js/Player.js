/**
 * Représente un personnage jouable
 * @class
 */
class Player extends Sprite {
	/**
	 * @param {string} skin Le skin à appliquer sur le joueur
	 * @param {HTMLDivElement} parent L'élément HTML dans lequel afficher le joueur
	 */
	constructor(skin, parent) {
		super({
			id: 'player',
			height: 100,
			width: 200,
			hitbox: {
				width: 120,
				height: 70,
				y: -20,
				x: 20
			},
			src: `assets/img/sprites/${skin}/player.png`,
			x: 20,
			y: 0,
			debug: false
		});
		/**
		 * L'élément HTML dans lequel afficher le joueur
		 * @type {HTMLElement}
		 */
		this.parent = parent;
		/**
		 * Si les différentes touches de jeu sont pressées
		 * @type {Record<string, boolean>}
		 */
		this.keyPressed = {
			up: false,
			down: false,
			shift: false
		};
		/**
		 * Le nombre de touches pressées par le joueur durant la partie
		 * @type {number}
		 */
		this.arrowsPressed = 0;
		this.load();
		/**
		 * L'EventHandler à attacher au joueur pour le rendre jouable
		 * @type {Function}
		 */
		this.keyPressHandler = (e) => {
			const down = e.type === 'keydown';
			if (!down && (this.keyPressed.down || this.keyPressed.up))
				this.arrowsPressed++;
			switch (e.key) {
				case 'ArrowUp':
					this.img.classList[down ? 'add' : 'remove']('move-up');
					this.keyPressed.up = down;
					break;
				case 'ArrowDown':
					this.img.classList[down ? 'add' : 'remove']('move-down');
					this.keyPressed.down = down;
					break;
				case 'Shift':
					this.img.classList[down ? 'add' : 'remove']('accelerated');
					this.keyPressed.shift = down;
					break;
			}
		}
	}

	/**
	 * Affiche le joueur
	 */
	display() {
		this.y = this.parent.offsetHeight / 2 - 50;
		this.img.classList.add('in');
		setTimeout(() => this.img.classList.remove('in'), 1000);
		document.body.addEventListener('keydown', this.keyPressHandler, true);
		document.body.addEventListener('keyup', this.keyPressHandler, true);
		super.display(this.parent);
	}

	/**
	 * Met à jour la position et l'affichage du joueur
	 */
	update() {
		let speed = 0;
		if (this.keyPressed.up)
			speed -= this.keyPressed.shift ? 20 : 10;
		if (this.keyPressed.down)
			speed += this.keyPressed.shift ? 20 : 10;
		this.y += speed;

		if (this.y < 0)
			this.y = 0;
		if (this.y + this.hitbox.height > this.parent.offsetHeight)
			this.y = this.parent.offsetHeight - this.hitbox.height;
		this.img.style.top = `${this.y}px`;
	}

	/**
	 * Anime la chute du personnage et le supprime de l'écran lors de la défaite de la partie
	 */
	fall() {
		document.body.removeEventListener('keydown', this.keyPressHandler, true);
		document.body.removeEventListener('keyup', this.keyPressHandler, true);
		let velocity = 1;
		let angle = 0;
		const fallInterval = setInterval(() => {
			this.y += velocity;
			angle += velocity / 3;
			velocity += 0.5;
			this.img.style.top = `${this.y}px`;
			this.img.style.transform = `rotate(${angle}deg)`;
			if (this.y > this.parent.offsetHeight) {
				this.remove();
				clearInterval(fallInterval);
			}
		}, 16);
	}
}
