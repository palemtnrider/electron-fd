// ==UserScript==
// @name        fuck flowdock
// @namespace   flocwdock.com
// @include     https://www.flowdock.com/app/*
// @version     1
// @grant       none
// ==/UserScript==
onload = () => {
  window.setTimeout(function () {
    (function (win) {
        window.console.log('fuck flowdock');
        var orig = win.Howl.prototype.play;
        win.Howl.prototype.play = function () {
            var self = this;
            return win.Howler.ctx.resume().then(function () {
                window.console.log('fuck flowdock play');
                return orig.apply(self, arguments);
            }).then(teimout(3000))
            .then(() => {
                return windows.setTimeout(() => {
                    return win.Howler.ctx.suspend();
                })
            });
        };
        win.Howler.ctx.suspend();
    })(window);
  }, 1000);
}

const timeout = time => {
  return () => {
    var promise = new Promise()

    window.setTimeout(() => {
        promise.resolve()
    }, time)

    return promise
  }
}