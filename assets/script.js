var mainStarted = false;

document.addEventListener("DOMContentLoaded", function(){
	try {
		document.fonts.ready.then(function() {
			main(); //ideal case--animations start when fonts have loaded.
		});
	}
	catch(e) { //browser doesn't support fonts.ready
		main();
	}
	window.setTimeout(function() {
		main(); //in case fonts take too long to load, start animations anyway.
	}, 1000)
});

function main() {
	/*Ensure main only starts once*/
	if (mainStarted) {
		return;
	} else {
		mainStarted = true;
	}
	document.getElementsByTagName("BODY")[0].classList.add('fade-in');
	if (document.getElementsByTagName("NAV").length > 0) {
		window.setTimeout(function() {
			startMoveSets();
		}, 150);
	}
	else {
		startMoveSets();
	}
}


function startMoveSets() {
	moveSets = Array.from(document.getElementsByClassName('move-set'));
	moveSets.forEach(function(moveSet) {
		var delay = moveSet.dataset.initialDelay || 0;
		var timeBetween = moveSet.dataset.timeBetween || 200;
		var offset = moveSet.dataset.offset || '100%';
		var items = moveSet.getElementsByClassName("move-set-item");
		window.setTimeout(function() {
			setMovedState(items, timeBetween, offset);
		}, delay);
	});
}

function setMovedState(list, timeBetween, offset) {
	if (list.length >= 1) {
		var waypoint = new Waypoint({
			element: list[0],
			handler: function() {
				this.element.classList.remove('move-set-item');
				window.setTimeout(function() {
					setMovedState(list, timeBetween, offset);
				}, timeBetween);
			},
			offset: offset
		})
	}
}