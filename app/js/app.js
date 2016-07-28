onload = () => {
  
  const webview = document.getElementById('main')
  webview.addEventListener('dom-ready', () => {
    // webview.openDevTools()  
  })

  webview.addEventListener('new-window', (e) => {
    console.log('new-window', e)
    e.preventDefault()
    e.stopPropagation()
    const shell = require('electron').shell
    if (e.disposition === 'foreground-tab') {
      shell.openExternal(e.url)
    }
  })
}