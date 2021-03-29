/*
 *  AlzLight Cognitive Test Survey
 *	(c) 2019 Alzheimer's Light
 *	code by Danijel Durakovic
 *
 */

var $tl = TweenLite;
var $q = document.querySelector.bind(document);
var $q_all = document.querySelectorAll.bind(document);

//
// constants
//

var TR_DURATION_QUICK = 0.3;
var TR_DURATION_SHORT = 1;
var TR_DURATION_SHORTER = 0.5;
var TR_DURATION_LONG = 2.5;
var TR_EASE_IN_OUT = Power3.easeInOut;
var TR_EASE_IN = Power3.easeIn;
var TR_EASE_OUT = Power3.easeOut;
var TR_EASE_NONE = Power0.easeNone;

//debug/////////////////////////////////////////
var __DEBUG = 0;
var __DEBUG_STOP_AT_TEST = 1;

if (__DEBUG) {
	var TR_DURATION_SHORT = 0.05;
}

function __DEBUG_RESET() {
	TR_DURATION_SHORT = 1;
}
////////////////////////////////////////////////

//
// localization
//
var SURVEY_LOCALE_VALID = [ // list of valid locales, used for validation
	"us_en",
	"ru",
	"es",
	"cn"
];

var surveyLocale = "us_en"; // default locale

//
// common functions
//

// create a single object from multiple objects
function Compose(/**/) {
	// es6
	if (Object.assign) {
		return Object.assign.apply(null, arguments);
	}
	// non-es6
	var obj = arguments[0];
	var n_args = arguments.length;
	for (var i = 1; i < n_args; ++i) {
		var component = arguments[i];
		if (!component)
			continue;
		for (var key in component) {
			if (component.hasOwnProperty(key)) {
				obj[key] = component[key];
			}
		}
	}
	return obj;
}

// visually wobble an element
function Wobble(element) {
	var wobble_t = 0.1;
	var wobble_ease = Power1.easeInOut;
	$tl.killTweensOf(element);
	$tl.to(element, wobble_t, { x: '-5%', ease: wobble_ease, onComplete: function() {
		$tl.to(element, wobble_t, { x: '5%', ease: wobble_ease, onComplete: function() {
			$tl.to(element, wobble_t, { x: '-5%', ease: wobble_ease, onComplete: function() {
				$tl.to(element, wobble_t, { x: '0%', ease: wobble_ease, onComplete: function() {
					element.removeAttribute('style');
				}});
			}});
		}});
	}});
}

// get an item from a list at random
function Choose(list) {
	if (list instanceof Array) {
		return list[Math.floor(Math.random() * list.length)];
	}
}

// get an item from a list at random and remove it from the list
function Pick(list) {
	if (list instanceof Array && list.length > 0) {
		var i = Math.floor(Math.random() * list.length);
		var item = list[i];
		list.splice(i, 1);
		return item;
	}
}

// shuffle a list
function Shuffle(list) {
	// Fisher-Yates shuffle
	var i, j, tmp;
	for (i = list.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		tmp = list[i];
		list[i] = list[j];
		list[j] = tmp;
	}
}

// retreive a random int in range
function GetRandomInt(a, b) {
	return Math.floor(Math.random() * (b - a + 1)) + a;
}

