//
// Subtest 04
// Executive function / Visuospatial
//

(function() { "use strict";

//
// test
//
var test = new Subtest();

test.name = 'Executive function / Visuospatial';

test.resources = {
	data: {
		texts: 'intl/$locale/texts.json'
	},
	graphics: {
		clockBg: 'clock_bg.svg',
		arrowDown: 'arrow_down.svg',
		arrowUp: 'arrow_up.svg'
	},
	sfx: {
		instructions: 'intl/$locale/instructions.mp3',
	}
};

test.difficultyLevel = 0;

test.solutions = [];

test.userHours = 0;
test.userMinutes = 0;
test.userCorrectAnswers = 0;

test.trainingRoundData = [];

test.createTest = function() {
	function getHourValue(inst) {
		// never allow hour hand on 12 for any level
		switch (test.difficultyLevel) {
			case 0: // very easy level
			case 1:
				return GetRandomInt(1, 6);
			case 2: // easy level
			case 3: // challenging level
				if (inst === 1) 
					return GetRandomInt(1, 6);
				else
					return GetRandomInt(7, 11);
		}
		return 0;
	}
	function getMinuteValue() {
		switch (test.difficultyLevel) {
			case 0: // very easy level
			case 1:
				return 0;
			case 2: // easy level
				return 0;
			case 3: // challenging level
				return Choose([0, 6]) * 5;
		}
		return 0;
	}
	var flip = GetRandomInt(0, 1) === 1;
	var hourVal1 = getHourValue(flip ? 1 : 2);
	var minuteVal1 = getMinuteValue();
	var hourVal2 = getHourValue(flip ? 2 : 1);
	var minuteVal2 = getMinuteValue();
	// additional constraints
	if (test.difficultyLevel === 3) {    /* || test.difficultyLevel === 4) { */
		// retry until both hour and minute hands are unique
		if (hourVal1 === hourVal2 || minuteVal1 === minuteVal2) {
			// retry
			return test.createTest();
		}
	}
	else {
		// retry if identical until we get two unique clock times
		if (hourVal1 === hourVal2 && minuteVal1 === minuteVal2) {
			// retry
			return test.createTest();
		}
	}
	if (test.difficultyLevel === 1) {
		// make sure level 1 is different to training level
		if (hourVal1 === test.trainingRoundData[0] && hourVal2 == test.trainingRoundData[1]) {
			// retry
			return test.createTest();
		}
	}
	// memorize intro level
	if (test.difficultyLevel === 0) {
		test.trainingRoundData = [hourVal1, hourVal2];
	}
	// find solutions
	this.solutions = [];
	var timeDiffs = [];
	var timeClock1 = hourVal1 * 60 + minuteVal1;
	var timeClock2 = hourVal2 * 60 + minuteVal2;
	var time_diff = Math.abs(timeClock1 - timeClock2);
	var diff_hours = Math.floor(time_diff / 60);
	var diff_minutes = time_diff % 60;
	this.solutions.push([diff_hours, diff_minutes]);
	timeDiffs.push(time_diff);
	// find a second solution
	if (hourVal1 > hourVal2) {
		hourVal2 += 12;
	}
	else if (hourVal2 > hourVal1) {
	 	hourVal1 += 12;
	}
	timeClock1 = hourVal1 * 60 + minuteVal1;
	timeClock2 = hourVal2 * 60 + minuteVal2;
	time_diff = Math.abs(timeClock1 - timeClock2);
	diff_hours = Math.floor(time_diff / 60);
	diff_minutes = time_diff % 60;
	this.solutions.push([diff_hours, diff_minutes]);
	timeDiffs.push(time_diff);
	// check solutions constraints
	if (test.difficultyLevel === 0 || test.difficultyLevel === 1) {
		// min diff = 2hr (120 min) ; max diff = 4hr (240 min)
		if ((timeDiffs[0] < 120 || timeDiffs[0] > 240) &&
			(timeDiffs[1] < 120 || timeDiffs[1] > 240)) {
			// retry
			return test.createTest();
		}
	}
	else if (test.difficultyLevel === 2) {
		// min diff = 3hr (180 min) ; max diff =  5hr (300 min)
		if ((timeDiffs[0] < 180 || timeDiffs[0] > 300) &&
			(timeDiffs[1] < 180 || timeDiffs[1] > 300)) {
			// retry
			return test.createTest();
		}
	}
	else if (test.difficultyLevel === 3) {
		// min diff = 2hr 30 min (150 min)
		if (timeDiffs[0] < 150 || timeDiffs[1] < 150) {
			// retry
			return test.createTest();
		}
	}
	// update clock hands
	var clock1 = this.ui.clock1;
	var minuteHand1 = clock1.querySelector('.minute-hand');
	var hourHand1 = clock1.querySelector('.hour-hand');
	var clock2 = this.ui.clock2;
	var minuteHand2 = clock2.querySelector('.minute-hand');
	var hourHand2 = clock2.querySelector('.hour-hand');

	var minuteMax = 60;
	var hourMax = 12;

	var hourOffset1 = minuteVal1 / minuteMax;
	var hourOffset2 = minuteVal2 / minuteMax;

	var angleHours1 = 360 * (hourVal1 + hourOffset1) / hourMax - 180;
	var angleMinutes1 = 360 * minuteVal1 / minuteMax - 180;
	var angleHours2 = 360 * (hourVal2 + hourOffset2) / hourMax - 180;
	var angleMinutes2 = 360 * minuteVal2 / minuteMax - 180;

	$tl.set(hourHand1, { rotation: angleHours1, transformOrigin: '50% 0' });
	$tl.set(minuteHand1, { rotation: angleMinutes1, transformOrigin: '50% 0' });
	$tl.set(hourHand2, { rotation: angleHours2, transformOrigin: '50% 0' });
	$tl.set(minuteHand2, { rotation: angleMinutes2, transformOrigin: '50% 0' });
};

test.resetTest = function() {
	// reset user values
	this.userHours = 0;
	this.userMinutes = 0;
	this.ui.clockInput1.className = 'left clock-input';
	this.ui.clockInput2.className = 'right clock-input';
	this.updateDigitDisplayHours();
	this.updateDigitDisplayMinutes();
};

test.updateDigitDisplayHours = function() {
	var hoursDisplay = String(this.userHours);
	if (hoursDisplay.length === 1) {
		hoursDisplay = '0' + hoursDisplay;
	}
	this.ui.digitDisplayHours.innerText = hoursDisplay;
};

test.updateDigitDisplayMinutes = function() {
	var minutesDisplay = String(this.userMinutes);
	if (minutesDisplay.length === 1) {
		minutesDisplay = '0' + minutesDisplay;
	}
	this.ui.digitDisplayMinutes.innerText = minutesDisplay;
};

test.showCorrectCaption = function() {
	test.ui.correctCaption.innerText = test.assets.data.texts['correct'];
	test.ui.correctCaption.className = 'caption correct';
	test.fadeInElements(test.ui.correctCaption);
};

test.showIncorrectCaption = function() {
	test.ui.correctCaption.innerText = test.assets.data.texts['incorrect'];
	test.ui.correctCaption.className = 'caption incorrect';
	test.fadeInElements(test.ui.correctCaption);
};

test.registerButtonEvents = function() {
	// hour control
	this.ui.digitInputHoursUp.addEventListener('click', function() {
		if (test.isLocked()) {
			return;
		}
		window.parent.enterFullscreen && window.parent.enterFullscreen(); // enter fullscreen when possible
		test.userHours--;
		if (test.userHours < 0) {
			test.userHours = 11;
		}
		test.updateDigitDisplayHours();
	});
	this.ui.digitInputHoursDown.addEventListener('click', function() {
		if (test.isLocked()) {
			return;
		}
		window.parent.enterFullscreen && window.parent.enterFullscreen(); // enter fullscreen when possible
		test.userHours++;
		if (test.userHours > 11) {
			test.userHours = 0;
		}
		test.updateDigitDisplayHours();
	});

	// minutes control
	this.ui.digitInputMinutesUp.addEventListener('click', function() {
		if (test.isLocked()) {
			return;
		}
		window.parent.enterFullscreen && window.parent.enterFullscreen(); // enter fullscreen when possible
		test.userMinutes -= 5;
		if (test.userMinutes < 0) {
			test.userMinutes = 55;
		}
		test.updateDigitDisplayMinutes();
	});
	this.ui.digitInputMinutesDown.addEventListener('click', function() {
		if (test.isLocked()) {
			return;
		}
		window.parent.enterFullscreen && window.parent.enterFullscreen(); // enter fullscreen when possible
		test.userMinutes += 5;
		if (test.userMinutes > 55) {
			test.userMinutes = 0;
		}
		test.updateDigitDisplayMinutes();
	});

	function proceed() {
		if (test.difficultyLevel < 3) {
			// proceed to next round
			test.fadeOutElements([
					test.ui.clock1,
					test.ui.clock2,
					test.ui.clockInput1,
					test.ui.clockInput2,
					test.ui.clockInputTitle1,
					test.ui.clockInputTitle2,
					test.ui.correctCaption
			], function() {
				$tl.delayedCall(1, function() {
					// setup and enter next round
					test.difficultyLevel++;
					test.createTest();
					test.resetTest();
					test.increaseRoundTitle(true);
					test.enterFlow('stage0');
				});
			});
		}
		else {
			// test completed, proceed to next
			$tl.delayedCall(1, function() {
				Survey.next();
			});
		}
	}

	this.ui.clockSubmit.addEventListener('click', function() {
		if (test.isLocked()) {
			return;
		}
		window.parent.enterFullscreen && window.parent.enterFullscreen(); // enter fullscreen when possible
		test.lock();
		test.stopTiming();
		// test for correct answer
		var correctAnswer = false;
		var userHours = test.userHours;
		var userMinutes = test.userMinutes;
		var n_solutions = test.solutions.length;
		for (var i = 0; i < n_solutions; i++) {
			var solution = test.solutions[i];
			if (userHours === solution[0] && userMinutes === solution[1]) {
				correctAnswer = true;
				break;
			}
		}
		test.fadeOutElements(test.ui.clockSubmit);
		if (correctAnswer) {
			if (test.difficultyLevel == 1) {
				test.userCorrectAnswers += 2;
				Survey.addUserTally(test.difficultyLevel - 1, 2);
			}
			else if (test.difficultyLevel > 1) {
				test.userCorrectAnswers++;
				Survey.addUserTally(test.difficultyLevel - 1, 1);
			}
			$tl.delayedCall(0.5, function() {
				if (test.difficultyLevel === 0) { // only show correct text on intro round
					test.showCorrectCaption();
				}
				$tl.delayedCall(2, function() {
					proceed();
				});
			});
		}
		else {
			// only show incorrect text on intro round
			if (test.difficultyLevel === 0) {
				$tl.delayedCall(0.5, function() {
					test.showIncorrectCaption();
				});
			}
			// wrong answer
			[
				test.ui.clockInput1,
				test.ui.clockInput2,
			].forEach(function(clockInputElement) {
				clockInputElement.className += ' mistake';
			});
			$tl.delayedCall(3.5, function() {
				if (test.difficultyLevel > 0) {
					proceed();
				}
				else {
					// repeat test
					test.fadeOutElements([
							test.ui.instructionsTextElement,
							test.ui.clock1,
							test.ui.clock2,
							test.ui.clockInput1,
							test.ui.clockInput2,
							test.ui.clockInputTitle1,
							test.ui.clockInputTitle2,
							test.ui.correctCaption
					], function() {
						test.resetTest();
						test.enterFlow('stage0');
					});
				}
			});
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

	// clocks
	var clock1
		= this.ui.clock1
		= document.createElement('div');
	clock1.className = 'left analog-clock';

	var clock2
		= this.ui.clock2
		= document.createElement('div');
	clock2.className = 'right analog-clock';

	[clock1, clock2].forEach(function(clockElement) {
		test.addElement(clockElement);

		var clockInnerElement = document.createElement('div');
		clockInnerElement.className = 'clock-inner';
		var clockBgImg = test.assets.graphics.clockBg;
		clockInnerElement.style.backgroundImage = 'url(' + clockBgImg.src + ')';
		clockElement.appendChild(clockInnerElement);

		for (var digit = 1; digit <= 12; digit++) {
			var digitElement = document.createElement('div');
			digitElement.className = 'digit d' + digit;
			digitElement.innerText = digit;
			clockElement.appendChild(digitElement);
		}

		var minuteHandElement = document.createElement('div');
		minuteHandElement.className = 'minute-hand';
		clockElement.appendChild(minuteHandElement);

		var hourHandElement = document.createElement('div');
		hourHandElement.className = 'hour-hand';
		clockElement.appendChild(hourHandElement);

		var centerNutElement = document.createElement('div');
		centerNutElement.className = 'center-nut';
		clockElement.appendChild(centerNutElement);
	});

	// clock input boxes
	var clockInput1
		= this.ui.clockInput1
		= document.createElement('div');
	clockInput1.className = 'left clock-input';

	var clockInput2
		= this.ui.clockInput2
		= document.createElement('div');
	clockInput2.className = 'right clock-input';

	[clockInput1, clockInput2].forEach(function(clockInputElement, index) {
		test.addElement(clockInputElement);

		var arrowUpImg = test.assets.graphics.arrowUp;
		var arrowDownImg = test.assets.graphics.arrowDown;

		var digitInputLeftElement = document.createElement('div');
		digitInputLeftElement.className = 'left digit-input';
		digitInputLeftElement.style.backgroundImage = 'url(' + arrowDownImg.src + ')';
		clockInputElement.appendChild(digitInputLeftElement);

		var digitInputRightElement = document.createElement('div');
		digitInputRightElement.className = 'right digit-input';
		digitInputRightElement.style.backgroundImage = 'url(' + arrowUpImg.src + ')';
		clockInputElement.appendChild(digitInputRightElement);

		var digitDisplayElement = document.createElement('div');
		digitDisplayElement.className = 'digit-display';
		digitDisplayElement.innerText = '00';
		clockInputElement.appendChild(digitDisplayElement);

		if (index === 0) {
			test.ui.digitInputHoursUp = digitInputLeftElement;
			test.ui.digitInputHoursDown = digitInputRightElement;
			test.ui.digitDisplayHours = digitDisplayElement;
		}
		else {
			test.ui.digitInputMinutesUp = digitInputLeftElement;
			test.ui.digitInputMinutesDown = digitInputRightElement;
			test.ui.digitDisplayMinutes = digitDisplayElement;
		}
	});

	// clock input titles
	var clockInputTitle1
		= this.ui.clockInputTitle1
		= document.createElement('div');
	clockInputTitle1.className = 'left clock-input-title';
	clockInputTitle1.innerText = test.assets.data.texts['hours'];
	test.addElement(clockInputTitle1);

	var clockInputTitle2
		= this.ui.clockInputTitle2
		= document.createElement('div');
	clockInputTitle2.className = 'right clock-input-title';
	clockInputTitle2.innerText = test.assets.data.texts['minutes'];
	test.addElement(clockInputTitle2);

	// correct/incorrect captions
	var correctCaption
		= this.ui.correctCaption
		= document.createElement('div');
	correctCaption.className = 'caption correct';
	test.addElement(correctCaption);

	// clock submit button
	var clockSubmit
		= this.ui.clockSubmit
		= document.createElement('input');
	clockSubmit.setAttribute('type', 'button');
	clockSubmit.setAttribute('value', test.assets.data.texts['submit']);
	clockSubmit.className = 'clock-submit';
	test.addElement(clockSubmit);

	// register user events
	test.registerButtonEvents();

	//
	// prepare the test
	//
	test.createTest();

	// initialize round numbers
	test.increaseRoundTitle(true);
};

test.enter = function() {
	if (__DEBUG) {
		if (__DEBUG_STOP_AT_TEST !== 4) {
			return Survey.next();
		}
		__DEBUG_RESET();
	}
	this.lock();

	this.enterFlow('stage0');
};

test.exit = function() {
	// add user score
	Survey.addUserScore(test.userCorrectAnswers);
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
			delay: 3.5
		},
		{
			action: function() {
				test.fadeInElements([
					test.ui.clock1,
					test.ui.clock2,
					test.ui.clockInput1,
					test.ui.clockInput2,
					test.ui.clockInputTitle1,
					test.ui.clockInputTitle2
				], function() {
					test.fadeInElements(test.ui.clockSubmit, function() {
						// begin test
						test.unlock();
						test.startTiming();
					});
				});
			},
			delay: 0.5
		}
	]
};

}());
