// file-version: 2014:08:05/14:50
if ((typeof Mpathy) == "undefined") {
  var Mpathy = {};
}
Mpathy.sites = [];

(function () {
  var functions = ['setSegment', 'newPI'];
  var emptyFunction = function () {};
  if (typeof Mpathy != 'object') {
    Mpathy = {};
  }
  for (var i = 0, j = functions.length; i < j; i++) {
    if (!(functions[i] in Mpathy) || typeof Mpathy[functions[i]] != 'function') {
      Mpathy[functions[i]] = emptyFunction;
    }
  }
  if (!'modules' in Mpathy) {
    Mpathy.modules = {};
  }
  Mpathy.stats = { mode: 'slim' };
  Mpathy.mode = 'slim';
  Mpathy.ready = false;
})();