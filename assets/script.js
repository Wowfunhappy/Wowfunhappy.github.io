var mainStarted = false;
var bottomOfPageHasBeenSeen = false;

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
	//Note: Add Array.from polyfill for best compatibility.
	
	//In a patient move set, individual items will not appear until they enter the viewport
	patientMoveSets = Array.from(document.getElementsByClassName('patient-move-set')); 
	patientMoveSets.forEach(function(moveSet) {
		var delay = moveSet.dataset.initialDelay || 0;
		var timeBetween = moveSet.dataset.timeBetween || 200;
		var items = moveSet.getElementsByClassName("move-set-item");
		window.setTimeout(function() {
			patientSetMovedState(items, timeBetween);
		}, delay);
	});
	
	//As soon as a hasty move set enters the viewport, items will begin appearing even if offscreen.
	hastyMoveSets = Array.from(document.getElementsByClassName('hasty-move-set'));
	hastyMoveSets.forEach(function(moveSet) {
		var delay = moveSet.dataset.initialDelay || 0;
		var timeBetween = moveSet.dataset.timeBetween || 200;
		var items = moveSet.getElementsByClassName("move-set-item");
		window.setTimeout(function() {
			var waypoint = new Waypoint({
				element: moveSet,
				handler: function() {
					hastySetMovedState(items, timeBetween);
					console.log("setMoveState " + items[0]);
				},
				offset: function() { return calculateOffset(this); }
			});
		}, delay);
	});
	
	//If user has reached end of screen and can't scroll further, need to trigger all animations.
	//See also: calculateOffset function checks for bottomOfPageHasBeenSeen.
	if (! bottomOfPageHasBeenSeen) {
		var waypoint = new Waypoint({
			element: document.body,
			handler: function() {
				bottomOfPageHasBeenSeen = true;
				Waypoint.destroyAll()
				startMoveSets();
			},
			offset: 'bottom-in-view'
		});
	}
}

function patientSetMovedState(list, timeBetween) {
	if (list.length >= 1) {
		var waypoint = new Waypoint({
			element: list[0],
			handler: function() {
				this.element.classList.remove('move-set-item');
				window.setTimeout(function() {
					patientSetMovedState(list, timeBetween);
				}, timeBetween);
			},
			offset: function() { return calculateOffset(this); }
		})
	}
}

function hastySetMovedState(list, timeBetween) {
	if (list.length >= 1) {
		console.log("removing class: " + list[0]);
		list[0].classList.remove('move-set-item');
		window.setTimeout(function() {
			hastySetMovedState(list, timeBetween);
		}, timeBetween);
	}
}

function calculateOffset(item) {

	if (bottomOfPageHasBeenSeen) {
		return Waypoint.viewportHeight();
	}

	//data-position-threshold: Animation will play when top of element has travelled up this % the viewport height.
	var positionThreshold = item.element.dataset.positionThreshold;
	if (positionThreshold) {
		var thresholdFloat = parseFloat(positionThreshold) / 100.0;
		return Waypoint.viewportHeight() * (1 - thresholdFloat);
	}
	else {
		//data-on-screen-threshold: Animation will play when this % of element is on screen.
		var onScreenthreshold = item.element.dataset.onScreenThreshold || '50%';
		//An extra amount user must scroll (in px) beyond on-screen-threshold, before animation plays. Ignored if on-screen-threshold is not set!
		var extraOffset = parseInt(item.element.dataset.onScreenOffset) || 0
		var thresholdFloat = parseFloat(onScreenthreshold) / 100.0;
		var offset = item.context.innerHeight() - extraOffset - (item.element.offsetHeight * thresholdFloat);
		//Never allow offset to occur less than 150px below top of viewport.
		return Math.max(offset, 150);
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
		cards[i].addEventListener("click", function (e) {
			//Keep card depressed if tapped
			this.classList.remove("touchUp");
		});
	}
}