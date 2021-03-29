//
// Subtest 06
// Mental Math
//

(function() { "use strict";

//
// test
//
var test = new Subtest();

test.name = 'Mental Math';

test.resources = {
	data: {
		texts: 'intl/$locale/texts.json'
	},
	sfx: {
		instructions: 'intl/$locale/instructions.mp3',
		plus: 'intl/$locale/plus.mp3',
		minus: 'intl/$locale/minus.mp3'
	}
};

test.numberA = 0;
test.numberB = 0;

test.confirmTap = false;
test.selectedButton = null;

test.roundData = [];
test.testRound = 0;
test.correctAnswers = 0;

test.nextRound = function() {
	$tl.delayedCall(1.5, function() {
		if (test.testRound < 4) {
			test.testRound++;
			test.increaseRoundTitle(true);
			test.enterFlow('stage0');
		}
		else {
			// proceed to next test
			Survey.next();
		}
	});
}

test.showClickAgain = function() {
	$tl.to(test.ui.clickAgainLabelElement, TR_DURATION_SHORT, { opacity: 1, ease: TR_EASE_OUT });
};

test.hideClickAgain = function() {
	$tl.to(test.ui.clickAgainLabelElement, TR_DURATION_SHORTER, { opacity: 0, ease: TR_EASE_OUT });
};

test.activateElements = function(elementList) {
	elementList.forEach(function(element) {
		element.style.display = 'block';
	});
};

test.deactivateElements = function(elementList) {
	elementList.forEach(function(element) {
		element.style.display = 'none';
	});
};

test.prepareResources = function() {
	test.roundData.forEach(function(digitList) {
		digitList.forEach(function(digit) {
			test.resources.sfx['digit_' + digit] = 'intl/$locale/numb_' + digit + '.mp3';
		});
	});
};

test.createTests = function() {
	var trainingRoundData = [];
	for (var i = 0; i < 5; i++) {
		var minA, maxA;
		var minB, maxB;
		switch (i) {
			case 0:
			case 1:
				minA = minB = 6;
				maxA = maxB = 9;
				break;
			case 2:
				minA = 6;
				maxA = 9;
				minB = 16;
				maxB = 19;
				break;
			case 3:
				minA = 16;
				maxA = 19;
				minB = 26;
				maxB = 29;
				break;
			case 4:
				minA = 31;
				maxA = 35;
				minB = 16;
				maxB = 19;
				break;
		}
		var numberA = GetRandomInt(minA, maxA);
		var numberB = numberA;
		var c = 0;
		while (numberB === numberA) {
			// make sure B is uniquely selected
			numberB = GetRandomInt(minB, maxB);
			// sanity check, should never occur
			if (++c > 1000) {
				break;
			}
		}
		if (i === 0) {
			trainingRoundData = [numberA, numberB];
		}
		else if (i === 1) {
			// make sure training level and level 1 are unique
			if (numberA === trainingRoundData[0] && numberB == trainingRoundData[1] ||
				numberA === trainingRoundData[1] && numberB == trainingRoundData[0]) {
				i--;
				continue;
			}
		}
		test.roundData.push(
			[numberA, numberB]
		);
	}
};

test.updateButtonsTexts = function() {
	var answerMin;
	switch (test.testRound) {
		case 0:
		case 1:
		case 4:
			answerMin = 10;
			break;
		case 2:
			answerMin = 20;
			break;
		case 3:
			answerMin = 30;
			break;
	}
	for (var i = 0; i <= 20; i++) {
		var buttonElement = test.ui.buttons[i];
		var digit = answerMin + i;
		buttonElement.innerText = digit;
		buttonElement.setAttribute('data-digit', digit);
	}
};

test.prepare = function() {
	// prepare tests
	test.createTests();
	// queue the required test resources
	test.prepareResources();
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

	//
	// buttons
	//
	test.ui.buttons = [];
	test.ui.buttonContainers = [];

	var tbClassname = 'toggle-button digit clickagain';

	function fadeOutContainers(done) {
		test.fadeOutElements(test.ui.buttonContainers, function() {
			test.deactivateElements(test.ui.buttonContainers);
			if (done instanceof Function) {
				done();
			}
		});
	}

	function fadeOutIncorrect(done) {
		var incorrectButtons = [];
		for (var i = 0; i < test.ui.buttons.length; i++) {
			var btnElement = test.ui.buttons[i];
			if (btnElement.getAttribute('data-selected') !== 'true') {
				incorrectButtons.push(btnElement);
			}
		}
		test.fadeOutElements(incorrectButtons, function() {
			if (done instanceof Function) {
				done();
			}
		});
	}

	function resetButtons() {
		test.ui.buttons.forEach(function(item) {
			item.className = tbClassname;
			item.removeAttribute('data-selected');
			$tl.set(item, { opacity: 1 });
		});
	}

	for (var i = 0; i < 3; i++) {
		var digitButtonContainerElement
			= test.ui['digitButtonContainerElement' + (i + 1)]
			= document.createElement('div');
		digitButtonContainerElement.className = 'button-container row-3-' + (i + 1) + ' container-7';
		digitButtonContainerElement.style.display = 'none';
		test.addElement(digitButtonContainerElement);
		test.ui.buttonContainers.push(digitButtonContainerElement);

		var n_buttons = 7;

		for (var j = 0; j < n_buttons; j++) {
			var buttonElement = document.createElement('div');
			buttonElement.className = tbClassname;
			digitButtonContainerElement.appendChild(buttonElement);
			test.ui.buttons.push(buttonElement);

			buttonElement.addEventListener('click', function() {
				if (test.isLocked()) {
					return;
				}
				window.parent.enterFullscreen && window.parent.enterFullscreen(); // enter fullscreen when possible
				if (!test.confirmTap) {
					this.className = tbClassname + ' active';
					this.setAttribute('data-selected', 'true');
					test.showClickAgain();
					test.confirmTap = true;
					test.selectedButton = this;
				}
				else if (test.selectedButton) {
					var selectedBtn = test.selectedButton;
					if (this.getAttribute('data-selected') === 'true') {
						test.lock();
						test.stopTiming();

						var buttonAnswer = parseInt(this.getAttribute('data-digit'), 10);
						var roundData = test.roundData[test.testRound];
						var numberA = roundData[0];
						var numberB = roundData[1];
						var correctAnswer = (test.testRound < 4)
							? numberA + numberB
							: numberA - numberB;
						var correct = buttonAnswer === correctAnswer;

						var selfBtn = this;

						if (correct) {
							if (test.testRound > 0) {
								test.correctAnswers++;
								Survey.addUserTally(test.testRound - 1, 1);
							}
							fadeOutIncorrect(function() {
								$tl.delayedCall(1.5, function() {
									if (test.testRound < 4) {
										fadeOutContainers(function() {
											resetButtons();
											// proceed to next round
											test.nextRound();
										});
									}
									else {
										Survey.next();
									}
								});
							});

						}
						else {
							selectedBtn.className = tbClassname + ' mistake';
							if (test.testRound === 4) {
								// proceed straight away on final round
								test.nextRound();
							}
							else {
								$tl.delayedCall(1.5, function() {
									fadeOutContainers(function() {
										resetButtons();
										if (test.testRound === 0) {
											// mistake on training level, repeat test
											test.enterFlow('stage0');
										}
										else {
											// proceed
											test.nextRound();
										}
									});
								});
							}
						}

					}
					else {
						selectedBtn.className = tbClassname;
						selectedBtn.removeAttribute('data-selected');
					}
					test.selectedButton = null;
					test.hideClickAgain();
					test.confirmTap = false;
				}
			});
		}
	}

	// click again label
	var clickAgainLabelElement
		= test.ui.clickAgainLabelElement
		= document.createElement('div');
	clickAgainLabelElement.className = 'click-again-label';
	clickAgainLabelElement.innerText = test.assets.data.texts['click_again'];
	test.addElement(clickAgainLabelElement);

	// initialize round numbers
	test.increaseRoundTitle(true);
};

test.enter = function() {
	if (__DEBUG) {
		if (__DEBUG_STOP_AT_TEST !== 6) {
			return Survey.next();
		}
		__DEBUG_RESET();
	}
	this.lock();
	this.enterFlow('stage0');
};

test.exit = function() {
	Survey.addUserScore(test.correctAnswers);
};

test.flows = {
	stage0: [
		{
			action: function() {
				test.ui.instructionsTextElement.innerText = test.assets.data.texts['instructions'];
				test.fadeInElements(test.ui.instructionsTextElement);
			},
			delay: 1
		},
		{
			action: function() {
				test.assets.sfx.instructions.play();
				test.showEar();
			},
			delay: 0.5
		},
		{
			action: function() {
				test.enterFlow('stage1')
			},
			delay: 3.5
		}
	],
	stage1: [
		{
			action: function() {
				var numberA = test.roundData[test.testRound][0];
				test.assets.sfx['digit_' + numberA].play();
			},
			delay: 1
		},
		{
			action: function() {
				if (test.testRound < 4) {
					test.assets.sfx.plus.play();
				}
				else {
					test.assets.sfx.minus.play();
				}
			},
			delay: 1.5
		},
		{
			action: function() {
				var numberB = test.roundData[test.testRound][1];
				test.assets.sfx['digit_' + numberB].play();
			},
			delay: 1.5
		},
		{
			action: function() {
				test.hideEar();
				var containers = [
					test.ui.digitButtonContainerElement1,
					test.ui.digitButtonContainerElement2,
					test.ui.digitButtonContainerElement3
				];
				test.updateButtonsTexts();
				test.activateElements(containers);
				test.fadeInElements(containers, function() {
					// begin round
					test.unlock();
					test.startTiming();
				});
			},
			delay: 1.5
		}
	]
};

}());

