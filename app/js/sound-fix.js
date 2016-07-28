// ==UserScript==
// @name        fuck flowdock
// @namespace   flocwdock.com
// @include     https://www.flowdock.com/app/*
// @version     1
// @grant       none
// ==/UserScript==
onload = () => {
  const timeout = time => {
    return () => {
      var promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, time)
      })

      return promise
    }
  }

  timeout(1000)()
  .then(() => {
    (function (win) {
      console.log('fuck flowdock');
      var orig = win.Howl.prototype.play;
      win.Howl.prototype.play = () => {
        var self = this;
        return win.Howler.ctx.resume().then(() => {
          console.log('fuck flowdock play');
            return orig.apply(self, arguments);
        }).then(timeout(3000))
        .then(() => {
            return windows.setTimeout(() => {
              return win.Howler.ctx.suspend();
          })
        });
      };

      win.Howler.ctx.suspend()
    })(window);
  });
}