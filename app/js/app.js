onload = () => {
  
  const webview = document.getElementById('main')
  webview.addEventListener('dom-ready', () => {
    // webview.openDevTools()  
  })

  webview.addEventListener('new-window', (e) => {
    console.log('new-window', e)
    
    const shell = require('electron').shell
    if (e.disposition === 'new-window') {
      e.preventDefault()
      shell.openExternal(e.url)
    }
  })
}