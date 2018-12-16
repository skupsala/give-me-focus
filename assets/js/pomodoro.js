(function () {

  var POMODORO_MINUTES = 25;
  var SHORT_BREAK_MINUTES = 5;
  var LONG_BREAK_MINUTES = 15;

  var PHASE_DURATIONS = {
    'POMODORO': POMODORO_MINUTES * 60 * 1000,
    'SHORT_BREAK': SHORT_BREAK_MINUTES * 60 * 1000,
    'LONG_BREAK': LONG_BREAK_MINUTES * 60 * 1000,
  };

  var currentPhaseIndex = 0;
  var PHASE_ROTATION = [
    'POMODORO',
    'SHORT_BREAK',
    'POMODORO',
    'SHORT_BREAK',
    'POMODORO',
    'SHORT_BREAK',
    'POMODORO',
    'LONG_BREAK'
  ];

  var _duration = null;
  var _startTime = null;
  var _interval = null;
  var _timerElem = document.getElementById('timer');
  var _focusTextInputElem = document.getElementById('focus-text-input');
  var _focusTextValidationErrorElem = document.getElementById('focus-text-input-validation-error');
  var _focusTextElem = document.getElementById('focus-text');
  var _startButton = document.getElementById('start');
  var _stopButton = document.getElementById('stop');
  var _resetButton = document.getElementById('reset');

  function formatTimer(milliseconds) {
    var remainingSeconds = Math.round(milliseconds / 1000);
    var minutes = Math.floor(remainingSeconds / 60);
    if (minutes < 0) minutes = 0;
    var seconds = remainingSeconds - minutes * 60;
    if (seconds < 0) seconds = 0;
    return (minutes < 10 ? '0' : '') + minutes + ' : ' + (seconds < 10 ? '0' : '') + seconds;
  }

  function startTimer() {
    _startButton.classList.add('disabled');
    _stopButton.classList.remove('disabled');

    _startTime = Date.now();

    if (getCurrentPhase() === 'POMODORO') {
      lockFocusField();
    }

    _interval = setInterval(function () {
      var timerText = formatTimer(_duration - (Date.now() - _startTime));
      document.title = timerText + ' - Give me focus';
      _timerElem.innerText = timerText;
      if (_startTime + _duration < Date.now()) {
        finishTimer();
      }
    }, 1000);
  }

  function finishTimer() {
    _startButton.classList.remove('disabled');
    _stopButton.classList.add('disabled');
    document.title = 'Give me focus - simple pomodoro app';

    if (_interval !== null) {
      clearInterval(_interval);
      _interval = null;
    }

    if (getCurrentPhase() === 'POMODORO') {
      enableFocusField();
    }

    formatTimer(0);
  }

  function stopTimer() {
    _startButton.classList.remove('disabled');
    _stopButton.classList.add('disabled');
    document.title = 'Give me focus - simple pomodoro app';

    if (_interval !== null) {
      clearInterval(_interval);
      _interval = null;
    }

    _duration = _duration - (Date.now() - _startTime);
  }

  function resetTimer() {
    setPhase(getCurrentPhase());
  }

  function lockFocusField() {
    document.getElementById('focus-text-container').style.display = 'block';
    var text = _focusTextInputElem.value;
    _focusTextInputElem.style.display = 'none';
    _focusTextElem.innerText = text;
    _focusTextElem.style.display = 'block';
    _focusTextValidationErrorElem.style.display = 'none';

  }

  function enableFocusField() {
    document.getElementById('focus-text-container').style.display = 'block';
    _focusTextInputElem.style.display = 'block';
    _focusTextInputElem.focus();
    _focusTextInputElem.select();
    _focusTextElem.style.display = 'none';
    _focusTextValidationErrorElem.style.display = 'block';

  }

  function getCurrentPhase() {
    return PHASE_ROTATION[currentPhaseIndex];
  }

  function setPhase(newPhase) {
    // Roll to next phase
    // currentPhaseIndex = currentPhaseIndex >= PHASE_ROTATION.length - 1 ? 0 : currentPhaseIndex + 1;

    // TODO rotate next occurence of phases - not first
    currentPhaseIndex = PHASE_ROTATION.indexOf(newPhase);
    _duration = PHASE_DURATIONS[getCurrentPhase()];
    _timerElem.innerText = formatTimer(_duration);

    switch (getCurrentPhase()) {
      case 'POMODORO':
        enableFocusField();
        break;
      case 'SHORT_BREAK':
        document.getElementById('focus-text-container').style.display = 'none';
        break;
      case 'LONG_BREAK':
        document.getElementById('focus-text-container').style.display = 'none';
        break;
    }
  }

  function validateFocusText() {
    var text = _focusTextInputElem.value.trim();
    if (text) {
      _focusTextValidationErrorElem.style.visibility = 'hidden';
      _startButton.classList.remove('disabled');
      return true;
    } else {
      _startButton.classList.add('disabled');
      _focusTextValidationErrorElem.style.visibility = 'visible';
      return false;
    }
  }

  function init() {

    _startButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      if (getCurrentPhase() === 'POMODORO') {
        if (validateFocusText()) {
          startTimer();
        }
      } else {
        startTimer();
      }
    });

    _stopButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      stopTimer();
    });

    _resetButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      finishTimer();
      resetTimer();
    });

    _focusTextInputElem.oninput = function (evt) {
      validateFocusText();
    };

    document.getElementById('pomodoro').addEventListener('click', function () {
      setPhase('POMODORO');
      finishTimer();
      document.querySelector('#phase-container .active').classList.remove('active');
      document.querySelector('#phase-container #pomodoro').classList.add('active');
    });

    document.getElementById('short-break').addEventListener('click', function () {
      setPhase('SHORT_BREAK');
      finishTimer();
      document.querySelector('#phase-container .active').classList.remove('active');
      document.querySelector('#phase-container #short-break').classList.add('active');
    });

    document.getElementById('long-break').addEventListener('click', function () {
      setPhase('LONG_BREAK');
      finishTimer();
      document.querySelector('#phase-container .active').classList.remove('active');
      document.querySelector('#phase-container #long-break').classList.add('active');
    });

    setPhase('POMODORO');

  }

  init();

})();