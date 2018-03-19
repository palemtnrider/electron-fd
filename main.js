//
// Copied from electron quick start
//
const electron = require('electron')
const {app, BrowserWindow, shell, Menu} = electron
const path = require('path')
//const  electronDebug = require('electron-debug')
//electronDebug({enabled: true, showDevTools: true});
// Module to create native browser window.

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win




const APP_ICON = path.join(__dirname, 'app/resources', 'icon')

const iconPath = () => {
  return APP_ICON + (process.platform === 'win32' ? '.ico' : '.png')
}

// Single instance
const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (win) {
    if (win.isMinimized()) {
      win.restore()
    }
    win.focus()
  }
})

if (shouldQuit) {
  app.quit()
}

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    height: 700,
    title: 'Flowdock',
    icon: iconPath(),
    webPreferences: {
      preload: path.join(__dirname, 'app/js/preload.js'),
      plugins: true,
      webSecurity: true
    }
  })
  // set Menu
  require('./app/menu.js')

  // and load the index.html of the app.
  win.loadURL(`https://www.flowdock.com/app`)
  const page = win.webContents

  // Open the DevTools.
  // page.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  // open links in new window
  page.on('new-window', (event, url, fileName, disposition, options) => {
    if (win.useDefaultWindowBehaviour) {
      win.useDefaultWindowBehaviour = false
      return
    }
    event.preventDefault()
    // console.log('Open url', url, disposition)
    if (disposition === 'new-window') {
      shell.openExternal(url)
    }
  })

  electron.powerMonitor.on('resume', () => {
    console.log('resume/reload')
    win.reload()
  })

  return win
}
app.setName('flowdock-app')
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
