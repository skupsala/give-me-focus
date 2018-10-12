(function () {
  var POMODORO = 1 * 2 * 1000;

  var _startTime = null;
  var _interval = null;

  function formatTimer(milliseconds) {
    var remainingSeconds = Math.round(milliseconds / 1000);
    var minutes = Math.floor(remainingSeconds / 60);
    var seconds = remainingSeconds - minutes * 60;
    return minutes + ' : ' + seconds;
  }

  function startTimer() {
    _startTime = Date.now();
    var focusTextElem = document.getElementById('focus-text');
    var text = focusTextElem.value;
    focusTextElem.style.display = 'none';
    var focusBlockquote = document.getElementById('focus-blockquote');
    focusBlockquote.innerText = text;
    focusBlockquote.style.display = 'block';
    _interval = setInterval(function () {
      document.getElementById('timer').innerText = formatTimer(POMODORO - (Date.now() - _startTime));

      if (_startTime + POMODORO < Date.now()) {
        resetTimer();
      }
    }, 1000);
  }

  function resetTimer() {
    if (_interval !== null) {
      clearInterval(_interval);
      _interval = null;
      var focusTextElem = document.getElementById('focus-text');
      focusTextElem.style.display = 'block';
      var focusBlockquote = document.getElementById('focus-blockquote');
      focusBlockquote.style.display = 'none';
      // document.getElementById('timer').innerText = formatTimer(POMODORO);
      alert('Valmis!');
    }
  }

  function init() {
    document.getElementById('timer').innerText = formatTimer(POMODORO);
    document.getElementById('start-pomodoro').addEventListener('click', function (evt) {
      evt.preventDefault();
      startTimer();
    });
  }

  init();
})();