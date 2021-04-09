// Les noms des skins dans l'ordre du BitField
const SKIN_NAMES = ['animalcrossing', 'default'];
const SKIN_DISPLAY_NAMES = ['Animal Crossing', 'Skin de base'];

/**
 * Charge l'inventaire depuis le localStorage
 * @returns {Record<string, boolean>} Un objet dont les clés sont les noms des skins et les valeurs des booléens correspondant à la possession ou non du skin
 */
function loadInventory() {
	let bits = localStorage.getItem('inventory');
	if (!bits) {
		// On utilise ce que l'on pourrait appeler un BitField pour représenter
		// les skins possédés dans la sauvegarde. Chaque bit correspond à un skin, 1 s'il est possédé,
		// 0 sinon.
		// Exemple ici, avec nos deux skins : 01
		// Correspond au skin animalcrossing /  \ Correspond au skin par défaut
		// et n'est pas possédé dans cet ex.      et est systématiquement possédé
		// Si la sauvegarde ne figure pas, on crée cette chaîne de caractères,
		// Par défaut aucun skin n'est possédé sauf celui de base, correspondant au dernier bit.
		bits = '0'.repeat(SKIN_NAMES.length - 1) + '1';
		localStorage.setItem('inventory', bits);
	}
	const inv = {};
	for (const i in bits) {
		inv[SKIN_NAMES[i]] = bits[i] === '1';
	}
	return inv;
}

function displayInventory() {
	const selected = localStorage.getItem('selectedskin') || 'default';
	const inv = loadInventory();
	const tiles = Array.from(document.getElementsByClassName('inventory-tile'));
	tiles.forEach((tile) => {});
}

function selectSkin(skin) {
	localStorage.setItem('selectedskin', skin);
	const tile = document.querySelector(`.inventory-tile#${skin}`);
}
