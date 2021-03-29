//
// Subtest 03
// Executive function / Mental rotation
//

(function() { "use strict";

//
// data
//

//
// test
//
var test = new Subtest();

test.name = 'Executive function / Mental rotation';

test.resources = {
	data: {
		texts: 'intl/$locale/texts.json'
	},
	graphics: {},
	sfx: {
		instructions: 'intl/$locale/instructions.mp3',
	}
};

test.confirmTap = false;
test.selectedButton = null;

test.roundData = [];
test.testRound = 0;
test.correctAnswers = 0;

test.showClickAgain = function() {
	$tl.to(test.ui.clickAgainLabelElement, TR_DURATION_SHORT, { opacity: 1, ease: TR_EASE_OUT });
};

test.hideClickAgain = function() {
	$tl.to(test.ui.clickAgainLabelElement, TR_DURATION_SHORTER, { opacity: 0, ease: TR_EASE_OUT });
};

test.activateElement = function(element) {
	element.style.display = 'block';
};

test.deactivateElement = function(element) {
	element.style.display = 'none';
};

test.updateImages = function() {
	var dataItem = test.roundData[test.testRound];
	var c1 = test.assets.graphics['answer_' + dataItem[0]];
	var c2 = test.assets.graphics['answer_' + dataItem[1]];
	var d1 = test.assets.graphics['answer_' + dataItem[2]];
	var d2 = test.assets.graphics['answer_' + dataItem[3]];
	test.ui.controlImageElement.style.backgroundImage = 'url(' + c1.src + ')';

	var answerImgs = [c2, d1, d2];

	var btns = test.ui.buttons.slice(0);
	Shuffle(btns);
	btns.forEach(function(buttonElement, index) {
		buttonElement.style.backgroundImage = 'url(' + answerImgs[index].src + ')';
		buttonElement.setAttribute('data-correct', (index === 0) ? 'true' : 'false');
	});

};

test.resetButtons = function() {
	test.ui.buttons.forEach(function(btnElement) {
		btnElement.className = 'toggle-button';
		btnElement.removeAttribute('data-selected');
		$tl.set(btnElement, { opacity: 1 });
	});
};

test.prepareResources = function() {
	test.roundData.forEach(function(dataItem) {
		dataItem.forEach(function(answer) {
			test.resources.graphics['answer_' + answer] = 'figures/' + answer + '.svg';
		});
	});
};

test.createTests = function() {
	function prependZero(number) {
		var ret = String(number);
		if (ret.length === 1) {
			return '0' + ret;
		}
		return ret;
	}

	// make sure we generate unique intro and round 1 groups since they use the same sprite set
	var roundIntroRndGroup = GetRandomInt(1, 10);
	var round1RndGroup = roundIntroRndGroup;
	while (round1RndGroup === roundIntroRndGroup) {
		round1RndGroup = GetRandomInt(1, 10);
	}

	var roundIntro_group = prependZero(roundIntroRndGroup);
	var roundIntro_fid = 'mr1_' + roundIntro_group + '_';
	var round1_group = prependZero(round1RndGroup);
	var round1_fid = 'mr1_' + round1_group + '_';
	var round2_group = prependZero(GetRandomInt(11, 40));
	var round2_fid = 'mr2_' + round2_group + '_';
	var round3_group = prependZero(GetRandomInt(51, 80));
	var round3_fid = 'mr3_' + round3_group + '_';

	[roundIntro_fid, round1_fid, round2_fid, round3_fid].forEach(function(fid) {
		var c1first = GetRandomInt(1, 2) === 1;
		test.roundData.push([
			fid + ((c1first) ? 'c1' : 'c2'), // correct 1
			fid + ((c1first) ? 'c2' : 'c1'), // correct 2
			fid + 'd1', // distractor 1
			fid + 'd2' // distractor 2
		]);
	});
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

	// control image
	var controlImageElement
		= test.ui.controlImageElement
		= document.createElement('div');
	controlImageElement.className = 'control-image';
	test.addElement(controlImageElement);

	//
	// buttons
	//
	test.ui.buttons = [];

	// answer buttons
	var buttonContainerElement
		= test.ui.buttonContainerElement
		= document.createElement('div');
	buttonContainerElement.className = 'button-container';
	buttonContainerElement.style.display = 'none';
	test.addElement(buttonContainerElement);

	function proceed() {
		$tl.delayedCall(1.5, function() {
			if (test.testRound === 3) {
				// proceed to next test
				Survey.next();
			}
			else {
				// prepare next round
				test.fadeOutElements(test.ui.buttonContainerElement);
				test.fadeOutElements(test.ui.controlImageElement, function() {
					// deactivate and reset buttons
					test.deactivateElement(test.ui.buttonContainerElement);
					test.resetButtons();
					// setup next round
					test.testRound++;
					test.updateImages();
					test.confirmTap = false;
					test.selectedButton = null;
					//  proceed
					test.increaseRoundTitle(true);
					test.enterFlow('stage0');
				});
			}
		});
	}

	for (var i = 0; i < 3; i++) {
		var buttonElement = document.createElement('div');
		buttonElement.className = 'toggle-button';
		buttonContainerElement.appendChild(buttonElement);
		test.ui.buttons.push(buttonElement);

		var buttonElementCorrectText = document.createElement('div');
		buttonElementCorrectText.className = 'correct caption';
		buttonElementCorrectText.innerText = test.assets.data.texts['correct'];
		buttonElement.appendChild(buttonElementCorrectText);

		var buttonElementIncorrectText = document.createElement('div');
		buttonElementIncorrectText.className = 'incorrect caption';
		buttonElementIncorrectText.innerText = test.assets.data.texts['incorrect'];
		buttonElement.appendChild(buttonElementIncorrectText);

		buttonElement.addEventListener('click', function() {
			if (test.isLocked()) {
				return;
			}
			var isMarkedMistake = test.testRound === 0 && (' ' + this.className + ' ').indexOf('mistake') > -1;
			if (isMarkedMistake) {
				return;
			}
			window.parent.enterFullscreen && window.parent.enterFullscreen(); // enter fullscreen when possible
			if (!test.confirmTap) {
				this.className = 'toggle-button active';
				this.setAttribute('data-selected', 'true');
				test.showClickAgain();
				test.confirmTap = true;
				test.selectedButton = this;
			}
			else if (test.selectedButton) {
				var selectedBtn = test.selectedButton;
				if (this.getAttribute('data-selected') === 'true' && !isMarkedMistake) {
					test.lock();
					var isCorrect = this.getAttribute('data-correct') === 'true';
					if (isCorrect) {
						test.stopTiming();
						selectedBtn.className += ' correct';
						if (test.testRound === 0) { // only display correct text on intro round
							selectedBtn.className += ' with-caption';
						}
						if (test.testRound > 0) { // don't count the intro round
							test.correctAnswers++;
							Survey.addUserTally(test.testRound - 1, 1);
						}
						// fade out incorrect choices
						var incorrectButtons = [];
						test.ui.buttons.forEach(function(btnElement) {
							if (btnElement.getAttribute('data-correct') === 'false') {
								incorrectButtons.push(btnElement);
							}
						});
						test.fadeOutElements(incorrectButtons, function() {
							proceed();
						});
					}
					else {
						// mistake
						selectedBtn.className = 'toggle-button mistake';
						if (test.testRound === 0) { // only display incorrect text on intro round
							selectedBtn.className += ' with-caption';
						}
						if (test.testRound === 0) {
							// this is the learning round
							// allow further input
							test.confirmTap = false;
							test.selectedButton = null;
							test.unlock();
						}
						else {
							test.stopTiming();
							// proceed to next test
							proceed();
						}
					}
				}
				else {
					selectedBtn.className = 'toggle-button';
					selectedBtn.removeAttribute('data-selected');
				}
				test.selectedButton = null;
				test.hideClickAgain();
				test.confirmTap = false;
			}
		});
	}

	// click again label
	var clickAgainLabelElement
		= test.ui.clickAgainLabelElement
		= document.createElement('div');
	clickAgainLabelElement.className = 'click-again-label';
	clickAgainLabelElement.innerText = test.assets.data.texts['click_again'];
	test.addElement(clickAgainLabelElement);

	// update round
	this.updateImages();

	// initialize round numbers
	test.increaseRoundTitle(true);
};

test.enter = function() {
	if (__DEBUG) {
		if (__DEBUG_STOP_AT_TEST !== 3) {
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
			},
			delay: 4.5
		},
		{
			action: function() {
				test.enterFlow('stage1');
			}
		}
	],
	stage1: [
		{
			action: function() {
				test.fadeInElements(test.ui.controlImageElement);
			}
		},
		{
			action: function() {
				test.activateElement(test.ui.buttonContainerElement);
				test.fadeInElements(test.ui.buttonContainerElement, function() {
					// begin round
					test.unlock();
					test.startTiming();
				});
			},
			delay: 1
		}
	]
};

}());