//
// resource loader module
//
var ResourceLoader = (function() {
	var bank = {};
	var resourcesList = {};
	var basePaths = {};

	// load handlers
	var handlers = {};

	handlers.data = function(filename, ready) {
		var xhr = new XMLHttpRequest();
		xhr.open('get', filename, true);
		xhr.send(null);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var response = xhr.responseText;
				var data = JSON.parse(response);
				ready(data);
			}
		};
	};

	handlers.graphics = function(filename, ready) {
		var img = new Image();
		img.src = filename;
		img.addEventListener('load', function() {
			ready(img);
		});
	};

	handlers.sfx = function(filename, ready) {
		var sfx = new Howl({
			src: filename,
			autoplay: false,
			loop: false,
			volume: 1,
			onload: function() {
				ready(sfx);
			},
			onloaderror: function() {
				console.error('Could not load sound files');
			}
		});
	};

	// resource iterator
	function resIter(list, callback) {
		for (var key in list) {
			var item = list[key];
			if (list.hasOwnProperty(key) && !(item instanceof Function)) {
				callback(key, item);
			}
		}
	};

	return {
		addResources: function(resources, namedContext, contextPath) {
			var resourceContextList = resourcesList[namedContext] = { };
			Compose(resourceContextList, resources);
			basePaths[namedContext] = contextPath || '';
		},
		getAssets: function(namedContext) {
			return bank[namedContext];
		},
		loadAll: function(done) {
			// count resources
			var n_loaded = 0;
			var n_toload = 0;
			resIter(resourcesList, function(namedContext, resources) {
				resIter(resources, function(category, itemList) {
					resIter(itemList, function() {
						n_toload++;
					});
				});
			});

			function advance() {
				if (++n_loaded === n_toload) {
					// all assets are loaded, clean up
					resourcesList = {};
					basePaths = {};
					done();
				}
			}

			// call appropriate load handlers for every resource and add them to the asset bank
			resIter(resourcesList, function(namedContext, resources) {
				var bankContext = bank[namedContext] = {};
				resIter(resources, function(category, itemList) {
					var loadHandler = handlers[category];
					if (loadHandler instanceof Function) {
						if (!bankContext[category]) {
							bankContext[category] = {};
						}
						resIter(itemList, function(key, src) {
							// substitute locale
							src = src.replace("$locale", surveyLocale);
							var contextPath = basePaths[namedContext];
							loadHandler(contextPath + src, function(asset) {
								bankContext[category][key] = asset;
								advance();
							});
						});
					}
					else {
						console.error('Could not find appropriate load handler: ' + category);
					}
				});
			});
		}
	};
}());

