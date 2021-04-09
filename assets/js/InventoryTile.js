/**
 * Représente une tuile dans l'inventaire
 * @class
 */
class InventoryTile {
	/**
	 * @param {string} skin Le nom technique du skin que représente cette tuile
	 * @param {string} displayName Le nom du skin à afficher
	 * @param {boolean} possessed Si le skin est possédé
	 * @param {boolean} selected Si le skin est selectionné
	 */
	constructor(skin, displayName, possessed, selected) {
		this.skin = skin;
		this.possessed = possessed;
		this.selected = selected;
		this.div = document.createElement('div');
		this.div.className = 'inventory-tile';
		this.div.innerHTML = `
				<img src="assets/img/sprites/${skin}/player.png" class="skin-character-showcase"></img>
				<div class="skin-name">${displayName}</div>
				<div class="skin-state"></div>
				<div class="skin-cta"></div>`;
		if (possessed)
			this.div.className += ' possessed';
		if (selected)
			this.div.className += ' selected';
	}
}