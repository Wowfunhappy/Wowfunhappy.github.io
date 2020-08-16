var mainStarted = false;

document.addEventListener("DOMContentLoaded", function(){
	document.body.classList.add("has-js")
	try {
		document.fonts.ready.then(function() {
			main(); //ideal case--animations start when fonts have loaded.
		});
	}
	catch(e) { //browser doesn't support fonts.ready
		main();
	}
	window.setTimeout(function() {
		main(); //fonts are taking too long, start animations anyway.
	}, 1000)
	
	handleTouches();
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
	moveSets = Array.from(document.getElementsByClassName('move-set')); //Note: Add Array.from polyfill for best compatibility.
	moveSets.forEach(function(moveSet) {
		var delay = moveSet.dataset.initialDelay || 0;
		var timeBetween = moveSet.dataset.timeBetween || 200;
		var items = moveSet.getElementsByClassName("move-set-item");
		window.setTimeout(function() {
			setMovedState(items, timeBetween);
		}, delay);
	});
}

function setMovedState(list, timeBetween) {
	if (list.length >= 1) {
		var threshold = list[0].dataset.onScreenThreshold || '50%'; //Animation will play when this % of element is on screen.
		var extraOffset = parseInt(list[0].dataset.onScreenOffset) || 0; //Extra amount user must scroll (in px) before animation plays.
		var waypoint = new Waypoint({
			element: list[0],
			handler: function() {
				this.element.classList.remove('move-set-item');
				window.setTimeout(function() {
					setMovedState(list, timeBetween);
				}, timeBetween);
			},
			offset: function() {
				var thresholdFloat = parseFloat(threshold) / 100.0;				
				return this.context.innerHeight() - extraOffset - (this.element.offsetHeight * thresholdFloat);
			}
		})
	}
}

function handleTouches() {
	var cards = document.getElementsByClassName("card");
	for (var i = 0; i < cards.length; i++) {
		cards[i].addEventListener("touchstart", function(e) {
			this.classList.add("touchDown");
			this.classList.remove("touchUp");
		});
		cards[i].addEventListener("touchend", function (e) {
			this.classList.add("touchUp");
			this.classList.remove("touchDown");
		});
	}
}