//
// subtest virtual class
//
function Subtest() {
	var self = this;

	// subtest assets
	this.assets = {};

	// user interface elements
	this.ui = {};

	//
	// private members
	//
	this._id = Survey.getSubtests().length; // sequential id
	this._locked = false;
	this._exited = false;

	this._panelElement = null;
	this._earIconElement = null;
	this._timebarElement = null;
	this._timebarFillElement = null;

	this._roundTitleNum = 0;
	this._nameTitleElement = null;
	this._roundTitleElement = null;

	// create survey body
	this._create = function() {

		//
		// create the panel element
		//
		var surveyBody = $q('#survey-body');
		var panelElement
			= this._panelElement
			= document.createElement('div');
		panelElement.setAttribute('id', 'subtest' + (1 + this._id));
		panelElement.className = 'survey-panel';
		panelElement.setAttribute('data-subtest-name', this.name);
		surveyBody.appendChild(panelElement);

		//
		// populate the panel element with generic elements
		//

		// title element
		var titleElement = document.createElement('h2');
		titleElement.className = 'title';
		panelElement.appendChild(titleElement);

		var nameTitleElement = document.createElement('span');
		this._nameTitleElement = nameTitleElement;
		titleElement.appendChild(nameTitleElement);

		var roundTitleElement = document.createElement('span');
		this._roundTitleElement = roundTitleElement;
		titleElement.appendChild(roundTitleElement);

		// ear icon
		var earIconElement = this._earIconElement = document.createElement('div');
		earIconElement.className = 'earicon';
		panelElement.appendChild(earIconElement);

		// enumeration
		var n_subtests = Survey.getSubtests().length;
		var enumElement = document.createElement('h2');
		enumElement.className = 'right title';
		enumElement.innerText = (1 + this._id) + ' / ' + n_subtests;
		panelElement.appendChild(enumElement);

		// divider
		var dividerElement = document.createElement('div');
		dividerElement.className = 'title divider';
		panelElement.appendChild(dividerElement);

		// timebar
		var timebarElement = this._timebarElement = document.createElement('div');
		timebarElement.className = 'timebar';
		panelElement.appendChild(timebarElement);

		var timebarInnerElement = document.createElement('div');
		timebarInnerElement.className = 'inner';
		timebarElement.appendChild(timebarInnerElement);

		var timebarFillElement = this._timebarFillElement = document.createElement('div');
		timebarFillElement.className = 'fill';
		timebarInnerElement.appendChild(timebarFillElement);
	};

	//
	// timer
	//
	var subtestTimeSeconds = 40;
	var countdownTime = 0;
	var subtestIntvl = null;

	this.startTiming = function() {
		this.stopTiming();
		countdownTime = subtestTimeSeconds * 1000; // milliseconds
		subtestIntvl = setInterval(function() {
			if (countdownTime <= 0) {
				// timed out
				self.stopTiming();
				// check if subtest has onTimeout defined
				if (self.onTimeout instanceof Function) {
					self.onTimeout();
				}
				else {
					// otherwise, proceed to next subtest
					Survey.next();
				}
			}
			else {
				countdownTime -= 50;
				if (countdownTime === 20.5 * 1000) {
					// show the timebar
					$tl.to(self._timebarElement, TR_DURATION_LONG, { opacity: 1, ease: TR_EASE_OUT });
				}
				else if (countdownTime < 20 * 1000) {
					var timeLeftPerc = countdownTime / 1000 / 20 * 100;
					self._timebarFillElement.style.width = timeLeftPerc + '%';
				}
			}
		}, 50);
	}

	this.stopTiming = function() {
		if (subtestIntvl) {
			// hide and reset timebar
			$tl.delayedCall(1.2, function() {
				if (self._exited) {
					return;
				}
				$tl.to(self._timebarElement, TR_DURATION_SHORTER, { opacity: 0, ease: TR_EASE_NONE, onComplete: function() {
					self._timebarFillElement.style.width = '100%';
				}});
			});
			// clear current timer
			clearInterval(subtestIntvl);
			subtestIntvl = null;
		}
	}

	// pre-initialization
	this._prepare = function() {
		this.prepare();
	};

	// initialization
	this._init = function() {
		// fetch all assets associated with this context
		this.assets = ResourceLoader.getAssets(this.name);
		// set test title
		this._nameTitleElement.innerText = Survey.getAssets().data.names["test_" + (this._id + 1)];
		// test init
		this.init();
	};

	// enter/exit events
	this._enter = function() {
		// test enter
		this.enter();
	};

	this._exit = function() {
		this._locked = true;
		this._exited = true;
		this.stopTiming();
		// test exit
		this.exit();
	};

	//
	// general functions
	//

	// pushes an element to panel
	this.addElement = function(element) {
		this._panelElement.appendChild(element);
	};

	this.increaseRoundTitle = function(treatFirstAsTraining) {
		this._roundTitleNum++;
		if (treatFirstAsTraining) {
			var titleText = (this._roundTitleNum === 1) ? Survey.getAssets().data.texts['training'] : (this._roundTitleNum - 1);
			this._roundTitleElement.innerText = ' - ' + titleText;
		}
		else {
			this._roundTitleElement.innerText = ' - ' + this._roundTitleNum;
		}
	};

	// fade elements in or out
	this.fadeInElements = function(elements, done) {
		$tl.set(elements, { display: 'block' });
		$tl.to(elements, TR_DURATION_SHORT, { opacity: 1, ease: TR_EASE_OUT, onComplete: done });
	};

	this.fadeOutElements = function(elements, done, hideAll) {
		$tl.to(elements, TR_DURATION_SHORT, { opacity: 0, ease: TR_EASE_OUT, onComplete: function() {
			if (hideAll) {
				$tl.set(elements, { display: 'none' });
			}
			if (done instanceof Function) {
				done();
			}
		}});
	};

	// show/hide ear
	this.showEar = function() {
		$tl.to(this._earIconElement, TR_DURATION_SHORT, { opacity: 1, ease: TR_EASE_OUT });
	};

	this.hideEar = function() {
		$tl.to(this._earIconElement, TR_DURATION_SHORT, { opacity: 0, ease: TR_EASE_OUT });
	};

	// locks user input
	this.lock = function() {
		this._locked = true;
	};

	this.unlock = function() {
		this._locked = false;
	};

	// reports locked state
	this.isLocked = function() {
		return this._locked;
	};

	// enter test flow at index fi
	this.enterFlow = function(stage, fi) {
		fi = (fi === undefined) ? 0 : fi;
		var flowStage = this.flows[stage];
		if (!flowStage || fi >= flowStage.length) {
			return;
		}
		var f = flowStage[fi];
		if (!f) {
			return;
		}
		var dt = f.delay || 0;
		var fi_next = fi + 1;
		function invoke() {
			f.action();
			self.enterFlow(stage, fi_next);
		}
		if (f && f.action instanceof Function) {
			if (dt) {
				$tl.delayedCall(dt, invoke);
			}
			else {
				invoke();
			}
		}
		else {
			self.enterFlow(stage, fi_next);
		}
	};

	//
	// virtual members
	//

	// subtest name; must be defined for each subtest
	this.name = '';

	// register resources to be preloaded
	this.resources = { };

	// pre-preload initialization
	this.prepare = function() { };

	// post-preload initialization
	this.init = function() { };

	// test entered event
	this.enter = function() { };

	// test exited event
	this.exit = function() { };

	// subtest flows
	this.flows = { };

	//
	// initialization
	//

	// add self to Survey
	Survey.addSubtest(this);
}

