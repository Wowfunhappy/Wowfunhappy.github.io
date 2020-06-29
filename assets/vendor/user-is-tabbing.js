/*https://medium.com/hackernoon/removing-that-ugly-focus-ring-and-keeping-it-too-6c8727fefcd2*/

function handleFirstTab(e) {
	if (e.keyCode === 9) {
		document.body.classList.add('user-is-tabbing');
		
		window.removeEventListener('keydown', handleFirstTab);
		window.addEventListener('mousedown', handleMouseDownOnce);
	}
}

function handleMouseDownOnce() {
	document.body.classList.remove('user-is-tabbing');
	
	window.removeEventListener('mousedown', handleMouseDownOnce);
	window.addEventListener('keydown', handleFirstTab);
}

window.addEventListener('keydown', handleFirstTab);