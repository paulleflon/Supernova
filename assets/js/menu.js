const menu = getId('main-menu');
const bg = getId('menu-background');
const contents = getId('menu-contents');
/* Effet de parallaxe */
menu.addEventListener('mousemove', e => {
	const x = e.clientX;
	const y = e.clientY;
	const w = menu.clientWidth;
	const h = menu.clientWidth;
	const diffX = (x - w / 2) / 50;
	const diffY = (y - h / 2) / 50;
	bg.style.transform = `translate(${diffX}px, ${diffY}px)`;
	contents.style.transform = `translate(${diffX / 4}px, ${diffY / 4}px)`;
});
/* Navigation au clavier */
const menuItems = Array.from(document.querySelectorAll('#main-menu #menu-items .menu-item'));
let selectedMenuItem = null;
menuItems.forEach(elm => {
	elm.addEventListener('mouseenter', e => {
		playSound('menuclick');
	});
	elm.addEventListener('mouseleave', e => {
		elm.classList.remove('focused');
		selectedMenuItem = null;
	})
	elm.addEventListener('click', e => {
		menuAction(elm.getAttribute('menu-action'));
	});
})
menu.addEventListener('keydown', e => {
	if (e.key === 'Enter') {
		if (selectedMenuItem === null)
			return;
		const selected = menuItems[selectedMenuItem];
		menuAction(selected.getAttribute('menu-action'));
	}

	const increment = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : null;
	if (!increment)
		return;
	playSound('menuclick');
	if (selectedMenuItem === null) {
		selectedMenuItem = increment === 1 ? 0 : 2;
	} else {
		menuItems[selectedMenuItem].classList.remove('focused');
		selectedMenuItem += increment;
		if (selectedMenuItem > 2)
			selectedMenuItem = 0;
		if (selectedMenuItem < 0)
			selectedMenuItem = 2;
	}
	menuItems[selectedMenuItem].classList.add('focused');
});
function displayMenu() {
	gameoverBgm.pause();
	mainBgm.currentTime = 0;
	mainBgm.play();
	switchSection('main-menu');
}

function menuAction(action) {
	switch (action) {
		case 'play':
			startGame();
			break;
		case 'stats':
			displayStats();
			break;
		case 'inventory':
			// switchSection('inventory');
			break;
	}
}