//
// survey module
//
var Survey = (function() {
	// list of subtest objects
	var subtests = [];

	// current subtest
	var activeSubtest = -1;

	// total user score
	var userScore = [];
	for (var t = 0; t < 8; t++) {
		userScore.push(0);
	}

	// score tallies
	var testRoundCount = [
		0, 5, 3, 3, 4, 4, 3, 0
	];
	var userTally = [];
	for (var t = 0; t < 8; t++) {
		var tallyList = [];
		for (var i = 0; i < testRoundCount[t]; i++) {
			tallyList.push(0);
		}
		userTally.push(tallyList);
	}

	// URL parameters
	var urlParams = {}; // memoized for later

	function fetchURLParams(src) {
		var match,
			pl     = /\+/g,
			search = /([^&=]+)=?([^&]*)/g,
			decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
			query  = src.search.substring(1);
		urlParams = {};
		while (match = search.exec(query)) {
			urlParams[decode(match[1])] = decode(match[2]);
		}
	}

	var panelManager = (function() {
		var activePanel = null;

		return {
			showPanel: function(element, animate) {
				if (animate) {
					$tl.set(element, { opacity: 0, left: 0 });
					$tl.to(element, TR_DURATION_SHORT, { opacity: 1, ease: TR_EASE_IN_OUT });
				}
				else {
					$tl.set(element, { opacity: 1, left: 0 });
				}
				activePanel = element;
			},
			hidePanel: function(element, animate) {
				if (animate) {
					$tl.to(element, TR_DURATION_SHORT, { opacity: 0, ease: TR_EASE_IN_OUT, onComplete: function() {
						$tl.set(element, { opacity: 0, left: '-110%' });
					}});
				}
				else {
					$tl.set(element, { opacity: 0, left: '-110%' });
				}
				activePanel = null;
			},
			gotoPanel: function(element, done) {
				$tl.set(element, { left: '110%' });
				if (activePanel) {
					$tl.to(activePanel, TR_DURATION_SHORT, { left: '-110%', ease: TR_EASE_IN_OUT });
				}
				$tl.to(element, TR_DURATION_SHORT, { left: 0, ease: TR_EASE_IN_OUT, onComplete: done });
				activePanel = element;
			}
		};
	}());

	function importSubtestScripts(subtestDir, subtestList, done) {
		var n_subtests = subtestList.length;
		if (n_subtests < 1)
			return;
		var n_loaded = 0;
		var documentBody = document.getElementsByTagName('body')[0];

		function loadScript(index) {
			var script = document.createElement('script');
			documentBody.appendChild(script);
			script.src = subtestDir + subtestList[index] + '/script.js?v=2.6';
			script.addEventListener('load', function() {
				if (++n_loaded === n_subtests)
					done();
				if (++index < n_subtests)
					loadScript(index);
			});
		}
		loadScript(0);
	}

	var surveyResources = {
		data: {
			names: 'intl/$locale/names.json',
			texts: 'intl/$locale/texts.json'
		},
		graphics: {
			ear: 'img/ear.svg'
		},
		sfx: {
			audioTest: 'intl/$locale/audiotest.mp3'
		}
	};

	for (var num = 1; num <= 10; num++) {
		surveyResources.sfx['num' + num] = 'intl/$locale/numb_' + num + '.mp3';
	}

	var surveyAssets = {};

	// welcome panel
	function setupWelcomePanel() {
		var welcomeTitle = $q('#boca-title');
		var buttonGotoSoundCheck = $q('#button-goto-soundcheck');
		var rotateDeviceNotice = $q('#rotate-device-notice');
		// apply locale strings
		var localTexts = surveyAssets.data.texts;
		welcomeTitle.innerText = localTexts['title'];
		buttonGotoSoundCheck.value = localTexts['go_to_sound_check'];
		rotateDeviceNotice.innerText = localTexts['rotate_device'];
		// register events
		var gotoSoundCheckButtonClicked = false;
		buttonGotoSoundCheck.addEventListener('click', function() {
			if (!gotoSoundCheckButtonClicked) {
				window.parent.enterFullscreen && window.parent.enterFullscreen(); // enter fullscreen when possible
				gotoSoundCheckButtonClicked = true;
				// proceed to audio test
				var nextPanel = $q('#panel-soundtest');
				panelManager.gotoPanel(nextPanel, function() {
					enterSoundTest();
				});
			}
		});
		// check mobile
		if (window.parent.isMobileOrTablet && window.parent.isMobileOrTablet())
		{
			rotateDeviceNotice.style.display = 'block';
		}
		$tl.delayedCall(3, function() {
			Wobble(buttonGotoSoundCheck);
		});
	}

	// sound check panel
	var soundTestStarted = false;
	var soundTestNextClicked = false;

	var soundTestDigit = 0;
	var soundTestDigitSfx = null;

	var soundTestEarIcon = null;

	function selectSoundTestDigit() {
		soundTestDigit = GetRandomInt(1, 10);
		soundTestDigitSfx = surveyAssets.sfx['num' + soundTestDigit];
		// rewire events
		surveyAssets.sfx.audioTest.once('end', function() {
			if (!soundTestDigitSfx) {
				return;
			}
			$tl.delayedCall(0.5, function() {
				soundTestDigitSfx.play();
			});
		});
	}

	function playSoundTest() {
		surveyAssets.sfx.audioTest.play();
	}

	function setupSoundCheckPanel() {
		var soundTestTitle = $q('#panel-soundtest-title');
		var soundTestInfo = $q('#panel-soundtest-info');
		var soundTestBtns = $q_all('#panel-soundtest .button-container .toggle-button');
		// apply locale strings
		var localTexts = surveyAssets.data.texts;
		soundTestTitle.innerText = localTexts['sound_test_title'];
		soundTestInfo.innerHTML = localTexts['sound_test_info'];
		// register events
		for (var btn_i = 0; btn_i < 10; btn_i++) {
			soundTestBtns[btn_i].addEventListener('click', function() {
				if (!soundTestStarted) {
					return;
				}
				window.parent.enterFullscreen && window.parent.enterFullscreen(); // enter fullscreen when possible
				var btn = this;
				var dataNum = parseInt(this.getAttribute('data-num'), 10);
				var correctAnswer = dataNum === soundTestDigit;
				this.className = 'toggle-button digit ' + ((correctAnswer) ? 'active' : 'mistake');
				soundTestStarted = false;
				if (correctAnswer) {
					$tl.delayedCall(1.5, function() {
						// go to directions panel
						var panelDirections = $q('#panel-directions');
						panelManager.gotoPanel(panelDirections);
					});
				}
				else {
					$tl.delayedCall(1.5, function() {
						// hide buttons
						var btnContainers = $q_all('#panel-soundtest .button-container');
						$tl.to(btnContainers, TR_DURATION_SHORT, { opacity: 0, ease: TR_EASE_OUT, onComplete: function() {
							$tl.set(btnContainers, { display: 'none' });
							// reset button state
							btn.className = 'toggle-button digit';
						}});
						// pick another random digit
						selectSoundTestDigit();
						$tl.delayedCall(1.5, function() {
							// restart test
							enterSoundTest();
						});
					});
				}
			});
		}
		selectSoundTestDigit();
		soundTestEarIcon = $q('#panel-soundtest .earicon');
	}

	function enterSoundTest() {
		$tl.delayedCall(0.35, function() {
			playSoundTest();
			$tl.to(soundTestEarIcon, TR_DURATION_SHORT, { opacity: 1, ease: TR_EASE_OUT });
		});
		var btnContainers = $q_all('#panel-soundtest .button-container');
		$tl.set(btnContainers, { display: 'block' });
		$tl.to(btnContainers, TR_DURATION_LONG, { opacity: 1, ease: TR_EASE_OUT });
		$tl.delayedCall(8.5, function() {
			$tl.to(soundTestEarIcon, TR_DURATION_SHORT, { opacity: 0, ease: TR_EASE_OUT });
			soundTestStarted = true;
		});
	}

	// directions panel
	function setupDirectionsPanel() {
		var directionsTitle = $q('#panel-directions-title');
		var directionsInfo = $q('#panel-directions-info');
		var buttonBeginTest = $q('#button-begin-survey');
		// apply locale strings
		var localTexts = surveyAssets.data.texts;
		directionsTitle.innerText = localTexts['directions_title'];
		directionsInfo.innerHTML = localTexts['directions_info'];
		buttonBeginTest.value = localTexts['begin_test'];
		// register events
		var beginTestButtonClicked = false;
		buttonBeginTest.addEventListener('click', function() {
			if (!beginTestButtonClicked) {
				beginTestButtonClicked = true;
				window.parent.enterFullscreen && window.parent.enterFullscreen(); // enter fullscreen when possible
				// go to first subtest
				Survey.next();
			}
		});
	}

	// finish panel
	function setupFinishPanel() {
		// apply locale strings and update scoreboard
		var localTexts = surveyAssets.data.texts;
		var localNames = surveyAssets.data.names;
		$q('#panel-finish-title').innerText = localTexts['finish_title'];
		$q('#panel-finish-caption-completed').innerText = localTexts['finish_caption_completed'];
		$q('#panel-finish-caption-total').innerText = localTexts['finish_caption_total'];
		var scoreTotal = 0;
		var scoreTotalElement = $q('#score-total');
		for (var i = 0; i < 8; i++) {
			var testId = String(i + 1);
			var score = userScore[i];
			scoreTotal += score;
			var testNameElement = $q('#panel-finish-test-' + testId);
			testNameElement.innerText = localNames["test_" + testId];
			var scoreElement = $q('#score-test' + testId);
			scoreElement.innerText = score;
		}
		scoreTotalElement.innerText = scoreTotal;
	}

	function showFinishPanelMsg(message, isError) {
		var msgBarElement = $q('#panel-finish .message-bar');
		var msgBarContentElement = $q('#panel-finish .message-bar .message-content');
		msgBarElement.className = 'message-bar ' + ((isError) ? 'error' : 'success');
		msgBarContentElement.innerText = message;
		$tl.to(msgBarElement, TR_DURATION_SHORTER, { bottom: 0, opacity: 1, ease: TR_EASE_IN_OUT, delay: 0.2 });
	}

	function surveyDone() {
		var id = urlParams.id;
		var totalScore = userScore.reduce(function(a, b) { return a + b }, 0);
		var results = {
			total: totalScore,
			domains: [
				{domain: "memory_immediate_recall", name: "Memory/Immediate Recall", score: userScore[0], max: 2, tally: userTally[0]},
				{domain: "memory_delayed_recall", name: "Memory/Delayed Recall", score: userScore[7], max: 5, tally: userTally[7]},
				{domain: "executive_function_visuospatial", name: "Executive function/ Visuospatial", score: userScore[3], max: 4, tally: userTally[3]},
				{domain: "executive_function_mental_rotation", name: "Executive function/ Mental rotation", score: userScore[2], max: 3, tally: userTally[2]},
				{domain: "attention", name: "Attention", score: userScore[4], max: 4, tally: userTally[4]},
				{domain: "mental_math", name: "Mental math", score: userScore[5], max: 4, tally: userTally[5]},
				{domain: "language_prefrontal_synthesis", name: "Language/Prefrontal Synthesis", score: userScore[1], max: 5, tally: userTally[1]},
				{domain: "orientation", name: "Orientation", score: userScore[6], max: 3, tally: userTally[6]}
			]
		};

		if (__DEBUG) {
			return;
		}
		const base_url = urlParams.bu || '';
		var url = base_url + '/api/v1/tests/' + id + '/complete';
		// make a PUT request
		var resultsJSON = JSON.stringify(results);
		var xhr = new XMLHttpRequest();
		xhr.open('PUT', url, true);
		xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
		xhr.send(resultsJSON);
		// for debugging, can be removed

		xhr.onload = function() {

			if (xhr.readyState === 4 && xhr.status === 200) {
				// success
				showFinishPanelMsg(surveyAssets.data.texts['finish_success'], false);
			}
			else {
				// something went wrong
				showFinishPanelMsg(surveyAssets.data.texts['finish_error'], true);
			}
		};
	}

	return {
		getAssets: function() {
			return surveyAssets;
		},
		addSubtest: function(subtestObj) {
			subtests.push(subtestObj);
		},
		getSubtests: function() {
			return subtests;
		},
		next: function() {
			// lock and exit current subtest
			var currentSubtest = (activeSubtest >= 0) ? subtests[activeSubtest] : null;
			if (currentSubtest) {
				currentSubtest._exit();
			}
			// go to next question
			var nextSubtest = subtests[++activeSubtest];
			if (nextSubtest) {
				var nextPanel = nextSubtest._panelElement;
				panelManager.gotoPanel(nextPanel, function() {
					nextSubtest._enter();
				});
			}
			else {
				// we've reached the end
				setupFinishPanel();
				var nextPanel = $q('#panel-finish');
				panelManager.gotoPanel(nextPanel);
				surveyDone();
			}
		},
		addUserScore: function(toAdd) {
			toAdd = toAdd || 0;
			if (userScore[activeSubtest]) {
				userScore[activeSubtest] += toAdd;
			}
			else {
				userScore[activeSubtest] = toAdd;
			}
		},
		addUserTally: function(roundIndex, value) {
			var tallyList = userTally[activeSubtest];
			if (tallyList.length < roundIndex) {
				for (var i = tallyList.length; i < roundIndex; i++) {
					tallyList.push(0);
				}
			}
			tallyList[roundIndex] += value;
		},
		// application starting point
		main: function() {
			// compile URL parameters
			fetchURLParams(window.parent.location);
			// fetch locale from URL parameter
			if (urlParams.locale) {
				var localeNorm = String(urlParams.locale).toLowerCase();
				if (SURVEY_LOCALE_VALID.indexOf(localeNorm) > -1) {
					// apply locale only when it's in the list of available locales
					// the default will be used otherwise
					surveyLocale = localeNorm;
				}
			}
			// show the loadscreen panel
			var loadscreenPanel = $q('#panel-loadscreen');
			panelManager.showPanel(loadscreenPanel, false);
			// import all subtest scripts
			var subtestPaths = [
				'01_memory_immediate_recall',
				'02_language_prefrontal_synthesis',
				'03_executive_function_mental_rotation',
				'04_executive_function_visuospatial',
				'05_attention',
				'06_mental_math',
				'07_orientation',
				'08_memory_delayed_recall'
			];
			importSubtestScripts('tests/', subtestPaths, function() {
				// done importing scripts

				// sanity check
				if (subtests.length < 1)
					return;

				// register survey resources
				ResourceLoader.addResources(surveyResources, '_Survey_', 'resources/');

				// let each test register its resources
				subtests.forEach(function(subtestObj, index) {
					subtestObj._prepare();
					var subtestName = subtestObj.name;
					var contextPath = 'tests/' + subtestPaths[index] + '/resources/';
					if (subtestName) {
						ResourceLoader.addResources(subtestObj.resources, subtestName, contextPath);
					}
				});

				ResourceLoader.loadAll(function() {
					// finished loading all resources

					// fetch survey assets
					surveyAssets = ResourceLoader.getAssets('_Survey_');

					// create and init all subtests
					subtests.forEach(function(subtestObj) {
						subtestObj._create();
						subtestObj._init();
					});

					// setup non-test panels
					setupWelcomePanel();
					setupSoundCheckPanel();
					setupDirectionsPanel();

					if (__DEBUG) {
						Survey.next();
						return;
					}
					// run survey
					panelManager.hidePanel(loadscreenPanel, true);
					var welcomePanel = $q('#panel-welcome');
					panelManager.showPanel(welcomePanel, true);
				});
			});
		}
	};
}());

// run everything on window load
window.addEventListener('load', Survey.main);
