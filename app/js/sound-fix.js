// ==UserScript==
// @name        fuck flowdock
// @namespace   flocwdock.com
// @include     https://www.flowdock.com/*
// @version     1
// @grant       none
// ==/UserScript==
onload = () => {
  const timeout = time => {
    return () => {
      let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, time)
      })

      return promise
    }
  }

  const onEnd = (stream) => {
    let promise = new Promise((resolve, reject) => {
      stream.on('end', resolve)
    })

    return promise
  }


  let currentPlay = 0;
  const fixPlay = (win) => {
      console.log('fuck flowdock for not using the latest');
      let orig = win.Howl.prototype.play;
      let suspendPromise = win.Howler.ctx.suspend();

      win.Howl.prototype.play = function() {
        let self = this
        let args = arguments
        currentPlay++        
        return suspendPromise.then(() => {
          if (currentPlay === 1)
            return win.Howler.ctx.resume()
        })
        .then(() => {
          console.log('fuck flowdock play:', currentPlay);
          return orig.apply(self, arguments);
        })
        .then(() => {
          return onEnd(self)
        })
        .then(timeout(2000)) //yes this shit because one the event fired as first finishes play
        .then(() => {
          currentPlay--
          console.log('fuck flowdock play end:', currentPlay);
          if (currentPlay === 0) {  
            suspendPromise = win.Howler.ctx.suspend();
          }
        })
      };
  }

  // wait the page to finish initialize

  timeout(2000)()
  .then(() => {
    fixPlay(window)
  });
}