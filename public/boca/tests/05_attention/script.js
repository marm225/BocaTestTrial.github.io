//
// Subtest 05
// Attention
//

(function() { "use strict";

//
// data
//

var digitsList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

//
// test
//
var test = new Subtest();

test.name = 'Attention';

test.resources = {
	data: {
		texts: 'intl/$locale/texts.json'
	},
	sfx: {
		instructions1: 'intl/$locale/instructions1.mp3',
		instructions2: 'intl/$locale/instructions2.mp3'
	}
};

// add digits audio to list of resources
digitsList.forEach(function(digit) {
	test.resources.sfx['digit_' + digit] = 'intl/$locale/numb_' + digit + '.mp3';
});

test.selectedDigits = [];
test.correctDigits = [];

test.lockButtons = false;
test.userDigits = [];

test.testRound = 0;
test.userFinishedRounds = 0;

test.trainingRoundData = [];

test.selectDigits = function(n_digits) {
	function compareArrays(a, b) {
		if (a === b) {
			return true;
		}
		if (a == null || b == null) {
			return false;
		}
		if (a.length != b.length) {
			return false;
		}
		for (var i = 0; i < a.length; i++) {
			if (a[i] !== b[i]) {
				return false;
			}
		}
		return true;
	}
	var digits = digitsList.slice(0);
	test.selectedDigits = [];
	test.correctDigits = [];
	for (var i = 0; i < n_digits; i++) {
		var pickedDigit = Pick(digits);
		test.selectedDigits.push({
			digit: pickedDigit,
			sfx: test.assets.sfx['digit_' + pickedDigit]
		});
		test.correctDigits.push(pickedDigit);
	}
	if (test.testRound === 0) {
		test.trainingRoundData = test.correctDigits.slice(0);
	}
	else if (test.testRound === 1) {
		// make sure level 1 and the training levels are unique
		if (compareArrays(test.correctDigits, test.trainingRoundData)) {
			return test.selectDigits(n_digits);
		}
	}
};

test.updateDigitButtons = function() {
	[
		this.ui.buttonContainerElement1,
		this.ui.buttonContainerElement2
	].forEach(function(containerElement, cindex) {
		var containerChildren = containerElement.querySelectorAll('.toggle-button');
		var n_buttons = containerChildren.length;
		for (var i = 0; i < n_buttons; i++) {
			var button = containerChildren[i];
			var digit = digitsList[cindex * 5 + i];
			button.setAttribute('data-digit', digit);
			button.removeAttribute('data-touched');
			button.removeAttribute('style');
			button.className = 'toggle-button digit';
		}
	});
};

test.hideInactiveButtons = function() {
	var buttonContainer1 = test.ui.buttonContainerElement1;
	var buttonContainer2 = test.ui.buttonContainerElement2;
	[buttonContainer1, buttonContainer2].forEach(function(buttonContainerElement) {
		var buttons = buttonContainerElement.querySelectorAll('.toggle-button');
		var n_buttons = buttons.length;
		for (var i = 0; i < n_buttons; i++) {
			var buttonElement = buttons[i];
			if (buttonElement.getAttribute('data-touched') !== 'yes') {
				$tl.to(buttonElement, TR_DURATION_SHORT, { opacity: 0 });
			}
		}
	});
}

test.prepareTest = function() {
	test.userDigits = [];
	test.updateDigitButtons();
};

test.prepareRound = function() {
	// prepare digits for first stage
	var n_digits;
	switch (this.testRound) {
		case 0:
		case 1:
			n_digits = 4;
			break;
		case 2:
			n_digits = 5;
			break;
		case 3:
			n_digits = 3;
			break;
		case 4:
			n_digits = 4;
			break;
	}
	test.selectDigits(n_digits);
	test.prepareTest();
};

test.registerButtonEvents = function(buttonElement) {
	function proceed() {
		$tl.delayedCall(1.5, function() {
			if (test.testRound === 4) {
				// test done, proceed to next test
				Survey.next();
			}
			else {
				// proceed to next round
				test.fadeOutElements([
					test.ui.instructionsTextElement,
					test.ui.buttonContainerElement1,
					test.ui.buttonContainerElement2
				], function() {
					// proceed to next round
					test.testRound++;
					test.prepareRound();
					test.increaseRoundTitle(true);
					test.enterFlow('stage0');
				});
			}
		});
	}

	buttonElement.addEventListener('click', function() {
		if (test.isLocked() || test.lockButtons) {
			return;
		}
		if (buttonElement.getAttribute('data-touched') === 'yes') {
			return;
		}
		var n_digits = test.correctDigits.length;
		if (test.userDigits.length >= n_digits) {
			return;
		}
		window.parent.enterFullscreen && window.parent.enterFullscreen(); // enter fullscreen when possible
		buttonElement.setAttribute('data-touched', 'yes');
		var digit = parseInt(buttonElement.getAttribute('data-digit'), 10);
		test.userDigits.push(digit);
		var n_digits_user = test.userDigits.length;
		var mismatch = false;
		for (var i = 0; i < n_digits_user; i++) {
			var testOrder = false;
			if (test.testRound < 3) {
				// test forward order
				testOrder = test.userDigits[i] === test.correctDigits[i]
			}
			else {
				// test backwards order
				testOrder = test.userDigits[i] === test.correctDigits[n_digits - i - 1]
			}
			if (!testOrder) {
				mismatch = true;
				break;
			}
		}
		if (!mismatch) {
			// correct answer
			buttonElement.className = 'toggle-button digit active';
			if (n_digits_user === n_digits) {
				// round done
				test.lock();
				test.stopTiming();
				test.hideInactiveButtons();
				if (test.testRound > 0) {
					test.userFinishedRounds++;
					Survey.addUserTally(test.testRound - 1, 1);
				}
				proceed();
			}
		}
		else {
			// mistake
			buttonElement.className = 'toggle-button digit mistake';
			test.lock();
			test.stopTiming();
			if (test.testRound > 0) {
				proceed();
			}
			else if (test.testRound === 0) {
				// repeat test round
				$tl.delayedCall(1.5, function() {
					test.fadeOutElements([
						test.ui.instructionsTextElement,
						test.ui.buttonContainerElement1,
						test.ui.buttonContainerElement2
					], function() {
						test.prepareTest();
						test.enterFlow('stage0');
					});
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

	// buttons
	test.ui.buttons = [];

	var buttonContainerElement1
		= test.ui.buttonContainerElement1
		= document.createElement('div');
	buttonContainerElement1.className = 'button-container row-2-1 container-5';
	test.addElement(buttonContainerElement1);

	for (var i = 0; i < 5; i++) {
		var buttonElement = document.createElement('div');
		buttonElement.className = 'toggle-button digit';
		buttonElement.innerText = String(i);
		buttonContainerElement1.appendChild(buttonElement);
		test.registerButtonEvents(buttonElement);
	}

	var buttonContainerElement2
		= test.ui.buttonContainerElement2
		= document.createElement('div');
	buttonContainerElement2.className = 'button-container row-2-2 container-5';
	test.addElement(buttonContainerElement2);

	for (var i = 0; i < 5; i++) {
		var buttonElement = document.createElement('div');
		buttonElement.className = 'toggle-button digit';
		buttonElement.innerText = String(5 + i);
		buttonContainerElement2.appendChild(buttonElement);
		test.registerButtonEvents(buttonElement);
	}

	// prepare first round
	test.prepareRound();

	// initialize round numbers
	test.increaseRoundTitle(true);
};

test.enter = function() {
	if (__DEBUG) {
		if (__DEBUG_STOP_AT_TEST !== 5) {
			return Survey.next();
		}
		__DEBUG_RESET();
	}
	this.lock();
	this.enterFlow('stage0');
};

test.exit = function() {
	// tally user score
	Survey.addUserScore(test.userFinishedRounds);
};

test.flows = {
	stage0: [
		{
			action: function() {
				if (test.testRound < 3) {
					test.ui.instructionsTextElement.innerText = test.assets.data.texts['instructions_1'];
				}
				else {
					test.ui.instructionsTextElement.innerText = test.assets.data.texts['instructions_2'];
				}
				test.fadeInElements(test.ui.instructionsTextElement);
				test.showEar();
			},
			delay: 1
		},
		{
			action: function() {
				if (test.testRound < 3) {
					test.assets.sfx.instructions1.play();
					$tl.delayedCall(5, function() {
						test.enterFlow('readDigits');
					});
				}
				else {
					test.assets.sfx.instructions2.play();
					$tl.delayedCall(4.5, function() {
						test.enterFlow('readDigits');
					});
				}
			},
			delay: 0.5
		}
	],
	readDigits: [
		{
			action: function() {
				// read digits
				var n_digits = test.selectedDigits.length;
				for (var i = 0; i < n_digits; i++) {
					(function(index) {
						$tl.delayedCall(1.5 * index, function() {
							test.selectedDigits[index].sfx.play();
						});
					}(i));
				}
				$tl.delayedCall(1.5 * n_digits, function() {
					test.enterFlow('beginTest');
				})
			}
		}
	],
	beginTest: [
		{
			action: function() {
				test.hideEar();
				test.fadeInElements([
					test.ui.buttonContainerElement1,
					test.ui.buttonContainerElement2
				], function() {
					// begin test
					test.unlock();
					test.startTiming();
				});
			}
		}
	]
};

}());

