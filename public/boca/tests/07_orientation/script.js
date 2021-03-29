//
// Subtest 07
// Orientation
//

(function() { "use strict";

//
// test
//
var test = new Subtest();

test.name = 'Orientation';

test.resources = {
	data: {
		texts: 'intl/$locale/texts.json',
		answers: 'intl/$locale/answers.json'
	},
	sfx: {
		instructions1: 'intl/$locale/instructions1.mp3',
		instructions2: 'intl/$locale/instructions2.mp3',
		instructions3: 'intl/$locale/instructions3.mp3'
	}
};

test.confirmTap = false;
test.selectedButton = null;

test.todayMonth = 0;
test.todayYear = 0;
test.todayWeekday = 0;

test.userCorrectAnswers = 0;

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

test.init = function() {
	// get current date
	var today = new Date();
	test.todayMonth = today.getMonth();
	test.todayYear = today.getFullYear();
	test.todayWeekday = today.getDay();

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
	test.ui.buttons = {
		month: [],
		year: [],
		dotw: []
	};
	test.ui.buttonContainers = {
		month: [],
		year: [],
		dotw: []
	};

	// month buttons
	var tbMonthClassname = 'toggle-button month clickagain';
	var tbYearClassname = 'toggle-button year clickagain';
	var tbDotwClassname = 'toggle-button dotw clickagain';

	function fadeOutContainers(containerList, done) {
		test.fadeOutElements(test.ui.instructionsTextElement);
		test.fadeOutElements(containerList, function() {
			test.deactivateElements(containerList);
			if (done instanceof Function) {
				done();
			}
		});
	}

	function fadeOutIncorrect(buttonList, done) {
		var incorrectButtons = [];
		for (var i = 0; i < buttonList.length; i++) {
			var btnElement = buttonList[i];
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

	for (var i = 0; i < 3; i++) {
		var monthButtonContainerElement
			= test.ui['monthButtonContainerElement' + (i + 1)]
			= document.createElement('div');
		monthButtonContainerElement.className = 'button-container row-3-' + (i + 1) + ' container-4';
		monthButtonContainerElement.style.display = 'none';
		test.addElement(monthButtonContainerElement);
		test.ui.buttonContainers.month.push(monthButtonContainerElement);

		var n_buttons = 4;

		for (var j = 0; j < n_buttons; j++) {
			var buttonElement = document.createElement('div');
			buttonElement.className = tbMonthClassname;
			var buttonMonthIndex = i * n_buttons + j;
			buttonElement.innerText = test.assets.data.answers["months"][buttonMonthIndex];
			buttonElement.setAttribute('data-month', String(buttonMonthIndex));
			monthButtonContainerElement.appendChild(buttonElement);
			test.ui.buttons.month.push(buttonElement);

			buttonElement.addEventListener('click', function() {
				if (test.isLocked()) {
					return;
				}
				window.parent.enterFullscreen && window.parent.enterFullscreen(); // enter fullscreen when possible
				if (!test.confirmTap) {
					this.className = tbMonthClassname + ' active';
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

						var month = parseInt(this.getAttribute('data-month'), 10);
						var correct = (month === test.todayMonth);

						if (correct) {
							test.userCorrectAnswers += 1;
							Survey.addUserTally(0, 1);
							fadeOutIncorrect(test.ui.buttons.month, function() {
								$tl.delayedCall(1.5, function() {
									fadeOutContainers(test.ui.buttonContainers.month, function() {
										// proceed to stage 2
										test.enterFlow('stage2');
									});
								});
							});
						}
						else {
							this.className = tbMonthClassname + ' mistake';
							$tl.delayedCall(1.5, function() {
								fadeOutContainers(test.ui.buttonContainers.month, function() {
									// proceed to stage 2
									test.enterFlow('stage2');
								});
							});
						}
					}
					else {
						selectedBtn.className = tbMonthClassname;
						selectedBtn.removeAttribute('data-selected');
					}
					test.selectedButton = null;
					test.hideClickAgain();
					test.confirmTap = false;
				}
			});
		}
	}

	// year buttons

	var yearStart = test.todayYear - 19;
	var yearInc = yearStart + GetRandomInt(1, 9);

	for (var i = 0; i < 4; i++) {
		var yearButtonContainerElement
			= test.ui['yearButtonContainerElement' + (i + 1)]
			= document.createElement('div');
		yearButtonContainerElement.className = 'button-container row-4-' + (i + 1) + ' higher container-5';
		yearButtonContainerElement.style.display = 'none';
		test.addElement(yearButtonContainerElement);
		test.ui.buttonContainers.year.push(yearButtonContainerElement);

		var n_buttons = 5;

		for (var j = 0; j < n_buttons; j++) {
			var buttonElement = document.createElement('div');
			buttonElement.className = tbYearClassname;
			var buttonYear = String(yearInc);
			yearInc += 1;
			buttonElement.innerText = buttonYear;
			buttonElement.setAttribute('data-year', buttonYear);
			yearButtonContainerElement.appendChild(buttonElement);
			test.ui.buttons.year.push(buttonElement);


			buttonElement.addEventListener('click', function() {
				if (test.isLocked()) {
					return;
				}
				window.parent.enterFullscreen && window.parent.enterFullscreen(); // enter fullscreen when possible
				if (!test.confirmTap) {
					this.className = tbYearClassname + ' active';
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

						var year = parseInt(this.getAttribute('data-year'), 10);
						var correct = (year === test.todayYear);

						if (correct) {
							test.userCorrectAnswers += 1;
							Survey.addUserTally(1, 1);
							fadeOutIncorrect(test.ui.buttons.year, function() {
								$tl.delayedCall(1.5, function() {
									fadeOutContainers(test.ui.buttonContainers.year, function() {
										// proceed to stage 3
										test.enterFlow('stage3');
									});
								});
							});
						}
						else {
							this.className = tbYearClassname + ' mistake';
							$tl.delayedCall(1.5, function() {
								fadeOutContainers(test.ui.buttonContainers.year, function() {
									// proceed to stage 3
									test.enterFlow('stage3');
								});
							});
						}

					}
					else {
						selectedBtn.className = tbYearClassname;
						selectedBtn.removeAttribute('data-selected');
					}
					test.selectedButton = null;
					test.hideClickAgain();
					test.confirmTap = false;
				}
			});
		}
	}

	// day of the week buttons

	for (var i = 0; i < 2; i++) {
		var dotwButtonContainerElement
			= test.ui['dotwButtonContainerElement' + (i + 1)]
			= document.createElement('div');
		var containerClass = (i === 0) ? 'container-4' : 'container-3';
		dotwButtonContainerElement.className = 'button-container row-2-' + (i + 1) + ' ' + containerClass;
		dotwButtonContainerElement.style.display = 'none';
		test.addElement(dotwButtonContainerElement);
		test.ui.buttonContainers.dotw.push(dotwButtonContainerElement);

		var n_buttons = (i == 0) ? 4 : 3;

		for (var j = 0; j < n_buttons; j++) {
			var buttonElement = document.createElement('div');
			buttonElement.className = tbDotwClassname;
			var buttonWeekdayIndex = i * 4 + j;
			buttonElement.innerText = test.assets.data.answers["days_of_week"][buttonWeekdayIndex];
			buttonElement.setAttribute('data-weekday', String(buttonWeekdayIndex));
			dotwButtonContainerElement.appendChild(buttonElement);
			test.ui.buttons.dotw.push(buttonElement);

			buttonElement.addEventListener('click', function() {
				if (test.isLocked()) {
					return;
				}
				window.parent.enterFullscreen && window.parent.enterFullscreen(); // enter fullscreen when possible
				if (!test.confirmTap) {
					this.className = tbDotwClassname + ' active';
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

						var weekday = parseInt(this.getAttribute('data-weekday'), 10);
						var correct = (weekday === test.todayWeekday);

						if (correct) {
							test.userCorrectAnswers += 1;
							Survey.addUserTally(2, 1);
							fadeOutIncorrect(test.ui.buttons.dotw, function() {
								$tl.delayedCall(1.5, function() {
									// proceed to next test
									Survey.next();
								});
							});
						}
						else {
							this.className = tbDotwClassname + ' mistake';
							$tl.delayedCall(1.5, function() {
								// proceed to next test
								Survey.next();
							});
						}

					}
					else {
						selectedBtn.className = tbDotwClassname;
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
	test.increaseRoundTitle();
};

test.enter = function() {
	if (__DEBUG) {
		if (__DEBUG_STOP_AT_TEST !== 7) {
			return Survey.next();
		}
		__DEBUG_RESET();
	}
	test.lock();
	test.enterFlow('stage1');
};

test.exit = function() {
	Survey.addUserScore(test.userCorrectAnswers);
};

test.flows = {
	stage1: [
		{
			action: function() {
				test.showEar();
				test.ui.instructionsTextElement.innerText = test.assets.data.texts['instructions_1'];
				test.fadeInElements(test.ui.instructionsTextElement);
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
				test.hideEar();
				var containers = [
					test.ui.monthButtonContainerElement1,
					test.ui.monthButtonContainerElement2,
					test.ui.monthButtonContainerElement3
				];
				test.activateElements(containers);
				test.fadeInElements(containers, function() {
					// begin round
					test.unlock();
					test.startTiming();
				});
			},
			delay: 2
		}
	],
	stage2: [
		{
			action: function() {
				test.increaseRoundTitle();
				test.showEar();
				test.ui.instructionsTextElement.innerText = test.assets.data.texts['instructions_2'];
				test.fadeInElements(test.ui.instructionsTextElement);
			},
			delay: 1
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
				var containers = [
					test.ui.yearButtonContainerElement1,
					test.ui.yearButtonContainerElement2,
					test.ui.yearButtonContainerElement3,
					test.ui.yearButtonContainerElement4
				];
				test.activateElements(containers);
				test.fadeInElements(containers, function() {
					// begin round
					test.unlock();
					test.startTiming();
				});
			},
			delay: 2
		}
	],
	stage3: [
		{
			action: function() {
				test.increaseRoundTitle();
				test.showEar();
				test.ui.instructionsTextElement.innerText = test.assets.data.texts['instructions_3'];
				test.fadeInElements(test.ui.instructionsTextElement);
			},
			delay: 1
		},
		{
			action: function() {
				test.assets.sfx.instructions3.play();
			},
			delay: 0.5
		},
		{
			action: function() {
				test.hideEar();
				var containers = [
					test.ui.dotwButtonContainerElement1,
					test.ui.dotwButtonContainerElement2
				];
				test.activateElements(containers);
				test.fadeInElements(containers, function() {
					// begin round
					test.unlock();
					test.startTiming();
				});
			},
			delay: 2
		}
	]
};

}());

