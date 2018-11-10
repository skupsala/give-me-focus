(function () {

  var POMODORO_MINUTES = 0.1;
  var SHORT_BREAK_MINUTES = 0.05;
  var LONG_BREAK_MINUTES = 0.075;

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

  function formatTimer(milliseconds) {
    var remainingSeconds = Math.round(milliseconds / 1000);
    var minutes = Math.floor(remainingSeconds / 60);
    var seconds = remainingSeconds - minutes * 60;
    return (minutes < 10 ? '0' : '') + minutes + ' : ' + (seconds < 10 ? '0' : '') + seconds;
  }

  function startTimer() {
    _startButton.classList.add('disabled');;

    _startTime = Date.now();

    if (getCurrentPhase() === 'POMODORO') {
      lockFocusField();
    }

    _interval = setInterval(function () {
      _timerElem.innerText = formatTimer(_duration - (Date.now() - _startTime));
      if (_startTime + _duration < Date.now()) {
        resetTimer();
      }
    }, 500);
  }

  function resetTimer() {
    _startButton.classList.remove('disabled');

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

    if (_interval !== null) {
      clearInterval(_interval);
      _interval = null;
    }

    _duration = _duration - (Date.now() - _startTime);
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

    _focusTextInputElem.oninput = function (evt) {
      validateFocusText();
    };

    document.getElementById('pomodoro').addEventListener('click', function () {
      setPhase('POMODORO');
      resetTimer();
      document.querySelector('#phase-container .active').classList.remove('active');
      document.querySelector('#phase-container #pomodoro').classList.add('active');
    });

    document.getElementById('short-break').addEventListener('click', function () {
      setPhase('SHORT_BREAK');
      resetTimer();
      document.querySelector('#phase-container .active').classList.remove('active');
      document.querySelector('#phase-container #short-break').classList.add('active');
    });

    document.getElementById('long-break').addEventListener('click', function () {
      setPhase('LONG_BREAK');
      resetTimer();
      document.querySelector('#phase-container .active').classList.remove('active');
      document.querySelector('#phase-container #long-break').classList.add('active');
    });

    setPhase('POMODORO');

  }

  init();

})();