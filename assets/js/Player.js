class Player extends Sprite {
	/**
	 * @param {string} skin 
	 * @param {HTMLDivElement} parent 
	 */
	constructor(skin, parent) {
		const y = parent.offsetHeight / 2 - 50;
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
			y,
			debug: true
		});

		this.parent = parent;
		this.keyPressed = {
			up: false,
			down: false,
			shift: false
		};
		this.arrowsPressed = 0;
		this.load();
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

	display() {
		this.img.classList.add('in');
		setTimeout(() => this.img.classList.remove('in'), 1000);
		document.body.addEventListener('keydown', this.keyPressHandler, true);
		document.body.addEventListener('keyup', this.keyPressHandler, true);
		super.display(this.parent);
	}

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
