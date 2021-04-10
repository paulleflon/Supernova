/**
 * Représente un Sprite dans le jeu
 * @class
 * @implements {spriteOptions}
 */
class Sprite {
	/**
	 * 
	 * @param {spriteOptions} spriteOptions Options de création du Sprite
	 */ 	 // Voir typedef ligne 129
	constructor(spriteOptions) {
		this.src = spriteOptions.src;
		if (spriteOptions.hitbox)
			this.hitbox = spriteOptions.hitbox;
		this.width = spriteOptions.width;
		this.height = spriteOptions.height;
		this.x = spriteOptions.x;
		this.y = spriteOptions.y;
		this.debug = spriteOptions.debug;
	}

	/**
	 * La position x de la HitBox du Sprite
	 * @type {number}
	 */
	get hitX() {
		return this.x + (this.hitbox.x || 0) + (this.width - this.hitbox.width) / 2;
	}

	/**
	 * La position y de la HitBox du Sprite
	 * @type {number}
	 */
	get hitY() {
		return this.y + (this.hitbox.y || 0) + (this.height - this.hitbox.height);
	}

	/**
	 * Charge l'image du `Sprite` en initialisant son élément HTML associé
	 */
	async load() {
		this.img = new Image();
		this.img.src = this.src;
		this.img.className = `Sprite ${this.constructor.name}`;
		if (this.width)
			this.img.width = this.width;
		if (this.height)
			this.img.height = this.height;
		// L'async permet d'attendre si besoin le chargement de l'image avant de l'utiliser (cf. display())
		return new Promise(resolve => this.img.addEventListener('load', () => { resolve(true) }));
	}
	/**
	 * Affiche le `Sprite`
	 * @param {HTMLElement} parent - L'élément HTML parent dans lequel afficher le `Sprite`
	 */
	async display(parent) {
		if (!this.img)
			await this.load();
		this.img.style.top = `${this.y}px`;
		this.img.style.left = `${this.x}px`;
		parent.appendChild(this.img);
		if (this.debug) {
			// Affiche par-dessus l'image du Sprite une représentation de sa hitbox
			// Utile pour équilibrer la détection des chocs entre Joueur et Obstacle
			const elm = document.createElement('div');
			elm.className = 'SpriteHitboxIndicator';
			elm.style.width = this.hitbox.width + 'px';
			elm.style.height = this.hitbox.height + 'px';
			parent.appendChild(elm);
			setInterval(() => {
				elm.style.top = this.hitY + 'px';
				elm.style.left = this.hitX + 'px';
			})
		}
	}
	/**
	 * Raccourci pour `Sprite#img#remove`
	 */
	remove() {
		this.img.remove();
	}
	/**
	 * Raccourci pour `Sprite#testCollision` 
	 * @param {Sprite} sprite Le `Sprite` avec lequel tester la collision
	 */
	testCollision(sprite) {
		return Sprite.testCollision(this, sprite);
	}

	/**
	 * Teste si deux Sprites sont en collision
	 * @param {Sprite} sprite1 
	 * @param {Sprite} sprite2 
	 * @returns {boolean} Si les deux sprites sont en collision
	 */
	static testCollision(sprite1, sprite2) {
		/*
		 * Pour simplifier le développment, les HitBox ne sont que des rectangles
		 * À cause de cela dans certains cas les collisions peuvent être hasardeuses
		 */

		// Si l'un des éléments n'a pas de hitbox, aucune collision ne peut survenir
		if (!sprite1.hitbox || !sprite2.hitbox)
			return false;

		const
			w1 = sprite1.hitbox.width,
			h1 = sprite1.hitbox.height,
			x1 = sprite1.hitX,
			y1 = sprite1.hitY,
			h2 = sprite2.hitbox.height,
			w2 = sprite2.hitbox.width,
			x2 = sprite2.hitX,
			y2 = sprite2.hitY
			;
		// Si l'une des propriétés n'est pas définie ou nulle, on peut avoir des résultats inattendus. 
		// Dans le doute, on ne déclenche pas de collision dans ce cas.
		const checkList = [w1, h1, x1, y1, h2, w2, x2, y2];
		if (checkList.includes(null) || checkList.includes(undefined) || checkList.includes(NaN))
			return false;

		return (
		/* 1 */	x2 + w2 > x1 && // Côté(2)➡ à droite de Côté(1)⬅
		/* 2 */ x2 < x1 + w1 && // Côté(2)⬅ à gauche de Côté(1)➡
		/* 3 */ y2 + h2 > y1 && // Côté(2)⬇ en dessous de Côté(1)⬆
		/* 4 */ y2 < y1 + h1    // Côté(2)⬆ au dessus de Côté(1)⬇
		);
	}

}

/// Définitions de types

/**
 * @typedef Hitbox Propriétés d'Hitbox d'un `Sprite`
 * @property {number} width La longueur de la Hitbox
 * @property {number} height La largeur de la Hitbox
 * @property {number?} x La position x relative de la Hitbox
 * @property {number?} y La position y relative de la Hitbox
 */

/**
 * @typedef spriteOptions Options d'instanciation d'un `Sprite`
 * @property {boolean} debug Afficher la hitbox
 * @property {string?} id L'id de l'élément HTML lié au Sprite
 * @property {Hitbox?} hitbox La Hitbox du `Sprite` si celui-ci en a une
 * @property {number?} height La largeur du `Sprite`. Automatiquement calculée si nulle.
 * @property {string} src Chemin vers l'image du `Sprite`
 * @property {number?} width La longueur du `Sprite`. Automatiquement calculée si nulle.
 * @property {number?} x La position x de départ du `Sprite`
 * @property {number?} y La position y de départ du `Sprite`
 */