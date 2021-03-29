//
// Subtest 02
// Language / Prefrontal synthesis
//

(function() { "use strict";

//
// data
//

var L1_questions = [
	'ps_l1_11',
	'ps_l1_12',
	'ps_l1_13',
	'ps_l1_14',
	'ps_l1_15',
	'ps_l1_16',
	'ps_l1_17',
	'ps_l1_18',
	'ps_l1_19'
];

var L2_questions = [
	'ps_l2_11',
	'ps_l2_12',
	'ps_l2_13',
	'ps_l2_14',
	'ps_l2_15',
	'ps_l2_16',
	'ps_l2_17',
	'ps_l2_18',
	'ps_l2_19',
	'ps_l2_20',
	'ps_l2_21',
	'ps_l2_22',
	'ps_l2_23',
	'ps_l2_24',
	'ps_l2_25',
	'ps_l2_26',
	'ps_l2_27',
	'ps_l2_28'
];

var L3_questions = [
	'ps_l3_11',
	'ps_l3_12',
	'ps_l3_13',
	'ps_l3_14',
	'ps_l3_15',
	'ps_l3_16',
	'ps_l3_17',
	'ps_l3_18',
	'ps_l3_19',
	'ps_l3_20',
	'ps_l3_21',
	'ps_l3_22'
];

var L3_answers = [
	'ps_l3_11',
	'ps_l3_12',
	'ps_l3_13',
	'ps_l3_14',
	'ps_l3_15',
	'ps_l3_16',
	'ps_l3_13',
	'ps_l3_15',
	'ps_l3_11',
	'ps_l3_16',
	'ps_l3_12',
	'ps_l3_14'
];

var L4_questions = [
	['ps_l4_11', ['girl', 'boy']],
	['ps_l4_12', ['girl', 'boy']],
	['ps_l4_13', ['girl', 'boy']],
	['ps_l4_14', ['girl', 'boy']],
	['ps_l4_15', ['boy', 'girl']],
	['ps_l4_16', ['lion', 'tiger']],
	['ps_l4_17', ['leopard', 'jaguar']],
	['ps_l4_18', ['cheetah', 'hyena']],
	['ps_l4_19', ['jaguar', 'lion']],
	['ps_l4_20', ['blue', 'red']],
	['ps_l4_21', ['blue', 'green']],
	['ps_l4_22', ['yellow', 'green']],
	['ps_l4_23', ['green', 'yellow']],
	['ps_l4_24', ['red', 'yellow']],
	['ps_l4_25', ['yellow', 'red']],
	['ps_l4_26', ['white', 'black']],
	['ps_l4_27', ['black', 'white']],
	['ps_l4_28', ['boy', 'girl']],
	['ps_l4_29', ['boy', 'girl']],
	['ps_l4_30', ['girl', 'boy']],
	['ps_l4_31', ['boy', 'girl']],
	['ps_l4_32', ['boy', 'girl']],
	['ps_l4_33', ['girl', 'boy']],
	['ps_l4_34', ['boy', 'girl']],
	['ps_l4_35', ['boy', 'girl']],
	['ps_l4_36', ['boy', 'girl']],
	['ps_l4_37', ['boy', 'girl']],
	['ps_l4_38', ['girl', 'boy']],
	['ps_l4_39', ['tiger', 'lion']],
	['ps_l4_40', ['jaguar', 'leopard']],
	['ps_l4_41', ['hyena', 'cheetah']],
	['ps_l4_42', ['lion', 'jaguar']],
	['ps_l4_43', ['red', 'blue']],
	['ps_l4_44', ['blue', 'red']],
	['ps_l4_45', ['green', 'yellow']],
	['ps_l4_46', ['yellow', 'green']],
	['ps_l4_47', ['yellow', 'red']],
	['ps_l4_48', ['red', 'yellow']],
	['ps_l4_49', ['black', 'white']],
	['ps_l4_50', ['white', 'black']],
	['ps_l4_51', ['girl', 'boy']],
	['ps_l4_52', ['girl', 'boy']],
	['ps_l4_53', ['boy', 'girl']],
	['ps_l4_54', ['girl', 'boy']],
	['ps_l4_55', ['girl', 'boy']],
	['ps_l4_56', ['boy', 'girl']]
];

var L5_questions = [
	['ps_l5_11', ['girl', 'boy', 'monkey']],
	['ps_l5_12', ['girl', 'boy', 'monkey']],
	['ps_l5_13', ['girl', 'boy', 'monkey']],
	['ps_l5_14', ['girl', 'boy', 'monkey']],
	['ps_l5_15', ['girl', 'boy', 'monkey']],
	['ps_l5_16', ['girl', 'boy', 'monkey']],
	['ps_l5_17', ['girl', 'boy', 'monkey']],
	['ps_l5_18', ['girl', 'boy', 'monkey']],
	['ps_l5_19', ['girl', 'boy', 'monkey']],
	['ps_l5_20', ['girl', 'boy', 'monkey']],
	['ps_l5_21', ['girl', 'boy', 'monkey']],
	['ps_l5_22', ['girl', 'boy', 'monkey']],
	['ps_l5_23', ['girl', 'boy', 'monkey']],
	['ps_l5_24', ['girl', 'boy', 'monkey']],
	['ps_l5_25', ['girl', 'boy', 'monkey']],
	['ps_l5_26', ['girl', 'boy', 'monkey']],
	['ps_l5_27', ['boy', 'girl', 'monkey']],
	['ps_l5_28', ['boy', 'girl', 'monkey']],
	['ps_l5_29', ['boy', 'girl', 'monkey']],
	['ps_l5_30', ['boy', 'girl', 'monkey']],
	['ps_l5_31', ['boy', 'girl', 'monkey']],
	['ps_l5_32', ['boy', 'girl', 'monkey']],
	['ps_l5_33', ['boy', 'girl', 'monkey']],
	['ps_l5_34', ['boy', 'girl', 'monkey']],
	['ps_l5_35', ['boy', 'girl', 'monkey']],
	['ps_l5_36', ['boy', 'girl', 'monkey']],
	['ps_l5_37', ['boy', 'girl', 'monkey']],
	['ps_l5_38', ['boy', 'girl', 'monkey']],
	['ps_l5_39', ['boy', 'girl', 'monkey']],
	['ps_l5_40', ['boy', 'girl', 'monkey']],
	['ps_l5_41', ['boy', 'girl', 'monkey']],
	['ps_l5_42', ['boy', 'girl', 'monkey']],
	['ps_l5_43', ['monkey', 'boy', 'girl']],
	['ps_l5_44', ['monkey', 'boy', 'girl']],
	['ps_l5_45', ['monkey', 'boy', 'girl']],
	['ps_l5_46', ['monkey', 'boy', 'girl']],
	['ps_l5_47', ['monkey', 'boy', 'girl']],
	['ps_l5_48', ['monkey', 'boy', 'girl']],
	['ps_l5_49', ['monkey', 'boy', 'girl']],
	['ps_l5_50', ['monkey', 'boy', 'girl']],
	['ps_l5_51', ['monkey', 'boy', 'girl']],
	['ps_l5_52', ['monkey', 'boy', 'girl']],
	['ps_l5_53', ['monkey', 'boy', 'girl']],
	['ps_l5_54', ['monkey', 'boy', 'girl']],
	['ps_l5_55', ['monkey', 'boy', 'girl']],
	['ps_l5_56', ['monkey', 'boy', 'girl']],
	['ps_l5_57', ['monkey', 'boy', 'girl']],
	['ps_l5_58', ['monkey', 'boy', 'girl']]
];

//
// test
//
var test = new Subtest();

test.name = 'Language / Prefrontal Synthesis';

test.resources = {
	data: {
		words: 'intl/$locale/words.json',
		texts: 'intl/$locale/texts.json'
	},
	graphics: {},
	sfx: {}
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

test.showCorrectLabel = function(isCorrect) {
	test.ui.correctLabelElement.innerText = (isCorrect) ? test.assets.data.texts['correct'] : test.assets.data.texts['incorrect'];
	test.ui.correctLabelElement.className = (isCorrect) ? 'correct-label correct' : 'correct-label incorrect';
	$tl.to(test.ui.correctLabelElement, TR_DURATION_SHORT, { opacity: 1, ease: TR_EASE_OUT });
};

test.hideCorrectLabel = function() {
	$tl.to(test.ui.correctLabelElement, TR_DURATION_SHORTER, { opacity: 0, ease: TR_EASE_OUT });
};

test.activateElements = function(elements) {
	elements = (elements instanceof Array) ? elements : [elements];
	elements.forEach(function(element) {
		element.style.display = 'block';
	});
};

test.deactivateElements = function(elements) {
	elements = (elements instanceof Array) ? elements : [elements];
	elements.forEach(function(element) {
		element.style.display = 'none';
	});
};

test.prepareResources = function() {
	// import all SVGs for L1, L2, L3 questions
	var L3_neededQuestions = L3_questions.slice(0, 6);
	[L1_questions, L2_questions, L3_neededQuestions].forEach(function(questionsItem) {
		questionsItem.forEach(function(item) {
			test.resources.graphics[item] = 'figures/' + item + '.svg';
		});
	});
	// import instructions
	test.roundData.forEach(function(item, index) {
		test.resources.sfx['instructions' + (index + 1)] = 'intl/$locale/instructions/' + item[0] + '.mp3';
	});
};

test.createTests = function() {
	var l1data = L1_questions.slice(0);
	var l2data = L2_questions.slice(0);
	var l3data = L3_questions.slice(0);
	test.roundData = [
		// L1
		[Pick(l1data)],
		// L1 - repeated
		[Pick(l1data)],
		// L2
		[Pick(l2data)],
		// L3
		[Pick(l3data)],
		// L4,
		Choose(L4_questions),
		// L5
		Choose(L5_questions)
	];
};

test.prepare = function() {
	// prepare tests
	test.createTests();
	// queue required test resources
	test.prepareResources();
};

test.init = function() {
	//
	// create test elements
	//
	
	// buttons
	test.ui.buttonContainers = [];

	// L1-L3 buttons
	function L13_proceed(buttonContainers) {
		$tl.delayedCall(1.5, function() {
			// prepare and proceed to next round
			test.fadeOutElements(buttonContainers, function() {
				test.deactivateElements(buttonContainers);
				if (test.testRound === 0) {
					// proceeding from training level, need to do some cleanup
					buttonContainers.forEach(function(item) {
						var buttonElms = item.querySelectorAll('.toggle-button');
						for (var bn = 0; bn < buttonElms.length; bn++) {
							var btnElement = buttonElms[bn];
							$tl.set(btnElement, { opacity: 1 });
							btnElement.className = 'toggle-button';
							btnElement.removeAttribute('data-selected');
							btnElement.removeAttribute('data-correct');
						}
					});
				}
				test.testRound++;
				test.confirmTap = false;
				test.selectedButton = null;
				test.increaseRoundTitle(true);
				if (test.testRound < 4) {
					test.enterFlow('stage0');
				}
				else {
					test.enterFlow('stage1');
				}
			});
		});
	}

	function L4_proceed(buttonContainers) {
		// proceed to final round
		$tl.delayedCall(1.5, function() {
			test.fadeOutElements(buttonContainers, function() {
				test.deactivateElements(buttonContainers);
				test.increaseRoundTitle(true);
				test.testRound = 5;
				test.enterFlow('stage1');
			});
		});
	}

	var L1_shuffled = L1_questions.slice(0);
	var L2_shuffled = L2_questions.slice(0);
	var L3_shuffled = L3_questions.slice(0, 6);
	Shuffle(L1_shuffled);
	Shuffle(L2_shuffled);
	Shuffle(L3_shuffled);
	[L1_shuffled, L2_shuffled, L3_shuffled].forEach(function(questionsItem, lindex) {
		var stageContainer = [];
		test.ui.buttonContainers.push(stageContainer);
		var n_rows;
		switch (lindex) {
			case 0:
				n_rows = 2;
				break;
			case 1:
				n_rows = 3;
				break;
			case 2:
				n_rows = 1;
				break;
		}
		var btn_i = 0;
		for (var i = 0; i < n_rows; i++) {

			var n_buttons;
			if (lindex === 0) {
				n_buttons = (i === 0) ? 5 : 4;
			}
			else {
				n_buttons = 6;
			}

			var buttonContainerElement
				= document.createElement('div');
			buttonContainerElement.className = 'button-container row-' + n_rows + '-' + (i + 1) + ' ' + 'ltest' + (lindex + 1);
			test.addElement(buttonContainerElement);
			stageContainer.push(buttonContainerElement);

			for (var j = 0; j < n_buttons; j++) {
				var buttonElement = document.createElement('div');
				buttonElement.className = 'toggle-button';
				buttonContainerElement.appendChild(buttonElement);
				
				var q = questionsItem[btn_i];
				var imgData = test.assets.graphics[q];

				buttonElement.setAttribute('data-test', q);
				buttonElement.style.backgroundImage = 'url(' + imgData.src  + ')';
				btn_i++;

				buttonElement.addEventListener('click', function() {
					if (test.isLocked()) {
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
						var containersIndex = (test.testRound < 2) ? 0 : test.testRound - 1;
						var buttonContainers = test.ui.buttonContainers[containersIndex];
						if (this.getAttribute('data-selected') === 'true') {
							test.lock();
							test.stopTiming();
							var isCorrect = false;
							var roundIdf = test.roundData[test.testRound][0];
							var btnIdf = this.getAttribute('data-test');
							if (test.testRound === 3) {
								// test correctness for L3 round
								var answerIndex = L3_questions.indexOf(roundIdf);
								var answerIdf = L3_answers[answerIndex];
								isCorrect = btnIdf === answerIdf;
							}
							else {
								isCorrect = btnIdf === roundIdf;
							}
							if (isCorrect) {
								if (test.testRound > 0) {
									test.correctAnswers += 1;
									Survey.addUserTally(test.testRound - 1, 1);
								}
								else {
									// training round
									$tl.delayedCall(0.3, function() {
										test.showCorrectLabel(true);
									});
								}

								selectedBtn.className += ' correct';
								// fade out incorrect choices
								this.setAttribute('data-correct', 'true');
								var incorrectButtons = [];
								buttonContainers.forEach(function(item) {
									var buttonElms = item.querySelectorAll('.toggle-button');
									for (var bn = 0; bn < buttonElms.length; bn++) {
										var btnElement = buttonElms[bn];
										if (btnElement.getAttribute('data-correct') !== 'true') {
											incorrectButtons.push(btnElement);
										}
									}
								});
								test.fadeOutElements(incorrectButtons, function() {
									if (test.testRound === 0) {
										$tl.delayedCall(1.5, function() {
											test.hideCorrectLabel();
										});
									}
									L13_proceed(buttonContainers);
								});
							}
							else {
								// mistake
								selectedBtn.className = 'toggle-button mistake';
								if (test.testRound === 0) {
									$tl.delayedCall(0.3, function() {
										test.showCorrectLabel(false);
									});
									// training round, repeat round
									// proceed to round 1
									$tl.delayedCall(3, function() {
										test.hideCorrectLabel();
										test.fadeOutElements(buttonContainers, function() {
											selectedBtn.className = 'toggle-button';
											selectedBtn.removeAttribute('data-selected');
											test.deactivateElements(buttonContainers);
											test.enterFlow('stage0');
										});
									});
								}
								else {
									// proceed to next round
									L13_proceed(buttonContainers);
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
		}
	});

	// L4-L5 buttons
	[test.roundData[4], test.roundData[5]].forEach(function(roundItem, lindex) {
		var buttonContainerElementL
			= document.createElement('div');
		buttonContainerElementL.className = 'button-container row-1 ltest' + (lindex + 4);
		test.ui.buttonContainers.push([buttonContainerElementL]);
		test.addElement(buttonContainerElementL);

		var n_buttons = (lindex === 0) ? 2 : 3;

		var answers = roundItem[1].slice(0);
		Shuffle(answers);

		var btnClassName = 'toggle-button clickagain';

		for (var i = 0; i < n_buttons; i++) {
			var answerText = answers[i];
			var buttonElement = document.createElement('div');
			buttonElement.className = btnClassName;
			buttonElement.innerText = test.assets.data.words[answerText]; // display localized word
			buttonContainerElementL.appendChild(buttonElement);

			var q = roundItem[0];
			buttonElement.setAttribute('data-answer', answerText);

			buttonElement.addEventListener('click', function() {
				if (test.isLocked()) {
					return;
				}
				if (!test.confirmTap) {
					this.className = btnClassName + ' active';
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
						var btnAnswer = this.getAttribute('data-answer');
						var isCorrect = btnAnswer === roundItem[1][0];
						// fade out incorrect choices
						this.setAttribute('data-correct', 'true');
						var containersIndex = test.testRound - 1;
						var buttonContainers = test.ui.buttonContainers[containersIndex];
						if (isCorrect) {
							test.correctAnswers += 1;
							Survey.addUserTally(test.testRound - 1, 1);
							var incorrectButtons = [];
							buttonContainers.forEach(function(item) {
								var buttonElms = item.querySelectorAll('.toggle-button');
								for (var bn = 0; bn < buttonElms.length; bn++) {
									var btnElement = buttonElms[bn];
									if (btnElement.getAttribute('data-correct') !== 'true') {
										incorrectButtons.push(btnElement);
									}
								}
							});
							test.fadeOutElements(incorrectButtons, function() {
								// proceed
								if (lindex === 0) {
									L4_proceed(buttonContainers);
								}
								else {
									// proceed to next test
									$tl.delayedCall(1.5, function() {
										Survey.next();
									});
								}
							});
						}
						else {
							// mistake
							selectedBtn.className = btnClassName + ' mistake';
							// proceed
							if (lindex === 0) {
								L4_proceed(buttonContainers);
							}
							else {
								// proceed to next test
								$tl.delayedCall(1.5, function() {
									Survey.next();
								});
							}
						}
					}
					else {
						selectedBtn.className = btnClassName;
						selectedBtn.removeAttribute('data-selected');
					}
					test.selectedButton = null;
					test.hideClickAgain();
					test.confirmTap = false;
				}
			});
		}
	});

	// click again label
	var clickAgainLabelElement
		= test.ui.clickAgainLabelElement
		= document.createElement('div');
	clickAgainLabelElement.className = 'click-again-label';
	clickAgainLabelElement.innerText = test.assets.data.texts['click_again'];
	test.addElement(clickAgainLabelElement);

	// correct label
	var correctLabelElement
		= test.ui.correctLabelElement
		= document.createElement('div');
	correctLabelElement.className = 'correct-label';
	test.addElement(correctLabelElement);

	// initialize round numbers
	test.increaseRoundTitle(true);
};

test.enter = function() {
	if (__DEBUG) {
		if (__DEBUG_STOP_AT_TEST !== 2) {
			return Survey.next();
		}
		__DEBUG_RESET();
	}
	test.lock();
	test.enterFlow('stage0');
};

test.exit = function() {
	Survey.addUserScore(test.correctAnswers);
};

test.flows = {
	// L1-L3 flows
	stage0: [
		{
			action: function() {
				test.showEar();
			},
			delay: 1
		},
		{
			action: function() {
				test.assets.sfx['instructions' + (test.testRound + 1)].play();
			},
			delay: 0.5
		},
		{
			action: function() {
				test.hideEar();
				var containersIndex = (test.testRound < 2) ? 0 : test.testRound - 1;
				var buttonContainers = test.ui.buttonContainers[containersIndex];
				test.activateElements(buttonContainers);
				test.fadeInElements(buttonContainers, function() {
					test.unlock();
					test.startTiming();
				});
			},
			delay: 2.5
		}
	],
	// L4-L5 flows
	stage1: [
		{
			action: function() {
				test.showEar();
			},
		},
		{
			action: function() {
				test.assets.sfx['instructions' + (test.testRound + 1)].play();
			},
			delay: 0.5
		},
		{
			action: function() {
				var delayTime = (test.testRound === 4) ? 4 : 6;
				$tl.delayedCall(delayTime, function() {
					test.hideEar();
					var containersIndex = test.testRound - 1;
					var buttonContainers = test.ui.buttonContainers[containersIndex];
					test.activateElements(buttonContainers);
					test.fadeInElements(buttonContainers, function() {
						test.unlock();
						test.startTiming();
					});
				});
			}
		}
	]
};

}());

