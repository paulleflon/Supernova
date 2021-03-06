class Obstacle extends Sprite {
	constructor(skin, speed, parent) {
		super({
			width: 100,
			height: 100,
			src: `assets/img/sprites/${skin}/meteorite_1.png`,
			hitbox: {
				width: 70,
				height: 70,
				y: -10
			},
			x: parent.offsetWidth,
			y: Math.floor(Math.random() * (parent.offsetHeight - 100)),
		})
		this.parent = parent;
		this.speed = speed;
		this.load();
		this.boom = new Audio(`assets/audio/explosion.wav`);
	}

	display() {
		super.display(this.parent);
	}

	update() {
		this.x -= this.speed;
		this.img.style.left = `${this.x}px`;
	}

	explode() {
		this.img.classList.add('hit');
		this.img.src = 'assets/img/sprites/boom.gif';
		if (localStorage.getItem('muted') === 'true')
			return;
		this.boom.currentTime = 0;
		this.boom.play();
		setTimeout(() => this.remove(), 1000);
	}


}