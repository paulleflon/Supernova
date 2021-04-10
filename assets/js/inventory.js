// Les noms des skins dans l'ordre du BitField
const SKIN_NAMES = ['default', 'animalcrossing'];
const SKIN_DISPLAY_NAMES = ['Skin de base', 'Animal Crossing'];

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
		// Exemple ici, avec nos deux skins : 10
		//     Correspond au skin par défaut /  \ Correspond au skin animalcrossing
		//   et est systématiquement possédé	   et n'est pas possédé dans cet exemple
		// Si la sauvegarde ne figure pas, on crée cette chaîne de caractères,
		// Par défaut aucun skin n'est possédé sauf celui de base, correspondant au dernier bit.
		bits = '1' + '0'.repeat(SKIN_NAMES.length - 1);
		localStorage.setItem('inventory', bits);
	}
	const inv = {};
	bits.split('').forEach((bit, i) => {
		inv[SKIN_NAMES[i]] = bit === '1';
	});
	return inv;
}

/**
 * Enregistre l'inventaire dans le localStorage
 * @param {Record<string, boolean>} inv L'objet représentant l'inventaire
 * @returns {string} L'inventaire comme il est enregistré dans le localStorage
 */
function saveInventory(inv) {
	let bits = '';
	Object.values(inv).forEach(possessed => {
		bits += possessed ? '1' : '0';
	});
	localStorage.setItem('inventory', bits);
	return bits;
}

/**
 * Instancie et affiche les tuiles d'inventaire
 */
function displayInventory() {
	const selectedSkin = localStorage.getItem('selectedskin') || 'default';
	const inv = loadInventory();
	Object.entries(inv).forEach(([skin, possessed], index) => {
		const tile = new InventoryTile(skin, SKIN_DISPLAY_NAMES[index], possessed, selectedSkin === skin);
	});
	const balance = parseInt(localStorage.getItem('balance')) || 0;
	getId('inventory-balance-value').innerText = zero(balance, 3);
}

/**
 * Enregistre le skin selectionné dans le localStorage
 * @param {string} skin Le nom du skin à sélectionner
 */
function selectSkin(skin) {
	localStorage.setItem('selectedskin', skin);
}

/**
 * Achète un skin
 * @param {string} skin Le skin à acheter
 * @returns {boolean} Si le skin a pu être acheté
 */
function buySkin(skin) {
	const inv = loadInventory();
	// Si le skin est déjà possédé on ne refait pas payer le joueur
	if (inv[skin])
		return false;
	let balance = parseInt(localStorage.getItem('balance'));
	if (isNaN(balance)) {
		localStorage.setItem('balance', '0');
		return false;
	}
	// On définit le prix de chaque skin à 500 pièces pour tous
	// Vu leur nombre, inutile d'avoir un prix pour chaque.
	if (balance < 500)
		return false;
	balance -= 500;
	getId('inventory-balance-value').innerText = zero(balance, 3);
	// Toutes les valeurs dans le localStorage doivent être des strings
	localStorage.setItem('balance', balance.toString());
	inv[skin] = true;
	saveInventory(inv);
	return true;
}