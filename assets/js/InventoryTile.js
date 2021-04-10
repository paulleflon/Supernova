/**
 * Représente une tuile dans l'inventaire
 * @class
 */
class InventoryTile {
	/**
	 * @param {string} skin Le nom du skin que représente cette tuile
	 * @param {string} displayName Le nom du skin à afficher
	 * @param {boolean} possessed Si le skin est possédé
	 * @param {boolean} selected Si le skin est selectionné
	 */
	constructor(skin, displayName, possessed, selected) {
		/**
		 * Le nom du skin que représente cette tuile
		 * @type {string}
		 */
		this.name = skin;
		/**
		 * Si le skin est possédé
		 * @type {boolean}
		 */
		this.possessed = possessed;
		/**
		 * Si le skin est selectionné
		 * @type {boolean}
		 */
		this.selected = selected;
		/**
		 * Le div de la tuile
		 * @type {HTMLDivElement}
		 */
		this.div = document.createElement('div');
		this.div.className = 'inventory-tile';
		this.div.innerHTML = `
				<img src="assets/img/sprites/${skin}/player.png" class="skin-character-showcase"></img>
				<div class="skin-name">${displayName}</div>
				<div class="skin-state">Prix : 500</div>
				<img src="assets/img/sprites/${skin}/background.png" class="skin-background-showcase"></img>`;
		getId('inventory-tiles').appendChild(this.div);
		/**
		 * Le div affichant l'état de la tuile (Prix/Possédé/Selectionné)
		 * @type {HTMLDivElement}
		 */
		this.state = this.div.querySelector('.skin-state');
		if (possessed) {
			this.div.className += ' possessed';
			this.state.innerHTML = 'Possédé';
		}
		if (selected) {
			this.div.className += ' selected';
			this.state.innerHTML = 'Selectionné';
			SELECTED_TILE = this;
		}
		// Voir Game.js(121) pour .call
		this.div.addEventListener('click', () => InventoryTile.onClick.call(this));
	}

	/**
	 * Déselectionne le skin et met à jour la tuile en conséquence
	 */
	unselect() {
		this.selected = false;
		this.state.innerHTML = 'Possédé';
		this.div.classList.remove('selected');
	}

	/**
	 * Les actions à réaliser quand on clique sur une tuile d'inventaire
	 * @this {InventoryTile} On affecte l'objet InventoryTile cliqué au this de l'EventListener
	 */
	static onClick() {
		if (this.selected)
			return;
		if (this.possessed) {
			selectSkin(this.name);
			this.selected = true;
			this.div.classList.add('selected');
			this.state.innerText = 'Selectionné';
			SELECTED_TILE.unselect();
			SELECTED_TILE = this;
		} else {
			const bought = buySkin(this.name);
			if (bought) {
				this.possessed = true;
				this.state.innerText = 'Possedé';
				this.div.classList.add('bought-animation');
				setTimeout(() => {
					this.div.classList.remove('bought-animation');
					this.div.classList.add('possessed');
				}, 1500);
			} else {
				this.div.classList.add('unbuyable-animation');
				setTimeout(() => this.div.classList.remove('unbuyable-animation'), 500);
			}
		}
	}
}

/**
 * La tuile représentant le skin selectionné
 * 
 * Sert à pouvoir la déselectionner lors de la selection d'un autre skin
 * @type {InventoryTile}
 */
let SELECTED_TILE;