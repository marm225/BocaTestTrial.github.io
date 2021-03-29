//
// Subtest 01
// Memory - Immediate recall
//

(function() { "use strict";

//
// data
//
var wordList = [
	"dog",
	"cat",
	"bunny",
	"monkey",
	"cow",
	"horse",
	"bear",
	"elephant",
	"giraffe",
	"lion",
	"duck",
	"dinosaur",
	"turtle",
	"whale",
	"dolphin",
	"crocodile",
	"chicken",
	"pig",
	"fox",
	"butterfly",
	"camel",
	"mouse",
	"eagle",
	"kangaroo",
	"reindeer",
	"octopus",
	"parrot",
	"penguin",
	"pigeon",
	"lizard",
	"shark",
	"snake",
	"squirrel",
	"swan",
	"zebra"
];

//
// test
//
var test = new Subtest();

test.name = 'Memory - Immediate Recall';

test.resources = {
	data: {
		words: 'intl/$locale/words.json',
		texts: 'intl/$locale/texts.json'
	},
	sfx: {
		instructions1: 'intl/$locale/instructions1.mp3',
		instructions2: 'intl/$locale/instructions2.mp3'
	}
};

test.prepareResources = function() {
	// add words audio to list of resources
	test.correctWords.forEach(function(word, index) {
		var wordIndex = String(test.correctWordsIndices[index]);
		test.resources.sfx['word_' + word] = 'intl/$locale/words/anim_' + wordIndex + '.mp3';
	});
};

test.correctWords = [];
test.correctWordsIndices = [];
test.selectedWords = [];
test.distractorWords = [];

test.wordsSelected = 0;
test.correctWordsSelected = 0;
test.testTries = 0;

test.victoryCondition = false;

test.selectCorrect = function() {
	var origWordList = wordList.slice(0);
	// pick 5 unique words
	for (var i = 0; i < 5; i++) {
		var pickedWord = Pick(wordList);
		test.correctWords.push(pickedWord);
		test.correctWordsIndices.push(origWordList.indexOf(pickedWord));
	}
};

test.selectWords = function() {
	// prepare the list of correct words and associated audio files
	test.correctWords.forEach(function(word) {
		test.selectedWords.push({
			word: word,
			sfx: test.assets.sfx['word_' + word]
		});
	});
};

test.getDistractors = function() {
	// get 15 unique distractors
	test.distractorWords = [];
	for (var i = 0; i < 15; i++) {
		test.distractorWords.push(Pick(wordList));
	}
};

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
			button.innerText = test.assets.data.words[word]; // display localized word
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

test.repeat = function() {
		if (++test.testTries <= 2) {
		$tl.delayedCall(1.5, function() {
			test.fadeOutElements([
				test.ui.instructionsTextElement,
				test.ui.buttonContainerElement1,
				test.ui.buttonContainerElement2,
				test.ui.buttonContainerElement3,
				test.ui.buttonContainerElement4
			], function() {
				// reset score
				test.correctWordsSelected = 0;
				test.wordsSelected = 0;
				// update buttons
				test.updateWordButtons();
				// repeat test
				test.enterFlow('stage0');
			}, true);
		});
	}
	else {
		// tried twice already, proceed to next test
		$tl.delayedCall(1.5, function() {
			Survey.next();
		});
	}
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
				test.victoryCondition = true;
				// hide all incorrect buttons
				test.hideInactiveButtons();
				// stop current test and proceed
				$tl.delayedCall(2, function() {
					Survey.next();
				});
			}
			else {
				test.repeat();
			}
		}
	});
};

test.prepare = function() {
	// select correct words for the test
	test.selectCorrect();
	// now we can populate the resource list with needed audio files
	test.prepareResources();
};

test.init = function() {
	// prepare test words
	test.selectWords();
	test.getDistractors();

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

	// prepare button captions
	this.updateWordButtons();
};

test.enter = function() {
	if (__DEBUG) {
		if (__DEBUG_STOP_AT_TEST !== 1) {
			return Survey.next();
		}
		__DEBUG_RESET();
	}
	this.lock();
	this.enterFlow('stage0');
};

test.exit = function() {
	if (test.victoryCondition) {
		// calculate user score for victory condition
		switch (test.testTries) {
			case 0:
				// victory on first try
				Survey.addUserScore(2);
				break;
			case 1:
				// victory on second try
				Survey.addUserScore(1);
				break;
			case 2:
				// victory on third try
				// no score added
				break;
		}
	}

	// setup data for last test
	test.getDistractors();
	subtest8.setData(
		this.correctWords,
		this.distractorWords,
		this.assets.data.words
	);
};

test.onTimeout = test.repeat;

test.flows = {
	stage0: [
		{
			action: function() {
				test.ui.instructionsTextElement.innerText = test.assets.data.texts['instructions_1'];
				test.fadeInElements(test.ui.instructionsTextElement);
				test.showEar();
			},
			delay: 1
		},
		{
			action: function() {
				test.assets.sfx.instructions1.play();
			},
			delay: 0.5
		},
		{
			action: function() {
				test.fadeOutElements(test.ui.instructionsTextElement);
			},
			delay: 6.5
		},
		{
			action: function() {
				test.selectedWords[0].sfx.play();
			},
			delay: 2
		},
		{
			action: function() {
				test.selectedWords[1].sfx.play();
			},
			delay: 2
		},
		{
			action: function() {
				test.selectedWords[2].sfx.play();
			},
			delay: 2
		},
		{
			action: function() {
				test.selectedWords[3].sfx.play();
			},
			delay: 2
		},
		{
			action: function() {
				test.selectedWords[4].sfx.play();
			},
			delay: 2
		},
		{
			action: function() {
				test.ui.instructionsTextElement.innerText = test.assets.data.texts['instructions_2'];
				test.fadeInElements(test.ui.instructionsTextElement);
			},
			delay: 3
		},
		{
			action: function() {
				test.assets.sfx.instructions2.play();
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
			delay: 2.5
		}
	]
};

}());

