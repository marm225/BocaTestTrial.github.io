//
// Subtest 08
// Memory - Delayed recall
//

var subtest8 = (function() {

//
// data
//

//
// test
//
var test = new Subtest();

test.name = 'Memory - Delayed Recall';

test.resources = {
	data: {
		texts: 'intl/$locale/texts.json'
	},
	sfx: {
		instructions: 'intl/$locale/instructions.mp3',
	}
};

test.correctWords = [];
test.distractorWords = [];
test.translatedWords = {};

test.wordsSelected = 0;
test.correctWordsSelected = 0;

test.updateWordButtons = function() {
	var testWordsList = [];
	for (var i = 0; i < 5; i++) {
		testWordsList.push(test.correctWords[i]);
	}
	for (var i = 0; i < 15; i++) {
		testWordsList.push(test.distractorWords[i]);
	}
	Shuffle(testWordsList);
	[
		this.ui.buttonContainerElement1,
		this.ui.buttonContainerElement2,
		this.ui.buttonContainerElement3,
		this.ui.buttonContainerElement4
	].forEach(function(containerElement, cindex) {
		var containerChildren = containerElement.querySelectorAll('.toggle-button');
		var n_buttons = containerChildren.length;
		for (var i = 0; i < n_buttons; i++) {
			var button = containerChildren[i];
			var word = testWordsList[cindex * 5 + i];
			button.innerText = test.translatedWords[word];
			button.setAttribute('data-word', word);
			button.removeAttribute('data-touched');
			button.className = 'narrow toggle-button';
		}
	});
};

test.hideInactiveButtons = function() {
	var buttonContainer1 = test.ui.buttonContainerElement1;
	var buttonContainer2 = test.ui.buttonContainerElement2;
	var buttonContainer3 = test.ui.buttonContainerElement3;
	var buttonContainer4 = test.ui.buttonContainerElement4;
	[buttonContainer1, buttonContainer2, buttonContainer3, buttonContainer4].forEach(function(buttonContainerElement) {
		var buttons = buttonContainerElement.querySelectorAll('.toggle-button');
		var n_buttons = buttons.length;
		for (var i = 0; i < n_buttons; i++) {
			var buttonElement = buttons[i];
			if (buttonElement.getAttribute('data-touched') !== 'yes') {
				$tl.to(buttonElement, TR_DURATION_SHORT, { opacity: 0 });
			}
		}
	});
};

test.registerButtonEvents = function(buttonElement) {
	buttonElement.addEventListener('click', function() {
		if (test.isLocked()) {
			return;
		}
		if (buttonElement.getAttribute('data-touched') === 'yes') {
			return;
		}
		window.parent.enterFullscreen && window.parent.enterFullscreen(); // enter fullscreen when possible
		buttonElement.setAttribute('data-touched', 'yes');
		var buttonWord = buttonElement.getAttribute('data-word');
		if (test.correctWords.indexOf(buttonWord) > -1) {
			// correct word
			buttonElement.className = 'narrow toggle-button active';
			test.correctWordsSelected++;
		}
		else {
			// incorrect word
			buttonElement.className = 'narrow toggle-button mistake';
		}
		if (++test.wordsSelected >= 5) {
			test.lock();
			test.stopTiming();
			var correct = test.correctWordsSelected === 5;

			if (correct) {
				// hide all incorrect buttons
				test.hideInactiveButtons();
				// proceed
				$tl.delayedCall(2, function() {
					Survey.next();
				});
			}
			else {
				// proceed
				$tl.delayedCall(1.5, function() {
					Survey.next();
				});
			}
		}
	});
};


test.init = function() {
	//
	// create test elements
	//

	// instructions
	var instructionsTextElement
		= this.ui.instructionsTextElement
		= document.createElement('p');
	instructionsTextElement.className = 'instructions';
	test.addElement(instructionsTextElement);

	// toggle-buttons
	test.ui.buttons = [];

	var buttonContainerElement1
		= test.ui.buttonContainerElement1
		= document.createElement('div');
	buttonContainerElement1.className = 'button-container row-4-1 container-5';
	test.addElement(buttonContainerElement1);

	for (var i = 0; i < 5; i++) {
		var buttonElement = document.createElement('div');
		buttonElement.className = 'narrow toggle-button';
		buttonContainerElement1.appendChild(buttonElement);
		test.registerButtonEvents(buttonElement);
	}

	var buttonContainerElement2
		= test.ui.buttonContainerElement2
		= document.createElement('div');
	buttonContainerElement2.className = 'button-container row-4-2 container-5';
	test.addElement(buttonContainerElement2);

	for (var i = 0; i < 5; i++) {
		var buttonElement = document.createElement('div');
		buttonElement.className = 'narrow toggle-button';
		buttonContainerElement2.appendChild(buttonElement);
		test.registerButtonEvents(buttonElement);
	}

	var buttonContainerElement3
		= test.ui.buttonContainerElement3
		= document.createElement('div');
	buttonContainerElement3.className = 'button-container row-4-3 container-5';
	test.addElement(buttonContainerElement3);

	for (var i = 0; i < 5; i++) {
		var buttonElement = document.createElement('div');
		buttonElement.className = 'narrow toggle-button';
		buttonContainerElement3.appendChild(buttonElement);
		test.registerButtonEvents(buttonElement);
	}

	var buttonContainerElement4
		= test.ui.buttonContainerElement4
		= document.createElement('div');
	buttonContainerElement4.className = 'button-container row-4-4 container-5';
	test.addElement(buttonContainerElement4);

	for (var i = 0; i < 5; i++) {
		var buttonElement = document.createElement('div');
		buttonElement.className = 'narrow toggle-button';
		buttonContainerElement4.appendChild(buttonElement);
		test.registerButtonEvents(buttonElement);
	}
};

test.enter = function() {
	if (__DEBUG) {
		if (__DEBUG_STOP_AT_TEST !== 8) {
			return Survey.next();
		}
		__DEBUG_RESET();
	}
	// update buttons on test enter since we don't have data in the init stage
	// relies on 1st subtest
	test.updateWordButtons();

	test.lock();
	test.enterFlow('stage0');
};

test.exit = function() {
	var score = test.correctWordsSelected;
	Survey.addUserScore(score);
};

test.flows = {
	stage0: [
		{
			action: function() {
				test.ui.instructionsTextElement.innerHTML = test.assets.data.texts['instructions'];
				test.fadeInElements(test.ui.instructionsTextElement);
				test.showEar();
			},
			delay: 1
		},
		{
			action: function() {
				test.assets.sfx.instructions.play();
			},
			delay: 0.5
		},
		{
			action: function() {
				test.hideEar();
				test.fadeInElements([
					test.ui.buttonContainerElement1,
					test.ui.buttonContainerElement2,
					test.ui.buttonContainerElement3,
					test.ui.buttonContainerElement4
				], function() {
					// begin test
					test.unlock();
					test.startTiming();
				});
			},
			delay: 6.5
		}
	]
};

return {
	setData: function(correctWords, distractorWords, translatedWords) {
		test.correctWords = correctWords;
		test.distractorWords = distractorWords;
		test.translatedWords = translatedWords;
	}
};

}());

