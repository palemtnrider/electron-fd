// sound fix
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


  let currentPlay = 0
  const fixPlay = (win) => {
      console.log('fuck flowdock for not using the latest')
      let orig = win.Howl.prototype.play
      let suspendPromise = win.Howler.ctx.suspend()

      win.Howl.prototype.play = function() {
        let self = this
        let args = arguments
        currentPlay++        
        return suspendPromise.then(() => {
          if (currentPlay === 1)
            return win.Howler.ctx.resume()
        })
        .then(() => {
          console.log('fuck flowdock play:', currentPlay)
          return orig.apply(self, arguments)
        })
        .then(() => {
          return onEnd(self)
        })
        .then(timeout(4000)) //yes this shit because one the event fired as first finishes play
        .then(() => {
          currentPlay--
          console.log('fuck flowdock play end:', currentPlay)
          if (currentPlay === 0) {  
            suspendPromise = win.Howler.ctx.suspend()
          }
        })
      }
  }

  // wait the page to finish initialize

  timeout(2000)()
  .then(() => {
    fixPlay(window)
  })
}

// Spell checker
const {webFrame, ipcRenderer, remote} = require('electron')
const {nativeImage, app} = remote

webFrame.setSpellCheckProvider("en-GB", false, {
  spellCheck: function (text) {    
    console.log(text)
        var res = ipcRenderer.sendSync('checkspell', text)
        return res != null? res : true
    }
})

// unread Badges
function updateDockBadge(title) {
  let messageCount = (/\(([0-9]+)\)/).exec(title)
  messageCount = messageCount ? Number(messageCount[1]) : 0
  if (messageCount === 0) {
    messageCount = (/\(\*\)/).test(title) ? '*' : 0
  }
  console.log('messageCount: ', messageCount)
  setBadge(messageCount)
}

remote.getCurrentWindow().on('page-title-updated', (e, title) => {
  e.preventDefault()
  updateDockBadge(title)
})

function setBadge(unreadCount) {
  if (process.platform === 'darwin') {
    app.dock.setBadge(unreadCount === 0 ? '' : unreadCount.toString())
  } else if (process.platform === 'win32') {
    const win = remote.getCurrentWindow()
    if (unreadCount === 0) {
      win.setOverlayIcon(null, '')
    } else {
      const text = unreadCount.toString().length > 3 ? '+' : unreadCount.toString()
      const canvas = document.createElement('canvas')
      canvas.height = 140
      canvas.width = 140

      const ctx = canvas.getContext('2d')
      ctx.fillStyle = 'red'
      ctx.beginPath()
      ctx.ellipse(70, 70, 65, 65, 0, 0, 2 * Math.PI)
      ctx.fill()
      ctx.textAlign = 'center'
      ctx.fillStyle = 'white'

      if (text.length > 2) {
        ctx.font = '65px sans-serif'
        ctx.fillText(text, 70, 90)
      } else if (text.length > 1) {
        ctx.font = 'bold 80px sans-serif'
        ctx.fillText(text, 70, 97)
      } else {
        ctx.font = 'bold 100px sans-serif'
        ctx.fillText(text, 70, 106)
      }

      const badgeDataURL = canvas.toDataURL()
      const img = nativeImage.createFromDataURL(badgeDataURL)
      win.setOverlayIcon(img, text)
    }
  }
}